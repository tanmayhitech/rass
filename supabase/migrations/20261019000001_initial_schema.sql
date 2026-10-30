-- ============================================================================
-- Migration: 20261019000001_initial_schema.sql
-- Description: Core Schema for Rass by Riddhima E-Commerce Operations
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,                       -- e.g. 'rings', 'jhumka', 'necklaces'
    name TEXT NOT NULL,                        -- e.g. 'Rings', 'Dome Jhumka'
    slug TEXT NOT NULL UNIQUE,                 -- e.g. 'rings'
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,                       -- e.g. 'rass-ring-01'
    category_id TEXT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    long_description TEXT,
    base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
    compare_at_price NUMERIC(12, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= base_price),
    cost_price NUMERIC(12, 2) CHECK (cost_price IS NULL OR cost_price >= 0),
    metal_type TEXT NOT NULL,                  -- e.g. '18k Gold Vermeil', 'Solid 925 Silver'
    gemstones TEXT,                            -- e.g. 'Zambian Emerald & Freshwater Pearls'
    dimensions TEXT,
    weight_grams NUMERIC(8, 2),
    details JSONB DEFAULT '[]'::jsonb,         -- bulleted craft details
    status TEXT NOT NULL DEFAULT 'published'   -- 'draft', 'published', 'archived', 'inactive'
        CHECK (status IN ('draft', 'published', 'archived', 'inactive')),
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 3. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS product_variants (
    id TEXT PRIMARY KEY,                       -- e.g. 'rass-ring-01-size-12'
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,                  -- e.g. 'RASS-RNG-01-SZ12'
    variant_name TEXT NOT NULL,                -- e.g. 'Size 12', 'Size 2.6', 'Standard'
    option_type TEXT DEFAULT 'Size',           -- 'Size', 'Metal', 'Finish'
    option_value TEXT NOT NULL,                -- '12', '2.6', '18K Vermeil'
    price_override NUMERIC(12, 2),
    weight_override_grams NUMERIC(8, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON product_variants(sku);

-- 4. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    clean_image_url TEXT,
    alt_text TEXT,
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_images_product ON product_images(product_id);

-- 5. INVENTORY ITEMS TABLE
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id TEXT NOT NULL UNIQUE REFERENCES product_variants(id) ON DELETE RESTRICT,
    quantity_on_hand INT NOT NULL DEFAULT 0 CHECK (quantity_on_hand >= 0),
    quantity_reserved INT NOT NULL DEFAULT 0 CHECK (quantity_reserved >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 3 CHECK (low_stock_threshold >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INVENTORY MOVEMENTS LEDGER TABLE
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    movement_type TEXT NOT NULL 
        CHECK (movement_type IN ('purchase_receipt', 'order_reservation', 'order_deduction', 'order_restock', 'manual_adjustment', 'damaged', 'audit_variance')),
    quantity_change INT NOT NULL,
    quantity_after INT NOT NULL,
    reference_id TEXT,
    notes TEXT,
    created_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_movements_item ON inventory_movements(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_movements_reference ON inventory_movements(reference_id);

-- 7. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    notes TEXT,
    total_orders_count INT DEFAULT 0,
    total_spend NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- 8. CUSTOMER ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,                       -- e.g. 'RASS-ORD-841920'
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address_line1 TEXT NOT NULL,
    shipping_address_line2 TEXT,
    shipping_city TEXT NOT NULL,
    shipping_state TEXT NOT NULL,
    shipping_pincode TEXT NOT NULL,
    shipping_country TEXT NOT NULL DEFAULT 'India',
    
    currency TEXT NOT NULL DEFAULT 'INR',
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    
    applied_coupon_code TEXT,
    
    payment_method TEXT NOT NULL,              -- 'razorpay_prepaid', 'cod'
    payment_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded')),
    fulfilment_status TEXT NOT NULL DEFAULT 'unfulfilled'
        CHECK (fulfilment_status IN ('unfulfilled', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled', 'returned')),
    
    razorpay_order_id TEXT UNIQUE,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    
    admin_notes TEXT,
    cancelled_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfilment_status ON orders(fulfilment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 10. ORDER ITEMS TABLE (IMMUTABLE SNAPSHOT)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_variant_id TEXT REFERENCES product_variants(id) ON DELETE SET NULL,
    
    product_id_snapshot TEXT NOT NULL,
    product_title_snapshot TEXT NOT NULL,
    variant_name_snapshot TEXT NOT NULL,
    sku_snapshot TEXT NOT NULL,
    image_url_snapshot TEXT,
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    line_subtotal NUMERIC(12, 2) NOT NULL CHECK (line_subtotal >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 11. PAYMENT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    gateway TEXT NOT NULL DEFAULT 'razorpay',
    gateway_order_id TEXT,
    gateway_payment_id TEXT UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT NOT NULL
        CHECK (status IN ('success', 'failed', 'pending', 'refunded')),
    error_code TEXT,
    error_description TEXT,
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. REFUNDS TABLE
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_transaction_id UUID REFERENCES payment_transactions(id),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    reason TEXT NOT NULL,
    gateway_refund_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('pending', 'processed', 'failed')),
    created_by TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    min_order_value NUMERIC(12, 2) DEFAULT 0,
    max_discount_cap NUMERIC(12, 2),
    start_date TIMESTAMPTZ DEFAULT NOW(),
    expiry_date TIMESTAMPTZ,
    max_redemptions INT,
    redemption_count INT DEFAULT 0,
    max_per_customer INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. COUPON REDEMPTIONS TABLE
CREATE TABLE IF NOT EXISTS coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE RESTRICT,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_email TEXT NOT NULL,
    discount_applied NUMERIC(12, 2) NOT NULL,
    redeemed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_redemptions_coupon ON coupon_redemptions(coupon_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_email ON coupon_redemptions(customer_email);

-- 15. SHIPMENTS TABLE
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    courier_partner TEXT NOT NULL,
    awb_number TEXT UNIQUE,
    shipment_id_external TEXT,
    label_url TEXT,
    manifest_id TEXT,
    shipping_status TEXT NOT NULL DEFAULT 'manifested'
        CHECK (shipping_status IN ('manifested', 'pickup_scheduled', 'in_transit', 'out_for_delivery', 'delivered', 'rto', 'cancelled')),
    tracking_url TEXT,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_awb ON shipments(awb_number);

-- 16. WEBHOOK EVENTS TABLE (FOR IDEMPOTENCY)
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    processed_status TEXT NOT NULL DEFAULT 'processed'
        CHECK (processed_status IN ('processed', 'failed', 'ignored')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    changes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
