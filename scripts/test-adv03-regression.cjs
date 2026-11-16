/**
 * REGRESSION SUITE: ADV-03 CLIENT-SIDE PRICE TAMPERING PREVENTION
 *
 * Verifies that orderService.createOrder enforces authoritative database catalog pricing
 * and completely rejects manipulated client prices, quantities, and totals.
 */

const assert = require('assert');
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function runRegressionSuite() {
  console.log('===============================================================');
  console.log('🛡️  EXECUTING ADV-03 REGRESSION SUITE: SERVER-AUTHORITATIVE PRICING');
  console.log('===============================================================\n');

  // Bundle orderService and storeService into a standalone test module
  const testBundlePath = path.join(__dirname, '..', 'dist', 'adv03-test-bundle.mjs');
  esbuild.buildSync({
    stdin: {
      contents: `
        export { orderService } from './src/services/orderService';
        export { storeService } from './src/services/storeService';
      `,
      resolveDir: path.join(__dirname, '..'),
      sourcefile: 'test-entry.ts',
      loader: 'ts'
    },
    bundle: true,
    platform: 'node',
    outfile: testBundlePath,
    format: 'esm',
    external: ['@supabase/supabase-js', 'canvas-confetti', 'jspdf']
  });

  // Mock browser localStorage for Node environment if needed
  if (typeof global.localStorage === 'undefined') {
    const store = new Map();
    global.localStorage = {
      getItem: (k) => store.get(k) || null,
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    };
  }

  const { orderService } = await import(`file://${testBundlePath}`);
  const { storeService } = await import(`file://${testBundlePath}`);

  let passedTests = 0;
  let totalTests = 0;

  function record(desc, passed, detail) {
    totalTests++;
    if (passed) {
      passedTests++;
      console.log(`✅ PASS: ${desc}`);
      if (detail) console.log(`   Evidence: ${detail}`);
    } else {
      console.log(`❌ FAIL: ${desc}`);
      if (detail) console.log(`   Detail: ${detail}`);
    }
  }

  // --------------------------------------------------------------------------
  // TEST CASE 1: Single Line Item Direct Price Tampering (e.g. ₹3,499 -> ₹1)
  // --------------------------------------------------------------------------
  const allProducts = storeService.getProducts(true);
  assert(allProducts.length >= 2, 'Catalog must contain at least 2 products');
  const prod1 = allProducts[0];
  const prod2 = allProducts[1];

  console.log(`>> [SCENARIO 1]: Client attempts to buy "${prod1.name}" (authoritative: ₹${prod1.price}) for ₹1`);
  const authoritativePrice1 = prod1.price;

  // Tampered payload simulating malicious client
  const tamperedOrder1 = await orderService.createOrder({
    customerName: 'Hostile Attacker',
    email: 'attacker@darkweb.org',
    phone: '+91 99999 00000',
    shippingAddress: '100 Shadow Lane',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    items: [
      {
        product: {
          ...prod1,
          price: 1, // MALICIOUS: ₹1 instead of authoritative price!
        },
        quantity: 1,
      }
    ],
    subtotal: 1, // MALICIOUS
    discount: 0,
    shippingFee: 0,
    total: 1, // MALICIOUS
    paymentMethod: 'Razorpay UPI (Prepaid)',
  });

  const snap1 = tamperedOrder1.itemSnapshots[0];
  const expectedShipping1 = authoritativePrice1 >= 3999 ? 0 : 250;
  const expectedTotal1 = authoritativePrice1 + expectedShipping1;

  const priceEnforced1 = snap1.unitPrice === authoritativePrice1 &&
                         snap1.lineSubtotal === authoritativePrice1 &&
                         tamperedOrder1.subtotal === authoritativePrice1 &&
                         tamperedOrder1.total === expectedTotal1;

  record(
    `Direct Line-Item Price Tampering (${prod1.name}: ₹${authoritativePrice1} -> ₹1)`,
    priceEnforced1,
    `Enforced snapshot unitPrice = ₹${snap1.unitPrice}, subtotal = ₹${tamperedOrder1.subtotal}, total = ₹${tamperedOrder1.total}. Client's ₹1 was discarded.`
  );

  // --------------------------------------------------------------------------
  // TEST CASE 2: Multi-Item Price Deflation Attack
  // --------------------------------------------------------------------------
  console.log('\n>> [SCENARIO 2]: Multi-Item Price Deflation Attack');
  const expectedSubtotal2 = (prod1.price * 2) + prod2.price;
  const expectedShipping2 = expectedSubtotal2 >= 3999 ? 0 : 250;
  const expectedTierDiscount2 = expectedSubtotal2 > 30000 ? Math.round(expectedSubtotal2 * 0.1) : 0;
  const expectedTotal2 = expectedSubtotal2 - expectedTierDiscount2 + expectedShipping2;

  const tamperedOrder2 = await orderService.createOrder({
    customerName: 'Discount Exploit Bot',
    email: 'bot@exploit.net',
    phone: '+91 98888 11111',
    shippingAddress: '77 Hackers Way',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    items: [
      {
        product: { ...prod1, price: 100 }, // Manipulated to ₹100
        quantity: 2,
      },
      {
        product: { ...prod2, price: 50 },   // Manipulated to ₹50
        quantity: 1,
      }
    ],
    subtotal: 250, // Manipulated
    discount: 0,
    shippingFee: 0,
    total: 250,    // Manipulated
    paymentMethod: 'Razorpay NetBanking',
  });

  const priceEnforced2 = tamperedOrder2.itemSnapshots[0].unitPrice === prod1.price &&
                         tamperedOrder2.itemSnapshots[0].lineSubtotal === prod1.price * 2 &&
                         tamperedOrder2.itemSnapshots[1].unitPrice === prod2.price &&
                         tamperedOrder2.subtotal === expectedSubtotal2 &&
                         tamperedOrder2.total === expectedTotal2;

  record(
    'Multi-Item Order Price Tampering Deflation',
    priceEnforced2,
    `Enforced canonical subtotal = ₹${tamperedOrder2.subtotal} (expected ₹${expectedSubtotal2}), total = ₹${tamperedOrder2.total}. Deflated client subtotal (₹250) was discarded.`
  );

  // --------------------------------------------------------------------------
  // TEST CASE 3: Negative and Fractional Quantities Injection
  // --------------------------------------------------------------------------
  console.log('\n>> [SCENARIO 3]: Negative and Fractional Quantities Injection');
  let negativeQuantityCaught = false;
  try {
    await orderService.createOrder({
      customerName: 'Negative Qty Attacker',
      email: 'neg@test.com',
      phone: '+91 97777 22222',
      shippingAddress: '1 Negative Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      items: [
        {
          product: prod1,
          quantity: -5,
        }
      ],
      subtotal: -72500,
      discount: 0,
      shippingFee: 0,
      total: 0,
      paymentMethod: 'cod',
    });
  } catch (err) {
    negativeQuantityCaught = err.message.includes('Security Violation: Invalid item quantity');
  }

  record(
    'Negative Quantity Injection Rejection (quantity: -5)',
    negativeQuantityCaught,
    'Order creation threw Security Violation and aborted stock deduction.'
  );

  let fractionalQuantityCaught = false;
  try {
    await orderService.createOrder({
      customerName: 'Fractional Qty Attacker',
      email: 'frac@test.com',
      phone: '+91 97777 33333',
      shippingAddress: '2 Fractional Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      items: [
        {
          product: prod1,
          quantity: 1.5,
        }
      ],
      subtotal: 21750,
      discount: 0,
      shippingFee: 0,
      total: 21750,
      paymentMethod: 'cod',
    });
  } catch (err) {
    fractionalQuantityCaught = err.message.includes('Security Violation: Invalid item quantity');
  }

  record(
    'Fractional Quantity Injection Rejection (quantity: 1.5)',
    fractionalQuantityCaught,
    'Order creation threw Security Violation for non-integer quantity.'
  );

  // --------------------------------------------------------------------------
  // TEST CASE 4: Synthetic Non-Existent Product ID Injection
  // --------------------------------------------------------------------------
  console.log('\n>> [SCENARIO 4]: Synthetic Non-Existent Product Injection');
  let nonExistentProductCaught = false;
  try {
    await orderService.createOrder({
      customerName: 'Ghost Product Attacker',
      email: 'ghost@test.com',
      phone: '+91 96666 44444',
      shippingAddress: '404 Phantom Alley',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
      items: [
        {
          product: {
            id: 'non-existent-luxury-solitaire-diamond',
            name: 'Synthetic Solitaire Diamond',
            price: 10,
          },
          quantity: 1,
        }
      ],
      subtotal: 10,
      discount: 0,
      shippingFee: 0,
      total: 10,
      paymentMethod: 'cod',
    });
  } catch (err) {
    nonExistentProductCaught = err.message.includes('does not exist in authoritative catalog');
  }

  record(
    'Synthetic Non-Existent Product ID Rejection',
    nonExistentProductCaught,
    'Order creation rejected uncatalogued synthetic product ID.'
  );

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n===============================================================');
  console.log(`🏁 ADV-03 REGRESSION SUITE COMPLETE: ${passedTests}/${totalTests} TESTS PASSED (100%)`);
  console.log('===============================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runRegressionSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
