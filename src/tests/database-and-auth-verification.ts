// ============================================================================
// Rass by Riddhima — Comprehensive Database & Admin Auth Verification Suite
// Tests live cloud integration against Supabase project: qugrjbcjnddqceynynds
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qugrjbcjnddqceynynds.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_AOECMefE4vYt-hiSnGIhAg_UeyWYKDQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function assert(condition: boolean, testName: string, detail?: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName} ${detail ? `(${detail})` : ''}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName} ${detail ? `— ${detail}` : ''}`);
}

async function runSuite() {
  console.log('\n===============================================================');
  console.log('💎 RASS BY RIDDHIMA — SUPABASE & AUTH TEST VERIFICATION');
  console.log('Project URL:', SUPABASE_URL);
  console.log('===============================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: CATEGORIES TABLE
  // --------------------------------------------------------------------------
  console.log('>> [CHECK 1]: Categories Catalog Schema');
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  assert(!catErr, 'Query categories table succeeded', catErr?.message);
  assert(Array.isArray(categories) && categories.length >= 7, 'Categories count >= 7', `${categories?.length} categories found`);
  const catNames = categories?.map((c) => c.name).join(', ');
  console.log('   Catalog categories:', catNames);

  // --------------------------------------------------------------------------
  // TEST 2: PRODUCTS TABLE
  // --------------------------------------------------------------------------
  console.log('\n>> [CHECK 2]: Products Catalog Schema');
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  assert(!prodErr, 'Query products table succeeded', prodErr?.message);
  assert(Array.isArray(products) && products.length >= 8, 'Products count >= 8', `${products?.length} products found`);
  const sampleProd = products![0];
  assert(Boolean(sampleProd.title && sampleProd.base_price > 0), 'Products have valid title and price', `${sampleProd.title} (₹${sampleProd.base_price})`);

  // --------------------------------------------------------------------------
  // TEST 3: PRODUCT VARIANTS TABLE
  // --------------------------------------------------------------------------
  console.log('\n>> [CHECK 3]: Multi-Variant Sizing & SKUs');
  const { data: variants, error: varErr } = await supabase
    .from('product_variants')
    .select('*');

  assert(!varErr, 'Query product_variants table succeeded', varErr?.message);
  assert(Array.isArray(variants) && variants.length >= 10, 'Variants count >= 10', `${variants?.length} variants found`);
  const skus = variants?.slice(0, 4).map((v) => v.sku).join(', ');
  console.log('   Sample SKUs:', skus, '...');

  // --------------------------------------------------------------------------
  // TEST 4: PROMOTIONS & COUPONS TABLE
  // --------------------------------------------------------------------------
  console.log('\n>> [CHECK 4]: Coupons Engine & Rules');
  const { data: coupons, error: coupErr } = await supabase
    .from('coupons')
    .select('*');

  assert(!coupErr, 'Query coupons table succeeded', coupErr?.message);
  assert(Array.isArray(coupons) && coupons.length >= 3, 'Coupons count >= 3', `${coupons?.length} active coupons found`);
  const couponCodes = coupons?.map((c) => `${c.code} (${c.discount_type === 'percentage' ? c.discount_value + '%' : '₹' + c.discount_value})`).join(', ');
  console.log('   Active promotions:', couponCodes);

  // --------------------------------------------------------------------------
  // TEST 5: ATOMIC RPC: validate_and_apply_coupon
  // --------------------------------------------------------------------------
  console.log('\n>> [CHECK 5]: Atomic Stored Procedure: validate_and_apply_coupon');
  const { data: couponResult, error: rpcCoupErr } = await supabase.rpc('validate_and_apply_coupon', {
    p_code: 'RASS20',
    p_subtotal: 35000,
    p_customer_email: 'verifier@rassbyriddhima.com'
  });

  assert(!rpcCoupErr, 'RPC validate_and_apply_coupon executed without errors', rpcCoupErr?.message);
  assert(couponResult?.valid === true, 'Coupon RASS20 validated successfully');
  assert(couponResult?.calculated_discount === 7000, 'Calculated exactly 20% of 35000 = ₹7000', `₹${couponResult?.calculated_discount}`);

  // Test invalid coupon
  const { data: invalidResult } = await supabase.rpc('validate_and_apply_coupon', {
    p_code: 'INVALID_CODE_999',
    p_subtotal: 35000,
    p_customer_email: 'verifier@rassbyriddhima.com'
  });
  assert(invalidResult?.valid === false, 'Invalid coupon rejected by database procedure');

  // --------------------------------------------------------------------------
  // TEST 6: ATOMIC RPC: reserve_inventory_atomic & release_inventory_atomic
  // --------------------------------------------------------------------------
  console.log('\n>> [CHECK 6]: Atomic Row-Locking Inventory Reservation');
  const testOrderId = `VERIFY-ORD-${Date.now()}`;
  const targetVariantId = variants![0].id;

  const { data: resData, error: resErr } = await supabase.rpc('reserve_inventory_atomic', {
    p_order_id: testOrderId,
    p_variant_id: targetVariantId,
    p_quantity: 1
  });

  assert(!resErr, 'RPC reserve_inventory_atomic succeeded', resErr?.message);
  assert(resData?.success === true, 'Stock reserved atomically with exclusive row lock');

  // Immediately release
  const { data: relData, error: relErr } = await supabase.rpc('release_inventory_atomic', {
    p_order_id: testOrderId,
    p_variant_id: targetVariantId,
    p_quantity: 1
  });

  assert(!relErr, 'RPC release_inventory_atomic succeeded', relErr?.message);
  assert(relData?.success === true, 'Reserved stock released back to available pool');

  // --------------------------------------------------------------------------
  // TEST 7: ROW LEVEL SECURITY (RLS) VERIFICATION
  // --------------------------------------------------------------------------
  console.log('\n>> [CHECK 7]: Row Level Security (RLS) Isolation');
  // Attempt to select internal inventory_items using anonymous client
  const { data: rlsInv, error: rlsErr } = await supabase
    .from('inventory_items')
    .select('*');

  assert(!rlsErr, 'Query executed cleanly under RLS rules');
  assert(Array.isArray(rlsInv) && rlsInv.length === 0, 'Internal inventory balances protected from anon callers (0 rows returned)');

  // --------------------------------------------------------------------------
  // TEST 8: ORDER INSERTION STOREFRONT POLICY & RLS PROTECTION
  // --------------------------------------------------------------------------
  console.log('\n>> [CHECK 8]: Storefront Order Insertion Policy & Patron Privacy');
  const sampleOrderId = `RASS-ORD-TEST-${Math.floor(100000 + Math.random() * 900000)}`;
  const { error: insertErr } = await supabase
    .from('orders')
    .insert([
      {
        id: sampleOrderId,
        customer_name: 'Verification Test Patron',
        customer_email: 'test.patron@example.com',
        customer_phone: '+91 99999 88888',
        shipping_address_line1: '10 Heirloom Way',
        shipping_city: 'Jaipur',
        shipping_state: 'Rajasthan',
        shipping_pincode: '302001',
        shipping_country: 'India',
        subtotal: 14500,
        discount_amount: 0,
        shipping_fee: 0,
        total_amount: 14500,
        payment_status: 'pending',
        fulfilment_status: 'unfulfilled',
        payment_method: 'razorpay_prepaid',
      }
    ]);

  assert(!insertErr, 'Storefront customer order insertion allowed under RLS policy', insertErr?.message);
  console.log(`   Order inserted successfully: ${sampleOrderId}`);

  // Confirm that unauthenticated callers cannot read the order back (patron privacy protection)
  const { data: readBack } = await supabase
    .from('orders')
    .select('id')
    .eq('id', sampleOrderId);
  assert(Array.isArray(readBack) && readBack.length === 0, 'Patron privacy confirmed: Unauthenticated client cannot read back order');

  console.log('\n===============================================================');
  console.log('🎉 ALL 8 DATABASE & SECURITY FEATURES VERIFIED 100% OPERATIONAL');
  console.log('===============================================================\n');
}

runSuite().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
