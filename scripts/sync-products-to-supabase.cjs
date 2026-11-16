const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const crypto = require('crypto');

const env = {};
fs.readFileSync('.env', 'utf8').split('\n').forEach(l => {
  const parts = l.trim().split('=');
  const k = parts[0];
  const v = parts.slice(1).join('=');
  if (k && v) env[k.trim()] = v.trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function sync() {
  console.log('--- SYNCING TO SUPABASE: ' + env.VITE_SUPABASE_URL + ' ---');

  // 1. Bundle products.ts to evaluate the PRODUCTS array cleanly in Node
  const bundlePath = path.resolve('dist/products-export.mjs');
  esbuild.buildSync({
    entryPoints: ['src/data/products.ts'],
    bundle: true,
    platform: 'node',
    outfile: bundlePath,
    format: 'esm',
  });

  const { PRODUCTS, CATEGORIES_CONFIG } = await import(`file://${bundlePath}`);
  console.log(`Loaded ${PRODUCTS.length} products and ${CATEGORIES_CONFIG.length} categories from codebase.`);

  // 2. Ensure all categories exist in Supabase
  const categoriesToUpsert = [
    { id: 'rings', name: 'Rings', slug: 'rings', description: 'Cocktail rings, solitaires, and statement bands handcrafted in gold vermeil.', display_order: 1, is_active: true },
    { id: 'earrings', name: 'Earrings', slug: 'earrings', description: 'Chandeliers, drops, and studs crafted with fine gemstones.', display_order: 2, is_active: true },
    { id: 'jhumka', name: 'Dome Jhumka', slug: 'jhumka', description: 'Iconic bell-shaped Mughal architecture silhouettes with pearl fringes.', display_order: 3, is_active: true },
    { id: 'kangan-sets', name: 'Kangan Sets', slug: 'kangan-sets', description: 'Harmonized bridal and celebratory bangle sets.', display_order: 4, is_active: true },
    { id: 'kangna', name: 'Kangna', slug: 'kangna', description: 'Pierced jaali and open-worked heritage bangles.', display_order: 5, is_active: true },
    { id: 'necklaces', name: 'Necklaces', slug: 'necklaces', description: 'Torque collars, chokers, and multi-tier cascades.', display_order: 6, is_active: true },
    { id: 'bracelets', name: 'Bracelets', slug: 'bracelets', description: 'Multi-strand gemstone cuffs and delicate link chains.', display_order: 7, is_active: true },
    { id: 'western', name: 'Western Jewellery', slug: 'western', description: 'Contemporary artisanal chains, evil-eye amulets, and minimal charms.', display_order: 8, is_active: true },
    { id: 'tribal', name: 'Tribal Jewellery', slug: 'tribal', description: 'Heritage oxidized silver pieces inspired by nomadic craftsmanship.', display_order: 9, is_active: true },
    { id: 'kadas', name: 'Kadas', slug: 'kadas', description: 'Sculptural heritage cuffs and embossed bangles.', display_order: 10, is_active: true },
    { id: 'accessories', name: 'Earpins & Bugadi', slug: 'accessories', description: 'Traditional earpins and ear ornaments crafted in sterling silver and kundan.', display_order: 11, is_active: true },
    { id: 'toran', name: 'Toran', slug: 'toran', description: 'Handcrafted auspicious archway wall hangings.', display_order: 12, is_active: true }
  ];

  const { error: catErr } = await supabase.from('categories').upsert(categoriesToUpsert, { onConflict: 'id' });
  if (catErr) {
    console.error('Failed to upsert categories:', catErr);
    process.exit(1);
  }
  console.log('✅ Categories synchronized successfully.');

  // 3. Prepare products for Supabase
  const productsRows = [];
  const variantsRows = [];
  const inventoryRows = [];

  // Fetch existing variants to avoid unique constraint collisions
  const { data: existingVariants } = await supabase.from('product_variants').select('*');
  const existingSkuMap = new Map((existingVariants || []).map(v => [v.sku.toUpperCase(), v]));
  const existingProdMap = new Map((existingVariants || []).map(v => [v.product_id, v]));

  // Fetch existing inventory
  const { data: existingInv } = await supabase.from('inventory_items').select('*');
  const existingInvMap = new Map((existingInv || []).map(i => [i.variant_id, i]));

  for (const p of PRODUCTS) {
    const slug = (p.slug || p.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const sku = (p.sku || `RASS-SKU-${p.id.toUpperCase()}`).trim();
    const stockQty = typeof p.stockCount === 'number' ? p.stockCount : 10;
    const threshold = p.lowStockThreshold || 3;

    productsRows.push({
      id: p.id,
      category_id: p.category,
      title: p.name,
      slug: slug,
      short_description: p.description || '',
      long_description: p.description || '',
      base_price: p.price,
      compare_at_price: p.originalPrice || null,
      cost_price: p.costPrice || Math.round(p.price * 0.45),
      metal_type: p.metal || '18k Gold Vermeil',
      gemstones: p.gemstones || '',
      dimensions: p.dimensions || '',
      weight_grams: parseFloat(p.weight) || 10.0,
      details: p.details || [],
      status: p.status || 'published',
      is_bestseller: Boolean(p.isBestseller),
      is_new: Boolean(p.isNew),
      updated_at: new Date().toISOString()
    });

    const existingVar = existingProdMap.get(p.id) || existingSkuMap.get(sku.toUpperCase());
    const variantId = existingVar ? existingVar.id : `var-${p.id}-std`;
    const finalSku = existingVar ? existingVar.sku : sku;

    variantsRows.push({
      id: variantId,
      product_id: p.id,
      sku: finalSku,
      variant_name: existingVar ? existingVar.variant_name : 'Standard',
      option_type: existingVar ? existingVar.option_type : 'Standard',
      option_value: existingVar ? existingVar.option_value : 'Standard',
      is_active: true
    });

    const existingItem = existingInvMap.get(variantId);
    inventoryRows.push({
      id: existingItem ? existingItem.id : crypto.randomUUID(),
      variant_id: variantId,
      quantity_on_hand: existingItem ? existingItem.quantity_on_hand : stockQty,
      quantity_reserved: existingItem ? existingItem.quantity_reserved : 0,
      low_stock_threshold: threshold
    });
  }

  // 4. Batch upsert products
  const { error: prodErr } = await supabase.from('products').upsert(productsRows, { onConflict: 'id' });
  if (prodErr) {
    console.error('Failed to upsert products:', prodErr);
    process.exit(1);
  }
  console.log(`✅ Upserted ${productsRows.length} products into Supabase.`);

  // 5. Batch upsert variants
  const { error: varErr } = await supabase.from('product_variants').upsert(variantsRows, { onConflict: 'id' });
  if (varErr) {
    console.error('Failed to upsert variants:', varErr);
    process.exit(1);
  }
  console.log(`✅ Upserted ${variantsRows.length} product variants into Supabase.`);

  // 6. Batch upsert inventory
  const { error: invErr } = await supabase.from('inventory_items').upsert(inventoryRows, { onConflict: 'variant_id' });
  if (invErr) {
    console.error('Failed to upsert inventory items:', invErr);
    process.exit(1);
  }
  console.log(`✅ Upserted ${inventoryRows.length} inventory items into Supabase.`);

  // 7. Verify counts
  const { count: finalCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`🎉 Total confirmed products in Supabase PostgreSQL: ${finalCount}`);
}

sync().catch(console.error);
