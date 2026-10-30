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
-- ============================================================================
-- Migration: 20261019000002_rls_policies.sql
-- Description: Row Level Security (RLS) Policies and Access Control Rules
-- ============================================================================

-- Helper function to check if current user is an authenticated admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        (
            auth.jwt() ->> 'email' IN (
                SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
            )
            OR
            auth.jwt() ->> 'role' = 'service_role'
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 2. CATEGORIES POLICIES
-- ----------------------------------------------------------------------------
-- Public read active categories
CREATE POLICY "Public read active categories"
ON categories FOR SELECT
USING (is_active = TRUE OR is_admin());

-- Admin full access
CREATE POLICY "Admin full manage categories"
ON categories FOR ALL
USING (is_admin());

-- ----------------------------------------------------------------------------
-- 3. PRODUCTS & VARIANTS & IMAGES POLICIES
-- ----------------------------------------------------------------------------
-- Public read published products
CREATE POLICY "Public read published products"
ON products FOR SELECT
USING (status = 'published' OR is_admin());

CREATE POLICY "Admin manage products"
ON products FOR ALL
USING (is_admin());

-- Public read active variants of published products
CREATE POLICY "Public read active variants"
ON product_variants FOR SELECT
USING (
    is_active = TRUE OR is_admin()
);

CREATE POLICY "Admin manage variants"
ON product_variants FOR ALL
USING (is_admin());

-- Public read product images
CREATE POLICY "Public read product images"
ON product_images FOR SELECT
USING (TRUE);

CREATE POLICY "Admin manage product images"
ON product_images FOR ALL
USING (is_admin());

-- ----------------------------------------------------------------------------
-- 4. INVENTORY POLICIES
-- ----------------------------------------------------------------------------
-- Inventory counts and movements restricted to admins
CREATE POLICY "Admin manage inventory"
ON inventory_items FOR ALL
USING (is_admin());

CREATE POLICY "Admin view inventory movements"
ON inventory_movements FOR SELECT
USING (is_admin());

-- ----------------------------------------------------------------------------
-- 5. ORDERS & ORDER ITEMS POLICIES
-- ----------------------------------------------------------------------------
-- Allow storefront checkout insertion
CREATE POLICY "Storefront insert order"
ON orders FOR INSERT
WITH CHECK (TRUE);

-- Authenticated patrons can view their own orders
CREATE POLICY "Customers view own orders"
ON orders FOR SELECT
USING (
    customer_email = (auth.jwt() ->> 'email') OR is_admin()
);

-- Admin manage all orders
CREATE POLICY "Admin manage orders"
ON orders FOR ALL
USING (is_admin());

-- Storefront insert order items
CREATE POLICY "Storefront insert order items"
ON order_items FOR INSERT
WITH CHECK (TRUE);

-- Order items readable by order owner or admin
CREATE POLICY "Read order items"
ON order_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
        AND (orders.customer_email = (auth.jwt() ->> 'email') OR is_admin())
    )
);

-- ----------------------------------------------------------------------------
-- 6. COUPONS POLICIES
-- ----------------------------------------------------------------------------
-- Public can check active coupon codes
CREATE POLICY "Public view active coupons"
ON coupons FOR SELECT
USING (is_active = TRUE OR is_admin());

CREATE POLICY "Admin manage coupons"
ON coupons FOR ALL
USING (is_admin());

CREATE POLICY "Storefront insert redemption"
ON coupon_redemptions FOR INSERT
WITH CHECK (TRUE);

CREATE POLICY "Admin view coupon redemptions"
ON coupon_redemptions FOR SELECT
USING (is_admin());

-- ----------------------------------------------------------------------------
-- 7. AUDIT & LOGS POLICIES
-- ----------------------------------------------------------------------------
CREATE POLICY "Admin view audit logs"
ON audit_logs FOR SELECT
USING (is_admin());

CREATE POLICY "Admin view payment transactions"
ON payment_transactions FOR SELECT
USING (is_admin());

