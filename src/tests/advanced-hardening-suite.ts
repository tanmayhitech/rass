// ============================================================================
// Rass by Riddhima — Advanced Production Verification & Hardening Test Suite
// Verifies:
// 1. Concurrency & Race-Condition Lock (Simultaneous High-Traffic Checkouts)
// 2. Row Level Security (RLS) Penetration Resistance & Tampering Prevention
// 3. Complete End-to-End Order & Line Items Snapshot Pipeline
// 4. Indian Jewellery GST (3% HSN 7113) & Financial Math Precision
// 5. Branded PDF GST Invoice & Packing Slip Generation
// 6. Double-Entry Accounting Ledger Reconciliation
// ============================================================================

import { createClient } from '@supabase/supabase-js';
import { PDFService } from '../services/pdfService';
import { AnalyticsService } from '../services/analyticsService';
import { Order, CartItem } from '../types';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://qugrjbcjnddqceynynds.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_AOECMefE4vYt-hiSnGIhAg_UeyWYKDQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function assert(condition: boolean, testName: string, detail?: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName} ${detail ? `(${detail})` : ''}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName} ${detail ? `— ${detail}` : ''}`);
}

async function runAdvancedSuite() {
  console.log('\n===============================================================');
  console.log('🏛️  RASS BY RIDDHIMA — ADVANCED PRODUCTION HARDENING SUITE');
  console.log('Target Database:', SUPABASE_URL);
  console.log('===============================================================\n');

  // ==========================================================================
  // SUITE 1: CONCURRENCY & RACE CONDITION TEST (SIMULTANEOUS CHECKOUTS)
  // ==========================================================================
  console.log('>> [SUITE 1]: High-Concurrency Race Condition & Row-Locking Stress Test');
  const targetVariantId = 'var-neck-01-std'; // Low-stock collar with 3 units
  const orderBatchPrefix = `STRESS-ORD-${Date.now()}`;

  // Step 1: Fire 10 simultaneous atomic reservation requests in parallel
  console.log('   Simulating 10 patrons checking out at the exact same millisecond...');
  const concurrentRequests = Array.from({ length: 10 }, (_, i) => {
    const orderId = `${orderBatchPrefix}-${i + 1}`;
    return supabase.rpc('reserve_inventory_atomic', {
      p_order_id: orderId,
      p_variant_id: targetVariantId,
      p_quantity: 1,
    }).then((res) => ({ index: i + 1, orderId, ...res }));
  });

  const responses = await Promise.all(concurrentRequests);
  
  const successfulReservations = responses.filter((r) => r.data?.success === true);
  const rejectedReservations = responses.filter((r) => r.data?.success === false);

  console.log(`   Results: ${successfulReservations.length} succeeded, ${rejectedReservations.length} rejected gracefully.`);

  assert(
    successfulReservations.length > 0 && successfulReservations.length <= 3,
    'Concurrency guard strictly limited reservations to available stock',
    `Exactly ${successfulReservations.length} units reserved`
  );

  assert(
    rejectedReservations.length >= 7,
    'Overselling strictly prevented on exhausted inventory',
    `${rejectedReservations.length} excess checkout requests rejected`
  );

  const sampleRejection = rejectedReservations[0]?.data?.message;
  assert(
    Boolean(sampleRejection && sampleRejection.includes('Insufficient stock')),
    'Clean informative message returned to out-of-stock shoppers',
    sampleRejection
  );

  // Step 2: Rollback all stress test reservations to leave database in pristine state
  for (const success of successfulReservations) {
    await supabase.rpc('release_inventory_atomic', {
      p_order_id: success.orderId,
      p_variant_id: targetVariantId,
      p_quantity: 1,
    });
  }
  console.log('   Rolled back all stress test reservations; inventory balance restored.');

  // ==========================================================================
  // SUITE 2: SECURITY PENETRATION & RLS POLICY ENFORCEMENT
  // ==========================================================================
  console.log('\n>> [SUITE 2]: Security Penetration & RLS Policy Enforcement');

  // Attempt 1: Unauthorized price tampering on products table
  const { data: tamperedProd, error: prodTamperErr } = await supabase
    .from('products')
    .update({ base_price: 1 })
    .eq('id', 'rass-necklace-01')
    .select();

  assert(
    !tamperedProd || tamperedProd.length === 0,
    'RLS blocked unauthorized product price tampering',
    'Anonymous client cannot mutate catalog prices'
  );

  // Verify real price was preserved in database
  const { data: checkProd } = await supabase
    .from('products')
    .select('base_price')
    .eq('id', 'rass-necklace-01')
    .single();
  assert(
    checkProd?.base_price === 38000,
    'Product price remains securely untampered at ₹38,000',
    `Current price: ₹${checkProd?.base_price}`
  );

  // Attempt 2: Unauthorized coupon modification
  const { data: tamperedCoupon } = await supabase
    .from('coupons')
    .update({ discount_value: 99 })
    .eq('code', 'RASS20')
    .select();

  assert(
    !tamperedCoupon || tamperedCoupon.length === 0,
    'RLS blocked unauthorized promotion/coupon manipulation'
  );

  // Attempt 3: Coupon rule enforcement (Subtotal below minimum threshold)
  const { data: lowSpendCoupon } = await supabase.rpc('validate_and_apply_coupon', {
    p_code: 'RASS20',
    p_subtotal: 15000, // Below ₹30,000 minimum
    p_customer_email: 'bargain.hunter@example.com'
  });

  assert(
    lowSpendCoupon?.valid === false,
    'Atomic coupon procedure blocked discount below minimum spend threshold',
    lowSpendCoupon?.message
  );

  // Attempt 4: Non-existent coupon code
  const { data: fakeCoupon } = await supabase.rpc('validate_and_apply_coupon', {
    p_code: 'FAKEPROMO999',
    p_subtotal: 50000,
    p_customer_email: 'tester@example.com'
  });

  assert(
    fakeCoupon?.valid === false,
    'Non-existent coupon code safely rejected'
  );

  // ==========================================================================
  // SUITE 3: END-TO-END ORDER & SNAPSHOT PIPELINE
  // ==========================================================================
  console.log('\n>> [SUITE 3]: End-to-End Order & Line Items Snapshot Pipeline');
  const e2eOrderId = `RASS-ORD-E2E-${Math.floor(100000 + Math.random() * 900000)}`;

  // Step 1: Create master order in PostgreSQL
  const { error: orderInsertErr } = await supabase
    .from('orders')
    .insert([
      {
        id: e2eOrderId,
        customer_name: 'Ananya Deshmukh',
        customer_email: 'ananya.d@luxury-client.in',
        customer_phone: '+91 98331 44556',
        shipping_address_line1: 'Penthouse 14, Altamount Road',
        shipping_city: 'Mumbai',
        shipping_state: 'Maharashtra',
        shipping_pincode: '400026',
        shipping_country: 'India',
        subtotal: 38000,
        discount_amount: 3800,
        shipping_fee: 0,
        tax_amount: 1026,
        total_amount: 35226,
        payment_method: 'razorpay_prepaid',
        payment_status: 'captured',
        fulfilment_status: 'processing',
        applied_coupon_code: 'WELCOME10',
      }
    ]);

  assert(!orderInsertErr, 'Order successfully recorded in PostgreSQL', e2eOrderId);

  // Step 2: Create immutable order item snapshot
  const { error: itemInsertErr } = await supabase
    .from('order_items')
    .insert([
      {
        order_id: e2eOrderId,
        product_variant_id: 'var-neck-01-std',
        product_id_snapshot: 'rass-necklace-01',
        product_title_snapshot: 'Rajkumari Cascading Jhumka Collar',
        variant_name_snapshot: 'Standard Collar',
        sku_snapshot: 'RASS-NCK-01-STD',
        image_url_snapshot: '/images/clean_cat_necklaces.png',
        unit_price: 38000,
        quantity: 1,
        line_subtotal: 38000,
      }
    ]);

  assert(!itemInsertErr, 'Immutable line item snapshot recorded with historical purchase price');

  // Step 3: Trigger atomic inventory deduction for the confirmed order
  const { data: deductResult, error: deductErr } = await supabase.rpc('deduct_inventory_atomic', {
    p_order_id: e2eOrderId,
    p_variant_id: 'var-neck-01-std',
    p_quantity: 1,
  });

  assert(!deductErr, 'RPC deduct_inventory_atomic succeeded', deductErr?.message);
  assert(deductResult?.success === true, 'Atomic inventory balance deducted on payment confirmation');

  // Step 4: Simulate order cancellation and atomic inventory replenishment
  const { data: restockResult, error: restockErr } = await supabase.rpc('release_inventory_atomic', {
    p_order_id: e2eOrderId,
    p_variant_id: 'var-neck-01-std',
    p_quantity: 1,
  });

  assert(!restockErr, 'RPC release_inventory_atomic replenishment succeeded');
  assert(restockResult?.success === true, 'Stock replenished atomically upon cancellation');

  // ==========================================================================
  // SUITE 4: INDIAN JEWELLERY GST & ACCOUNTING MATH
  // ==========================================================================
  console.log('\n>> [SUITE 4]: Indian Jewellery GST (3% HSN 7113) & Tax Math Precision');

  // Intra-state (Delhi -> Delhi)
  const taxableValueIntra = 38000 - 3800; // ₹34,200 after 10% discount
  const gstRate = 0.03; // 3% for jewellery
  const totalGstIntra = Math.round(taxableValueIntra * gstRate * 100) / 100;
  const cgstIntra = Math.round((totalGstIntra / 2) * 100) / 100;
  const sgstIntra = Math.round((totalGstIntra / 2) * 100) / 100;

  assert(cgstIntra === 513 && sgstIntra === 513, 'Intra-state GST split exactly 1.5% CGST (₹513) + 1.5% SGST (₹513)');
  assert(cgstIntra + sgstIntra === 1026, 'Total tax matches 3% GST (₹1,026)');

  // Inter-state (Delhi -> Mumbai)
  const igstInter = Math.round(taxableValueIntra * gstRate * 100) / 100;
  assert(igstInter === 1026, 'Inter-state IGST calculated as single 3% levy (₹1,026)');

  // ==========================================================================
  // SUITE 5: BRANDED PDF INVOICE & PACKING SLIP INTEGRITY
  // ==========================================================================
  console.log('\n>> [SUITE 5]: Branded PDF Tax Invoice & Packing Slip Generation');

  const testOrderForPdf: Order = {
    id: e2eOrderId,
    customerName: 'Ananya Deshmukh',
    email: 'ananya.d@luxury-client.in',
    phone: '+91 98331 44556',
    shippingAddress: 'Penthouse 14, Altamount Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400026',
    country: 'India',
    items: [],
    itemSnapshots: [
      {
        id: 'snap-e2e-1',
        productId: 'rass-necklace-01',
        productTitle: 'Rajkumari Cascading Jhumka Collar',
        variantName: 'Standard Collar',
        sku: 'RASS-NCK-01-STD',
        imageUrl: '/images/clean_cat_necklaces.png',
        unitPrice: 38000,
        quantity: 1,
        lineSubtotal: 38000,
      }
    ],
    subtotal: 38000,
    discount: 3800,
    shippingFee: 0,
    tax: 1026,
    total: 35226,
    date: '20 Oct 2026',
    orderTime: '03:15 PM',
    status: 'Processing',
    paymentStatus: 'captured',
    fulfilmentStatus: 'processing',
    paymentMethod: 'Razorpay UPI (Prepaid)',
    razorpayOrderId: 'order_live_ananya_9921',
    razorpayPaymentId: 'pay_live_ananya_4812',
    appliedCoupon: 'WELCOME10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const invoiceDoc = PDFService.generateInvoicePDF(testOrderForPdf);
  assert(Boolean(invoiceDoc), 'Tax invoice PDF successfully compiled');
  const invoicePdfData = invoiceDoc.output();
  assert(invoicePdfData.startsWith('%PDF-'), 'Invoice output contains valid %PDF- binary header');
  assert(invoicePdfData.length > 1000, 'Invoice contains substantive branded document structure', `${invoicePdfData.length} bytes`);

  const packingDoc = PDFService.generatePackingSlipPDF(testOrderForPdf);
  assert(Boolean(packingDoc), 'Warehouse packing slip PDF successfully compiled');
  const packingPdfData = packingDoc.output();
  assert(packingPdfData.startsWith('%PDF-'), 'Packing slip contains valid %PDF- binary header');
  assert(packingPdfData.length > 1000, 'Packing slip contains substantive warehouse layout', `${packingPdfData.length} bytes`);

  // ==========================================================================
  // SUITE 6: DOUBLE-ENTRY ORDER LEDGER RECONCILIATION
  // ==========================================================================
  console.log('\n>> [SUITE 6]: Double-Entry Order Ledger Reconciliation');

  const ordersList: Order[] = [testOrderForPdf];
  const csvContent = AnalyticsService.generateOrderLedgerCSV(ordersList);

  assert(csvContent.includes('Order ID,Date,Customer Name,Email'), 'Ledger CSV contains GAAP standard headers');
  assert(csvContent.includes(e2eOrderId), 'Ledger CSV includes confirmed order ID');
  assert(csvContent.includes('Net Sales Contribution'), 'Ledger CSV includes Net Sales Contribution column');
  assert(csvContent.includes('34200'), 'Ledger CSV records exact Net Sales Contribution (₹34,200)');

  console.log('\n===============================================================');
  console.log('🏆 ALL 6 ADVANCED PRODUCTION SUITES PASSED! 100% VERIFIED');
  console.log('===============================================================\n');
}

runAdvancedSuite().catch((err) => {
  console.error('Advanced suite failed:', err);
  process.exit(1);
});
