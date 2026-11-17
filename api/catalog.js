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

    if (action === 'get_orders') {
      const { data: dbOrders, error: oErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (oErr) throw new Error(`Orders fetch error: ${oErr.message}`);

      const { data: dbItems } = await supabase.from('order_items').select('*');

      const itemsByOrderId = new Map();
      if (dbItems) {
        for (const item of dbItems) {
          if (!itemsByOrderId.has(item.order_id)) {
            itemsByOrderId.set(item.order_id, []);
          }
          itemsByOrderId.get(item.order_id).push({
            id: item.id,
            productId: item.product_id_snapshot,
            productTitle: item.product_title_snapshot,
            variantName: item.variant_name_snapshot,
            sku: item.sku_snapshot,
            imageUrl: item.image_url_snapshot,
            unitPrice: Number(item.unit_price) || 0,
            quantity: Number(item.quantity) || 1,
            lineSubtotal: Number(item.line_subtotal) || 0,
          });
        }
      }

      const orders = (dbOrders || []).map((o) => {
        const snapshots = itemsByOrderId.get(o.id) || [];
        const dateObj = new Date(o.created_at || Date.now());
        return {
          id: o.id,
          customerName: o.customer_name || 'Valued Patron',
          email: o.customer_email || '',
          phone: o.customer_phone || '',
          shippingAddress: o.shipping_address_line1 || '',
          city: o.shipping_city || 'Mumbai',
          state: o.shipping_state || 'Maharashtra',
          pincode: o.shipping_pincode || '',
          country: o.shipping_country || 'India',
          subtotal: Number(o.subtotal) || 0,
          discount: Number(o.discount_amount) || 0,
          shippingFee: Number(o.shipping_fee) || 0,
          tax: Number(o.tax_amount) || 0,
          total: Number(o.total_amount) || 0,
          date: dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          orderTime: dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
          status: o.fulfilment_status === 'delivered' ? 'Delivered' : (o.fulfilment_status === 'shipped' ? 'Shipped' : (o.payment_status === 'captured' ? 'Processing' : 'Pending')),
          paymentStatus: o.payment_status || 'pending',
          fulfilmentStatus: o.fulfilment_status || 'unfulfilled',
          paymentMethod: o.payment_method || 'Prepaid',
          razorpayOrderId: o.razorpay_order_id,
          razorpayPaymentId: o.razorpay_payment_id,
          razorpaySignature: o.razorpay_signature,
          appliedCoupon: o.applied_coupon_code,
          trackingNumber: o.tracking_number,
          courierName: o.courier_name,
          adminNotes: o.admin_notes,
          itemSnapshots: snapshots,
          items: snapshots.map((s) => ({
            product: {
              id: s.productId,
              name: s.productTitle,
              title: s.productTitle,
              price: s.unitPrice,
              image: s.imageUrl,
              cleanImage: s.imageUrl,
              sku: s.sku,
            },
            quantity: s.quantity,
            selectedSize: s.variantName,
          })),
          createdAt: o.created_at,
          updatedAt: o.updated_at,
        };
      });

      return res.status(200).json({ success: true, orders });
    }

    if (action === 'sync_order') {
      const { orderId, updates } = req.body || {};
      if (!orderId) return res.status(400).json({ success: false, message: 'Missing orderId' });

      const dbUpdates = {};
      if (updates.fulfilmentStatus) dbUpdates.fulfilment_status = updates.fulfilmentStatus;
      if (updates.paymentStatus) dbUpdates.payment_status = updates.paymentStatus;
      if (updates.trackingNumber !== undefined) dbUpdates.tracking_number = updates.trackingNumber;
      if (updates.courierName !== undefined) dbUpdates.courier_name = updates.courierName;
      if (updates.adminNotes !== undefined) dbUpdates.admin_notes = updates.adminNotes;
      dbUpdates.updated_at = new Date().toISOString();

      await supabase.from('orders').update(dbUpdates).eq('id', orderId);
      return res.status(200).json({ success: true, message: 'Order updated in cloud database.' });
    }

    if (action === 'delete_order') {
      const { orderId } = req.body || {};
      if (!orderId) return res.status(400).json({ success: false, message: 'Missing orderId' });

      await supabase.from('order_items').delete().eq('order_id', orderId);
      await supabase.from('orders').delete().eq('id', orderId);
      return res.status(200).json({ success: true, message: 'Order permanently deleted from cloud database.' });
    }

    if (action === 'get_coupons') {
      const { data: coupons, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return res.status(200).json({ success: true, coupons });
    }

    if (action === 'save_coupon') {
      const { coupon } = req.body || {};
      if (!coupon || !coupon.code) return res.status(400).json({ success: false, message: 'Invalid coupon' });

      await supabase.from('coupons').upsert([{
        id: coupon.id || `coup-${coupon.code.toLowerCase()}`,
        code: coupon.code.toUpperCase(),
        discount_type: coupon.discountType || 'percentage',
        discount_value: Number(coupon.discountValue) || 10,
        min_order_value: Number(coupon.minOrderValue) || 0,
        max_discount_cap: Number(coupon.maxDiscountCap) || 5000,
        max_redemptions: Number(coupon.maxRedemptions) || 100,
        is_active: coupon.isActive !== false,
        created_at: new Date().toISOString(),
      }]);
      return res.status(200).json({ success: true, message: 'Coupon saved in cloud database.' });
    }

    return res.status(400).json({ success: false, message: `Unknown action: ${action}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
