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
    '68mm length × 26mm width', 16.20,
    '["Twin architectural bell domes with open-worked filigree", "Hand-knotted cluster fringe in pastel amethyst and mint quartz", "Secure push-back closure with wide support clutch", "Lightweight hollow-core construction for day-to-night ease"]'::jsonb,
    'published', TRUE, TRUE
),
(
    'rass-jhumka-01', 'jhumka', 'Mayur Heritage Dome Jhumka', 'mayur-heritage-dome-jhumka',
    'A timeless silhouette featuring our signature bell contour with deep forest emerald.',
    'A timeless silhouette featuring our signature bell contour, adorned with bezel-set deep forest emerald and a cascading perimeter of warm golden pearls.',
    18200.00, 20000.00, 8100.00, '18k Gold Vermeil', 'Hydrothermal Emerald & Basra Pearl Drops',
    '42mm drop length', 12.80,
    '["Intricate repoussé floral banding around crown", "Rich satin gold finish with hand-burnished highlights", "Hypoallergenic titanium post with comfort disc backing", "Comes with handcrafted suede presentation box"]'::jsonb,
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
