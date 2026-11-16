/**
 * VERIFICATION TEST: FESTIVE STOREFRONT POPUP CONTROL VIA COUPON ENGINE
 *
 * Verifies that:
 * 1. Default festive campaign is loaded with proper defaults
 * 2. Admin can link any promotional coupon (e.g. FESTIVE20, HEIRLOOM5000, WELCOME10)
 * 3. Admin can customize all copy: badgeText, headline, description, buttonText, delaySeconds
 * 4. Admin can toggle the storefront popup ON / OFF
 * 5. Configuration persists and links discount formula dynamically
 */

const assert = require('assert');
const esbuild = require('esbuild');
const path = require('path');

// Mock localStorage for Node environment if needed
if (typeof global.localStorage === 'undefined') {
  const store = new Map();
  global.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
}

async function runTest() {
  console.log('===============================================================');
  console.log('✨ VERIFYING FESTIVE STOREFRONT POPUP & COUPON CONTROL ENGINE');
  console.log('===============================================================\n');

  const testBundlePath = path.join(__dirname, '..', 'dist', 'festive-test-bundle.mjs');
  esbuild.buildSync({
    stdin: {
      contents: `
        export { couponService, DEFAULT_FESTIVE_CAMPAIGN } from './src/services/couponService';
      `,
      resolveDir: path.join(__dirname, '..'),
      sourcefile: 'test-festive-entry.ts',
      loader: 'ts',
    },
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: testBundlePath,
    external: ['@supabase/supabase-js', 'jspdf', 'canvas-confetti'],
  });

  const { couponService, DEFAULT_FESTIVE_CAMPAIGN } = await import(`file://${testBundlePath}`);

  // 1. Initial State Check
  console.log('>> [STEP 1]: Initial Festive Campaign State');
  const initial = couponService.getFestiveCampaign();
  assert.strictEqual(initial.isEnabled, true, 'Default festive campaign should be enabled');
  assert.strictEqual(initial.linkedCouponCode, 'FESTIVE20');
  assert(initial.headline.length > 0);
  assert(initial.badgeText.length > 0);
  console.log(`   ✅ Default Campaign Active: "${initial.headline}" | Code: ${initial.linkedCouponCode}`);

  // 2. Custom Festive Campaign Configuration (Admin Customization)
  console.log('\n>> [STEP 2]: Admin Configures Custom Festive Celebration Offer');
  const diwaliCampaign = {
    isEnabled: true,
    linkedCouponCode: 'HEIRLOOM5000',
    badgeText: 'DIWALI HEIRLOOM GALA • LIMITED PRIVILEGE',
    headline: 'Celebrate The Festival of Lights in Solid Gold & Polki',
    description: 'Enjoy a flat ₹5,000 festive privilege on signature jewellery creations above ₹50,000.',
    buttonText: 'Claim ₹5,000 Festive Gift',
    showConfetti: true,
    delaySeconds: 1.5,
  };

  const updated = couponService.saveFestiveCampaign(diwaliCampaign);
  assert.strictEqual(updated.linkedCouponCode, 'HEIRLOOM5000');
  assert.strictEqual(updated.badgeText, diwaliCampaign.badgeText);
  assert.strictEqual(updated.headline, diwaliCampaign.headline);
  assert.strictEqual(updated.description, diwaliCampaign.description);
  assert.strictEqual(updated.buttonText, diwaliCampaign.buttonText);
  assert.strictEqual(updated.delaySeconds, 1.5);

  const reloaded = couponService.getFestiveCampaign();
  assert.strictEqual(reloaded.headline, diwaliCampaign.headline);
  console.log(`   ✅ Custom Headline Saved: "${reloaded.headline}"`);
  console.log(`   ✅ Custom Badge Saved: "${reloaded.badgeText}"`);
  console.log(`   ✅ Linked Coupon: "${reloaded.linkedCouponCode}"`);

  // 3. Dynamic Linked Coupon Validation
  console.log('\n>> [STEP 3]: Dynamic Linked Coupon Offer Verification');
  const linked = couponService.getCouponByCode(reloaded.linkedCouponCode);
  assert(linked, 'Linked coupon HEIRLOOM5000 must exist');
  assert.strictEqual(linked.discountType, 'fixed_amount');
  assert.strictEqual(linked.discountValue, 5000);
  assert.strictEqual(linked.minOrderValue, 50000);

  const discountFormula = `${linked.discountType === 'percentage' ? `Flat ${linked.discountValue}% OFF` : `Flat ₹${linked.discountValue.toLocaleString('en-IN')} OFF`} • Min. cart ₹${linked.minOrderValue.toLocaleString('en-IN')}`;
  assert.strictEqual(discountFormula, 'Flat ₹5,000 OFF • Min. cart ₹50,000');
  console.log(`   ✅ Dynamic Formula Computed for Modal: "${discountFormula}"`);

  // 4. Toggle ON/OFF Check
  console.log('\n>> [STEP 4]: Admin Toggles Popup Off & On');
  const turnedOff = couponService.toggleFestiveCampaign();
  assert.strictEqual(turnedOff, false, 'Should be toggled to false');
  assert.strictEqual(couponService.getFestiveCampaign().isEnabled, false);
  console.log('   ✅ Successfully toggled OFF (Site will skip popup display)');

  const turnedOn = couponService.toggleFestiveCampaign();
  assert.strictEqual(turnedOn, true, 'Should be toggled back to true');
  assert.strictEqual(couponService.getFestiveCampaign().isEnabled, true);
  console.log('   ✅ Successfully toggled ON (Site will display popup to visitors)');

  console.log('\n===============================================================');
  console.log('🎉 FESTIVE STOREFRONT POPUP & COUPON CONTROL VERIFIED 100%');
  console.log('===============================================================\n');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
