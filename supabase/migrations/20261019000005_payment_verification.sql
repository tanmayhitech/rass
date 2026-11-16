-- 20261019000005_payment_verification.sql
-- RASS BY RIDDHIMA — ATOMIC PAYMENT VERIFICATION & CAPTURE RPC
-- Authoritatively updates order status, records transactions and enforces amount checks.

CREATE OR REPLACE FUNCTION verify_and_capture_payment_atomic(
    p_order_id TEXT,
    p_gateway_payment_id TEXT,
    p_signature TEXT,
    p_expected_amount NUMERIC
)
RETURNS JSONB AS $$
DECLARE
    v_order orders%ROWTYPE;
    v_existing_tx UUID;
BEGIN
    -- 1. Acquire exclusive row lock on the order
    SELECT * INTO v_order
    FROM orders
    WHERE id = p_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Order not found: ' || p_order_id);
    END IF;

    -- 2. Idempotency check: if already captured with this payment ID
    IF v_order.payment_status = 'captured' AND v_order.razorpay_payment_id = p_gateway_payment_id THEN
        RETURN jsonb_build_object('success', true, 'message', 'Order already captured idempotently', 'idempotent', true);
    END IF;

    -- 3. Check for replay attacks: payment ID already associated with another order
    SELECT id INTO v_existing_tx
    FROM payment_transactions
    WHERE gateway_payment_id = p_gateway_payment_id
      AND order_id != p_order_id;

    IF FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Security Violation: Payment ID already captured for another order');
    END IF;

    -- 4. Authoritative amount verification
    IF v_order.total_amount != p_expected_amount THEN
        -- Record failed transaction
        INSERT INTO payment_transactions (
            order_id, gateway, gateway_order_id, gateway_payment_id, amount, status, error_code, error_description
        ) VALUES (
            p_order_id, 'razorpay', v_order.razorpay_order_id, p_gateway_payment_id, p_expected_amount, 'failed',
            'AMOUNT_MISMATCH', 'Expected ₹' || v_order.total_amount || ', received ₹' || p_expected_amount
        );

        UPDATE orders
        SET payment_status = 'failed',
            admin_notes = 'Payment failed: Amount mismatch. Expected ₹' || v_order.total_amount || ', received ₹' || p_expected_amount,
            updated_at = NOW()
        WHERE id = p_order_id;

        RETURN jsonb_build_object('success', false, 'error', 'Payment amount mismatch against authoritative order record');
    END IF;

    -- 5. Atomic state update
    UPDATE orders
    SET payment_status = 'captured',
        fulfilment_status = 'processing',
        razorpay_payment_id = p_gateway_payment_id,
        razorpay_signature = p_signature,
        updated_at = NOW()
    WHERE id = p_order_id;

    -- 6. Insert audit transaction
    INSERT INTO payment_transactions (
        order_id,
        gateway,
        gateway_order_id,
        gateway_payment_id,
        amount,
        currency,
        status,
        raw_payload
    ) VALUES (
        p_order_id,
        'razorpay',
        v_order.razorpay_order_id,
        p_gateway_payment_id,
        v_order.total_amount,
        'INR',
        'success',
        jsonb_build_object(
            'captured_at', NOW(),
            'signature', p_signature
        )
    );

    RETURN jsonb_build_object('success', true, 'message', 'Payment captured and verified atomically');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