CREATE POLICY "Admin manage shipments"
ON shipments FOR ALL
USING (is_admin());
-- ============================================================================
-- Migration: 20261019000003_seed_data.sql
-- Description: Seed Data for Categories, Products, Variants, Inventory and Coupons
-- ============================================================================

-- 1. SEED CATEGORIES
INSERT INTO categories (id, name, slug, description, display_order, is_active) VALUES
('rings', 'Rings', 'rings', 'Cocktail rings, solitaires, and statement bands handcrafted in gold vermeil.', 1, TRUE),
('earrings', 'Earrings', 'earrings', 'Chandeliers, drops, and studs crafted with fine gemstones.', 2, TRUE),
('jhumka', 'Dome Jhumka', 'jhumka', 'Iconic bell-shaped Mughal architecture silhouettes with pearl fringes.', 3, TRUE),
('kangan-sets', 'Kangan Sets', 'kangan-sets', 'Harmonized bridal and celebratory bangle sets.', 4, TRUE),
('kangna', 'Kangna', 'kangna', 'Pierced jaali and open-worked heritage bangles.', 5, TRUE),
('necklaces', 'Necklaces', 'necklaces', 'Torque collars, chokers, and multi-tier cascades.', 6, TRUE),
('bracelets', 'Bracelets', 'bracelets', 'Multi-strand gemstone cuffs and delicate link chains.', 7, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 2. SEED PRODUCTS
INSERT INTO products (
    id, category_id, title, slug, short_description, long_description,
    base_price, compare_at_price, cost_price, metal_type, gemstones,
    dimensions, weight_grams, details, status, is_bestseller, is_new
) VALUES
(
    'rass-ring-01', 'rings', 'Gulshan Emerald & Seed Pearl Cocktail Ring', 'gulshan-emerald-pearl-cocktail-ring',
    'An architectural heirloom ring sculpted in 18k gold vermeil.',
    'An architectural heirloom ring sculpted in 18k gold vermeil, featuring an untreated Colombian emerald cabochon encircled by delicate freshwater seed pearls and hand-pierced floral filigree.',
    14500.00, 16500.00, 6800.00, '18k Gold Vermeil', 'Zambian Emerald & Freshwater Seed Pearls',
    '22mm diameter crest', 8.40,
    '["Handcrafted in 18k Yellow Gold Vermeil over recycled sterling silver", "Natural Zambian Emerald Cabochon (1.8 carats)", "Hand-strung grade AAA freshwater seed pearls", "Adjustable band mechanism for effortless comfort", "Hallmarked with 925 authenticity stamp"]'::jsonb,
    'published', TRUE, FALSE
),
(
    'rass-earring-01', 'earrings', 'Chandani Double-Tier Jhumka Chandelier', 'chandani-double-tier-jhumka-chandelier',
    'Statuesque chandelier earrings blending Mughal floral stud work with two cascading bell tiers.',
    'Statuesque chandelier earrings blending Mughal floral stud work with two cascading bell tiers, trimmed with micro-faceted lavender amethyst and sage jade beads.',
    22800.00, 25000.00, 10200.00, '18k Gold Vermeil', 'Lavender Amethyst, Mint Quartz & Cultured Pearls',
    '68mm length Ã— 26mm width', 16.20,
    '["Twin architectural bell domes with open-worked filigree", "Hand-knotted cluster fringe in pastel amethyst and mint quartz", "Secure push-back closure with wide support clutch", "Lightweight hollow-core construction for day-to-night ease"]'::jsonb,
    'published', TRUE, TRUE
),
(
    'rass-jhumka-01', 'jhumka', 'Mayur Heritage Dome Jhumka', 'mayur-heritage-dome-jhumka',
    'A timeless silhouette featuring our signature bell contour with deep forest emerald.',
    'A timeless silhouette featuring our signature bell contour, adorned with bezel-set deep forest emerald and a cascading perimeter of warm golden pearls.',
    18200.00, 20000.00, 8100.00, '18k Gold Vermeil', 'Hydrothermal Emerald & Basra Pearl Drops',
    '42mm drop length', 12.80,
    '["Intricate repoussÃ© floral banding around crown", "Rich satin gold finish with hand-burnished highlights", "Hypoallergenic titanium post with comfort disc backing", "Comes with handcrafted suede presentation box"]'::jsonb,
    'published', FALSE, TRUE
),
(
    'rass-kangan-01', 'kangan-sets', 'Rani Bagh Floral Stud & Jhumki Ensemble', 'rani-bagh-floral-stud-jhumki-ensemble',
    'Designed as an ode to royal garden ceremonies with green tourmaline and pastel fringe.',
    'Designed as an ode to royal royal garden ceremonies. Featuring an ornate sunburst floral stud crowned with a deep green tourmaline and a tiered pastel bead fringe.',
    26500.00, 29000.00, 12500.00, '18k Gold Vermeil', 'Green Tourmaline, Peridot & Rice Pearls',
    '52mm overall length', 14.60,
    '["Modular 2-in-1 design: stud can be worn independently or with drop", "Artisanal rawa work detailing on stud perimeter", "Hand-wired cascade of micro seed pearls and briolettes", "Signature Rass stamp of authenticity"]'::jsonb,
    'published', TRUE, FALSE
),
(
    'rass-kangna-01', 'kangna', 'Virasat Pierced Lattice Kangna', 'virasat-pierced-lattice-kangna',
    'A structural masterpiece featuring hand-pierced jaali geometry and emeralds.',
    'A structural masterpiece featuring hand-pierced jaali geometry, crowned with bezel-set emeralds and a border of micro pearls.',
    16900.00, 19000.00, 7800.00, '18k Gold Vermeil', 'Emeralds & Seed Pearls',
    'Width 18mm', 24.50,
    '["Hand-sawn pierced latticework by master karigars", "Concealed hinge clasp with safety lock", "Smooth interior contour engineered for all-day comfort", "Available in sizes 2.4, 2.6 and 2.8"]'::jsonb,
    'published', FALSE, FALSE
),
(
    'rass-necklace-01', 'necklaces', 'Rajkumari Cascading Jhumka Collar', 'rajkumari-cascading-jhumka-collar',
    'The defining statement of our collection with seven handcrafted miniature jhumkas.',
    'The defining statement of our collection. A regal rigid gold collar suspending seven handcrafted miniature jhumkas, each tipped with clusters of pastel jade and amethyst drops.',
    38000.00, 42000.00, 18000.00, '18k Gold Vermeil', 'Pastel Jade, Amethyst & Cultured Seed Pearls',
    '14-inch torque + 6-inch adjustable silk cord', 48.00,
    '["Ergonomically curved collar torque rests naturally on the collarbone", "Seven individually balanced hanging jhumka pendants", "Adjustable pure silk dori (cord) closure with gold tassel accents", "Handcrafted over 45 artisan hours"]'::jsonb,
    'published', TRUE, TRUE
),
(
    'rass-bracelet-01', 'bracelets', 'Manjari Multi-Strand Gemstone Cuff', 'manjari-multi-strand-gemstone-cuff',
    'A harmonious composition of stacked natural stones and gold spacer bars.',
    'A harmonious composition of stacked natural stones: faceted emeralds, soft amethyst, and lustrous pearls woven together with gold spacer bars.',
    19800.00, 22000.00, 9100.00, '18k Gold Vermeil', 'Emeralds, Lilac Amethyst & Freshwater Pearls',
    'Width 24mm, Inner circumference 6.5 inches', 28.20,
    '["Five continuous rows of hand-selected genuine gemstones", "Flexible woven memory core ensures a tailored fit on any wrist", "Magnetic box clasp with dual safety latch", "Resistant to tarnishing with protective micro-coating"]'::jsonb,
    'published', TRUE, FALSE
),
(
    'rass-kangna-02', 'kangna', 'Noor Beaded Dome Miniature Kangna', 'noor-beaded-dome-miniature-kangna',
    'A delicate expression of traditional metal spinning with miniature dome clusters.',
    'A delicate expression of traditional metal spinning, featuring miniature dome clusters accented with soft lavender and sage enamel highlights.',
    17400.00, 19500.00, 8000.00, '18k Gold Vermeil', 'Lavender Rondelles & Seed Pearls',
    'Width 14mm', 18.60,
    '["Fine micro-prongs holding pastel stone rondelles", "Smooth satin gold interior band", "Stackable with our Virasat Lattice Kangna or worn solo"]'::jsonb,
    'published', FALSE, FALSE
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    base_price = EXCLUDED.base_price,
    updated_at = NOW();

-- 3. SEED PRODUCT VARIANTS
INSERT INTO product_variants (id, product_id, sku, variant_name, option_type, option_value, is_active) VALUES
('var-ring-01-std', 'rass-ring-01', 'RASS-RNG-01-STD', 'Standard Adjustable', 'Size', 'Adjustable', TRUE),
('var-earring-01-std', 'rass-earring-01', 'RASS-EAR-01-STD', 'Standard Pair', 'Size', 'Standard', TRUE),
('var-jhumka-01-std', 'rass-jhumka-01', 'RASS-JHM-01-STD', 'Standard Pair', 'Size', 'Standard', TRUE),
('var-kangan-01-std', 'rass-kangan-01', 'RASS-KST-01-STD', 'Standard Set', 'Size', 'Standard', TRUE),
('var-kangna-01-24', 'rass-kangna-01', 'RASS-KNG-01-24', 'Size 2.4', 'Size', '2.4', TRUE),
('var-kangna-01-26', 'rass-kangna-01', 'RASS-KNG-01-26', 'Size 2.6', 'Size', '2.6', TRUE),
('var-kangna-01-28', 'rass-kangna-01', 'RASS-KNG-01-28', 'Size 2.8', 'Size', '2.8', TRUE),
('var-neck-01-std', 'rass-necklace-01', 'RASS-NCK-01-STD', 'Standard Collar', 'Size', 'Standard', TRUE),
('var-brac-01-std', 'rass-bracelet-01', 'RASS-BRC-01-STD', 'Standard 6.5"', 'Size', 'Standard', TRUE),
('var-kangna-02-26', 'rass-kangna-02', 'RASS-KNG-02-26', 'Size 2.6', 'Size', '2.6', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED INVENTORY BALANCES
INSERT INTO inventory_items (variant_id, quantity_on_hand, quantity_reserved, low_stock_threshold) VALUES
('var-ring-01-std', 12, 0, 3),
('var-earring-01-std', 8, 0, 2),
('var-jhumka-01-std', 15, 0, 4),
('var-kangan-01-std', 6, 0, 2),
('var-kangna-01-24', 4, 0, 2),
('var-kangna-01-26', 10, 0, 3),
('var-kangna-01-28', 5, 0, 2),
('var-neck-01-std', 3, 0, 2),   -- low stock alert demo
('var-brac-01-std', 9, 0, 3),
('var-kangna-02-26', 7, 0, 2)
ON CONFLICT (variant_id) DO UPDATE SET
    quantity_on_hand = EXCLUDED.quantity_on_hand;

-- 5. SEED COUPONS
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_discount_cap, max_redemptions, max_per_customer, is_active) VALUES
('RASS20', 'percentage', 20.00, 30000.00, 10000.00, 100, 1, TRUE),
('WELCOME10', 'percentage', 10.00, 15000.00, 3000.00, 500, 1, TRUE),
('HEIRLOOM5000', 'fixed_amount', 5000.00, 50000.00, 5000.00, 50, 1, TRUE)
ON CONFLICT (code) DO NOTHING;
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
            'message', 'Minimum order value of â‚¹' || v_coupon.min_order_value || ' required for this code.'
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
