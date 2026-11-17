import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const resendApiKey = env.RESEND_API_KEY || env.VITE_RESEND_API_KEY || '';
  const supabaseUrl = env.VITE_SUPABASE_URL || 'https://ukgjkmjhhxtaedxyhaeu.supabase.co';
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY || '';

  const supabaseDevMiddleware = {
    name: 'supabase-dev-middleware',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url === '/api/upload' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', async () => {
            try {
              const { createClient } = await import('@supabase/supabase-js');
              const supabase = createClient(supabaseUrl, serviceKey);
              const data = JSON.parse(body);
              const { image, filename: requestedName, folder = 'uploads' } = data;

              let buffer: Buffer;
              let contentType = 'image/webp';
              let ext = 'webp';

              if (image.startsWith('data:')) {
                const match = image.match(/^data:([^;]+);base64,(.+)$/);
                if (match) {
                  contentType = match[1];
                  buffer = Buffer.from(match[2], 'base64');
                  if (contentType.includes('png')) ext = 'png';
                  else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpeg';
                  else if (contentType.includes('webp')) ext = 'webp';
                  else if (contentType.includes('gif')) ext = 'gif';
                } else {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ success: false, message: 'Invalid data format' }));
                  return;
                }
              } else {
                buffer = Buffer.from(image, 'base64');
              }

              const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
              const cleanPrefix = (requestedName || 'media').replace(/[^a-zA-Z0-9_-]/g, '-').substring(0, 30);
              const finalFilename = `${folder}/${cleanPrefix}-${uniqueId}.${ext}`;

              const { error } = await supabase.storage.from('product-images').upload(finalFilename, buffer, {
                contentType,
                upsert: true,
              });

              if (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, message: error.message }));
                return;
              }

              const { data: pubData } = supabase.storage.from('product-images').getPublicUrl(finalFilename);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, publicUrl: pubData.publicUrl, path: finalFilename }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: err?.message || 'Upload failed' }));
            }
          });
          return;
        }

        if (req.url === '/api/catalog' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => { body += chunk; });
          req.on('end', async () => {
            try {
              const { createClient } = await import('@supabase/supabase-js');
              const supabase = createClient(supabaseUrl, serviceKey);
              const data = JSON.parse(body);
              const { action, product, productId, variantId, quantityChange, notes, status } = data;

              if (action === 'create_product') {
                const pId = product.id;
                const vId = product.variants?.[0]?.id || `var-${pId}-std`;
                const stock = product.stockCount ?? 10;
                const threshold = product.lowStockThreshold ?? 3;
                const sku = (product.sku || `RASS-SKU-${pId}`).trim().toUpperCase();

                await supabase.from('products').upsert([{
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

                await supabase.from('product_variants').upsert([{
                  id: vId,
                  product_id: pId,
                  sku,
                  variant_name: 'Standard',
                  option_type: 'Standard',
                  option_value: 'Standard',
                  is_active: true,
                }]);

                await supabase.from('inventory_items').upsert([{
                  variant_id: vId,
                  quantity_on_hand: stock,
                  quantity_reserved: 0,
                  low_stock_threshold: threshold,
                }], { onConflict: 'variant_id' });

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

                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'Product saved to Supabase.' }));
                return;
              }

              if (action === 'delete_product') {
                const { data: variants } = await supabase.from('product_variants').select('id').eq('product_id', productId);
                if (variants && variants.length > 0) {
                  const vIds = variants.map((v: any) => v.id);
                  await supabase.from('inventory_movements').delete().in('variant_id', vIds);
                  await supabase.from('inventory_items').delete().in('variant_id', vIds);
                  await supabase.from('product_variants').delete().eq('product_id', productId);
                }
                await supabase.from('product_images').delete().eq('product_id', productId);
                await supabase.from('products').delete().eq('id', productId);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'Product deleted.' }));
                return;
              }

              if (action === 'update_status') {
                await supabase.from('products').update({ status, updated_at: new Date().toISOString() }).eq('id', productId);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'Status updated.' }));
                return;
              }

              if (action === 'adjust_stock') {
                const { data: inv } = await supabase.from('inventory_items').select('quantity_on_hand').eq('variant_id', variantId).single();
                const currentQty = inv?.quantity_on_hand || 0;
                const newQty = Math.max(0, currentQty + Number(quantityChange));
                await supabase.from('inventory_items').update({ quantity_on_hand: newQty }).eq('variant_id', variantId);
                await supabase.from('inventory_movements').insert([{
                  variant_id: variantId,
                  movement_type: quantityChange >= 0 ? 'purchase_receipt' : 'inventory_adjustment',
                  quantity_change: Number(quantityChange),
                  quantity_after: newQty,
                  notes: notes || 'Admin inventory adjustment',
                  created_at: new Date().toISOString(),
                }]);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, newQuantity: newQty }));
                return;
              }

              if (action === 'get_orders') {
                const { data: dbOrders, error: oErr } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
                if (oErr) throw new Error(oErr.message);
                const { data: dbItems } = await supabase.from('order_items').select('*');
                const itemsByOrderId = new Map();
                if (dbItems) {
                  for (const item of dbItems) {
                    if (!itemsByOrderId.has(item.order_id)) itemsByOrderId.set(item.order_id, []);
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
                const orders = (dbOrders || []).map((o: any) => {
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
                    items: snapshots.map((s: any) => ({
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
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, orders }));
                return;
              }

              if (action === 'sync_order') {
                const { orderId, updates } = data;
                const dbUpdates: any = {};
                if (updates.fulfilmentStatus) dbUpdates.fulfilment_status = updates.fulfilmentStatus;
                if (updates.paymentStatus) dbUpdates.payment_status = updates.paymentStatus;
                if (updates.trackingNumber !== undefined) dbUpdates.tracking_number = updates.trackingNumber;
                if (updates.courierName !== undefined) dbUpdates.courier_name = updates.courierName;
                if (updates.adminNotes !== undefined) dbUpdates.admin_notes = updates.adminNotes;
                dbUpdates.updated_at = new Date().toISOString();
                await supabase.from('orders').update(dbUpdates).eq('id', orderId);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                return;
              }

              if (action === 'delete_order') {
                const { orderId } = data;
                await supabase.from('order_items').delete().eq('order_id', orderId);
                await supabase.from('orders').delete().eq('id', orderId);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                return;
              }

              if (action === 'get_coupons') {
                const { data: coupons, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
                if (error) throw new Error(error.message);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, coupons }));
                return;
              }

              if (action === 'save_coupon') {
                const { coupon } = data;
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
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
                return;
              }

              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, message: 'Invalid action' }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: e.message }));
            }
          });
          return;
        }

        if (req.url === '/api/sync-home-media') {
          if (req.method === 'GET') {
            try {
              const { createClient } = await import('@supabase/supabase-js');
              const supabase = createClient(supabaseUrl, serviceKey);
              const pub = supabase.storage.from('product-images').getPublicUrl('home-media-config.json').data.publicUrl;
              const resp = await fetch(pub);
              if (resp.ok) {
                const json = await resp.json();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, data: json }));
                return;
              }
              res.statusCode = 404;
              res.end(JSON.stringify({ success: false, message: 'No custom config found' }));
            } catch (e: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, message: e.message }));
            }
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', async () => {
              try {
                const { createClient } = await import('@supabase/supabase-js');
                const supabase = createClient(supabaseUrl, serviceKey);
                const { items } = JSON.parse(body);
                const buffer = Buffer.from(JSON.stringify(items, null, 2));
                const { error } = await supabase.storage.from('product-images').upload('home-media-config.json', buffer, {
                  contentType: 'application/json',
                  upsert: true,
                });
                if (error) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, message: error.message }));
                  return;
                }
                const pub = supabase.storage.from('product-images').getPublicUrl('home-media-config.json').data.publicUrl;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, publicUrl: pub }));
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ success: false, message: e.message }));
              }
            });
            return;
          }
        }

        next();
      });
    },
  };

  return {
    plugins: [react(), supabaseDevMiddleware],
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
                return 'vendor-pdf';
              }
            }
          },
        },
      },
    },
    server: {
      proxy: {
        '/api/resend': {
          target: 'https://api.resend.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/resend/, ''),
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
          },
        },
      },
    },
  };
});
