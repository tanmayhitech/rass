import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!serviceKey) {
    return res.status(500).json({ success: false, message: 'SUPABASE_SERVICE_ROLE_KEY is not configured.' });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const { action, product, productId, variantId, quantityChange, notes, status } = req.body || {};

    if (action === 'create_product') {
      if (!product || !product.id) {
        return res.status(400).json({ success: false, message: 'Invalid product payload.' });
      }

      const pId = product.id;
      const vId = product.variants?.[0]?.id || `var-${pId}-std`;
      const stock = product.stockCount ?? 10;
      const threshold = product.lowStockThreshold ?? 3;
      const sku = (product.sku || `RASS-SKU-${pId}`).trim().toUpperCase();

      // 1. Insert/Upsert Product
      const { error: pErr } = await supabase.from('products').upsert([{
        id: pId,
        category_id: product.category || 'western',
        title: (product.name || product.title).trim(),
        slug: product.slug || pId,
        short_description: product.description || '',
        long_description: product.description || '',
        base_price: product.price || 0,
        compare_at_price: product.originalPrice || null,
        cost_price: product.costPrice || Math.round((product.price || 0) * 0.45),
        metal_type: product.metal || '18k Gold Vermeil',
        gemstones: product.gemstones || '',
        dimensions: product.dimensions || '',
        weight_grams: parseFloat(product.weight || '10') || 10,
        details: Array.isArray(product.details) ? product.details : [],
        status: product.status || 'published',
        updated_at: new Date().toISOString(),
      }]);

      if (pErr) throw new Error(`Product upsert error: ${pErr.message}`);

      // 2. Insert/Upsert Default Variant
      const { error: vErr } = await supabase.from('product_variants').upsert([{
        id: vId,
        product_id: pId,
        sku,
        variant_name: 'Standard',
        option_type: 'Standard',
        option_value: 'Standard',
        is_active: true,
      }]);

      if (vErr) throw new Error(`Variant upsert error: ${vErr.message}`);

      // 3. Insert/Upsert Inventory Item
      const { error: iErr } = await supabase.from('inventory_items').upsert([{
        variant_id: vId,
        quantity_on_hand: stock,
        quantity_reserved: 0,
        low_stock_threshold: threshold,
      }], { onConflict: 'variant_id' });

      if (iErr) throw new Error(`Inventory upsert error: ${iErr.message}`);

      // 4. Insert/Upsert Product Image
      if (product.image) {
        await supabase.from('product_images').insert([{
          product_id: pId,
          image_url: product.image,
          clean_image_url: product.cleanImage || product.image,
          alt_text: product.name || product.title,
          display_order: 0,
          is_primary: true,
        }]);
      }

      return res.status(200).json({ success: true, message: 'Product successfully saved to cloud database.', id: pId });
    }

    if (action === 'update_status') {
      if (!productId || !status) {
        return res.status(400).json({ success: false, message: 'Missing productId or status.' });
      }

      const { error } = await supabase.from('products').update({
        status,
        updated_at: new Date().toISOString(),
      }).eq('id', productId);

      if (error) throw new Error(`Status update error: ${error.message}`);
      return res.status(200).json({ success: true, message: 'Product status updated.' });
    }

    if (action === 'delete_product') {
      if (!productId) {
        return res.status(400).json({ success: false, message: 'Missing productId.' });
      }

      // Check variants
      const { data: variants } = await supabase.from('product_variants').select('id').eq('product_id', productId);
      if (variants && variants.length > 0) {
        const vIds = variants.map(v => v.id);
        await supabase.from('inventory_movements').delete().in('variant_id', vIds);
        await supabase.from('inventory_items').delete().in('variant_id', vIds);
        await supabase.from('product_variants').delete().eq('product_id', productId);
      }

      await supabase.from('product_images').delete().eq('product_id', productId);
      const { error } = await supabase.from('products').delete().eq('id', productId);

      if (error) throw new Error(`Product deletion error: ${error.message}`);
      return res.status(200).json({ success: true, message: 'Product deleted from cloud database.' });
    }

    if (action === 'adjust_stock') {
      if (!variantId || quantityChange === undefined) {
        return res.status(400).json({ success: false, message: 'Missing variantId or quantityChange.' });
      }

      const { data: inv } = await supabase.from('inventory_items').select('quantity_on_hand').eq('variant_id', variantId).single();
      const currentQty = inv?.quantity_on_hand || 0;
      const newQty = Math.max(0, currentQty + Number(quantityChange));

      await supabase.from('inventory_items').update({
        quantity_on_hand: newQty,
      }).eq('variant_id', variantId);

      await supabase.from('inventory_movements').insert([{
        variant_id: variantId,
        movement_type: quantityChange >= 0 ? 'purchase_receipt' : 'inventory_adjustment',
        quantity_change: Number(quantityChange),
        quantity_after: newQty,
        notes: notes || 'Admin inventory adjustment',
        created_at: new Date().toISOString(),
      }]);

      return res.status(200).json({ success: true, message: 'Stock updated.', newQuantity: newQty });
    }

    return res.status(400).json({ success: false, message: `Unknown action: ${action}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
