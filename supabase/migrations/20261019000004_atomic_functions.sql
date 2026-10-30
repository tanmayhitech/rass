-- ============================================================================
-- Migration: 20261019000004_atomic_functions.sql
-- Description: Stored procedures for atomic stock operations and coupon validation
-- ============================================================================

-- 1. ATOMIC INVENTORY RESERVATION (Prevents overselling during checkout)
CREATE OR REPLACE FUNCTION reserve_inventory_atomic(
    p_order_id TEXT,
    p_variant_id TEXT,
    p_quantity INT
)
RETURNS JSONB AS $$
DECLARE
    v_item inventory_items%ROWTYPE;
    v_available INT;
BEGIN
    -- Acquire exclusive row lock on the inventory item
    SELECT * INTO v_item
    FROM inventory_items
    WHERE variant_id = p_variant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Inventory item not found for variant ' || p_variant_id);
    END IF;

    v_available := v_item.quantity_on_hand - v_item.quantity_reserved;

    IF v_available < p_quantity THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Insufficient stock available. Requested: ' || p_quantity || ', Available: ' || v_available
        );
    END IF;

    -- Increment reservation
    UPDATE inventory_items
    SET quantity_reserved = quantity_reserved + p_quantity,
        updated_at = NOW()
    WHERE id = v_item.id;

    -- Log movement
    INSERT INTO inventory_movements (
        inventory_item_id,
        movement_type,
        quantity_change,
        quantity_after,
        reference_id,
        notes
    ) VALUES (
        v_item.id,
        'order_reservation',
        p_quantity,
        v_item.quantity_on_hand - (v_item.quantity_reserved + p_quantity),
        p_order_id,
        'Checkout stock reservation'
    );

    RETURN jsonb_build_object('success', true, 'message', 'Stock reserved successfully', 'reserved', p_quantity);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. ATOMIC INVENTORY DEDUCTION (Called upon payment capture)
CREATE OR REPLACE FUNCTION deduct_inventory_atomic(
    p_order_id TEXT,
    p_variant_id TEXT,
    p_quantity INT
)
RETURNS JSONB AS $$
DECLARE
    v_item inventory_items%ROWTYPE;
BEGIN
    SELECT * INTO v_item
    FROM inventory_items
    WHERE variant_id = p_variant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Variant inventory not found');
    END IF;

    -- Deduct both on_hand and reserved
    UPDATE inventory_items
    SET quantity_on_hand = GREATEST(0, quantity_on_hand - p_quantity),
        quantity_reserved = GREATEST(0, quantity_reserved - p_quantity),
        updated_at = NOW()
    WHERE id = v_item.id;

    -- Record immutable movement
    INSERT INTO inventory_movements (
        inventory_item_id,
        movement_type,
        quantity_change,
        quantity_after,
        reference_id,
        notes
    ) VALUES (
        v_item.id,
        'order_deduction',
        -p_quantity,
        v_item.quantity_on_hand - p_quantity,
        p_order_id,
        'Order payment captured and confirmed'
    );

    RETURN jsonb_build_object('success', true, 'message', 'Stock deducted successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. ATOMIC INVENTORY RELEASE (Called on payment failure, cancellation, or checkout abandonment)
CREATE OR REPLACE FUNCTION release_inventory_atomic(
    p_order_id TEXT,
    p_variant_id TEXT,
    p_quantity INT
)
RETURNS JSONB AS $$
DECLARE
    v_item inventory_items%ROWTYPE;
BEGIN
    SELECT * INTO v_item
    FROM inventory_items
    WHERE variant_id = p_variant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Variant inventory not found');
    END IF;

    UPDATE inventory_items
    SET quantity_reserved = GREATEST(0, quantity_reserved - p_quantity),
        updated_at = NOW()
    WHERE id = v_item.id;

    INSERT INTO inventory_movements (
        inventory_item_id,
        movement_type,
        quantity_change,
        quantity_after,
        reference_id,
        notes
    ) VALUES (
        v_item.id,
        'order_restock',
        p_quantity,
        v_item.quantity_on_hand - GREATEST(0, v_item.quantity_reserved - p_quantity),
        p_order_id,
        'Stock reservation released'
    );

    RETURN jsonb_build_object('success', true, 'message', 'Reservation released successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. SERVER-SIDE COUPON VALIDATION & CALCULATION
CREATE OR REPLACE FUNCTION validate_and_apply_coupon(
    p_code TEXT,
    p_subtotal NUMERIC,
    p_customer_email TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_coupon coupons%ROWTYPE;
    v_customer_redemptions INT;
    v_discount NUMERIC := 0;
BEGIN
    SELECT * INTO v_coupon
    FROM coupons
    WHERE UPPER(code) = UPPER(TRIM(p_code))
      AND is_active = TRUE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'message', 'Invalid or inactive promotional code.');
    END IF;

    -- Check dates
    IF v_coupon.expiry_date IS NOT NULL AND v_coupon.expiry_date < NOW() THEN
        RETURN jsonb_build_object('valid', false, 'message', 'This promotional code has expired.');
    END IF;

    -- Check min order value
    IF p_subtotal < v_coupon.min_order_value THEN
        RETURN jsonb_build_object(
            'valid', false,
            'message', 'Minimum order value of ₹' || v_coupon.min_order_value || ' required for this code.'
        );
    END IF;

    -- Check global redemptions
    IF v_coupon.max_redemptions IS NOT NULL AND v_coupon.redemption_count >= v_coupon.max_redemptions THEN
        RETURN jsonb_build_object('valid', false, 'message', 'Promotional code redemption limit reached.');
    END IF;

    -- Check per-customer limit
    SELECT COUNT(*) INTO v_customer_redemptions
    FROM coupon_redemptions
    WHERE coupon_id = v_coupon.id AND customer_email = p_customer_email;

    IF v_customer_redemptions >= v_coupon.max_per_customer THEN
        RETURN jsonb_build_object('valid', false, 'message', 'You have already redeemed this promotional code.');
    END IF;

    -- Calculate discount
    IF v_coupon.discount_type = 'percentage' THEN
        v_discount := ROUND((p_subtotal * v_coupon.discount_value) / 100.0, 2);
        IF v_coupon.max_discount_cap IS NOT NULL AND v_discount > v_coupon.max_discount_cap THEN
            v_discount := v_coupon.max_discount_cap;
        END IF;
    ELSE
        v_discount := LEAST(v_coupon.discount_value, p_subtotal);
    END IF;

    RETURN jsonb_build_object(
        'valid', true,
        'coupon_id', v_coupon.id,
        'code', v_coupon.code,
        'discount_type', v_coupon.discount_type,
        'discount_value', v_coupon.discount_value,
        'calculated_discount', v_discount,
        'message', 'Promotion applied successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
