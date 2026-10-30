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
