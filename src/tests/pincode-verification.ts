// ============================================================================
// Rass by Riddhima — Pincode Service Verification Suite
// ============================================================================

declare const process: any;

import { pincodeService } from '../services/pincodeService';

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function runTests() {
  console.log('--- STARTING PINCODE VERIFICATION SUITE ---\n');

  // Test 1: Sanitize
  assert(pincodeService.sanitize(' 400 050 ') === '400050', 'Sanitize trims spaces and non-digits');
  assert(pincodeService.sanitize('400-050') === '400050', 'Sanitize removes hyphens');
  assert(pincodeService.sanitize('110001999') === '110001', 'Sanitize truncates to 6 digits');

  // Test 2: Validation
  assert(pincodeService.isValid('400050') === true, 'Valid 6-digit pin passes');
  assert(pincodeService.isValid('012345') === false, 'Pin starting with 0 fails');
  assert(pincodeService.isValid('12345') === false, 'Pin with 5 digits fails');
  assert(pincodeService.isValid('abcdef') === false, 'Alpha chars fail');

  // Test 3: Lookup Mumbai (400050)
  const resMumbai = await pincodeService.lookup('400050');
  assert(resMumbai.success === true, 'Lookup for 400050 succeeds');
  assert(Boolean(resMumbai.data?.city && resMumbai.data.city.toLowerCase().includes('mumbai')), `City for 400050 is Mumbai (got: ${resMumbai.data?.city})`);
  assert(Boolean(resMumbai.data?.state && resMumbai.data.state.toLowerCase().includes('maharashtra')), `State for 400050 is Maharashtra (got: ${resMumbai.data?.state})`);

  // Test 4: Lookup New Delhi (110001)
  const resDelhi = await pincodeService.lookup('110001');
  assert(resDelhi.success === true, 'Lookup for 110001 succeeds');
  assert(Boolean(resDelhi.data?.state && resDelhi.data.state.toLowerCase().includes('delhi')), `State for 110001 is Delhi (got: ${resDelhi.data?.state})`);

  // Test 5: Cache retrieval
  const cachedDelhi = pincodeService.getCached('110001');
  assert(cachedDelhi !== null && cachedDelhi.state.toLowerCase().includes('delhi'), 'Cached lookup returns immediately');

  // Test 6: Offline fallback mapping for a valid prefix
  const resJaipur = await pincodeService.lookup('302001');
  assert(resJaipur.success === true, 'Lookup for 302001 succeeds');
  assert(Boolean(resJaipur.data?.state && resJaipur.data.state.toLowerCase().includes('rajasthan')), `State for 302001 is Rajasthan (got: ${resJaipur.data?.state})`);

  console.log('\n🎉 ALL PINCODE TESTS PASSED PERFECTLY!\n');
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
