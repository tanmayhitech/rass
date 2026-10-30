import { homeMediaService, INITIAL_HOME_MEDIA } from '../services/homeMediaService';

function assert(condition: boolean, testName: string, detail?: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName} ${detail ? `(${detail})` : ''}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName} ${detail ? `— ${detail}` : ''}`);
}

async function runTest() {
  console.log('\n===============================================================');
  console.log('💎 RASS BY RIDDHIMA — HOME MEDIA MANAGEMENT VERIFICATION');
  console.log('===============================================================\n');

  // 1. Initial State
  const initial = homeMediaService.getAll();
  assert(initial.length >= 10, 'Initial items count >= 10 (8 category cards + 2 editorial)', `${initial.length} items`);

  // 2. Query category items
  const col1 = homeMediaService.getCategoryItems(1);
  assert(col1.length >= 2, 'Column 1 has cards', `${col1.map(c => c.title).join(', ')}`);
  const col2 = homeMediaService.getCategoryItems(2);
  assert(col2.length >= 3, 'Column 2 has cards', `${col2.map(c => c.title).join(', ')}`);
  const col3 = homeMediaService.getCategoryItems(3);
  assert(col3.length >= 3, 'Column 3 has cards', `${col3.map(c => c.title).join(', ')}`);

  // 3. Query editorial items
  const editorials = homeMediaService.getEditorialItems();
  assert(editorials.length === 2, '2 Editorial highlights present', `${editorials.map(e => e.title).join(', ')}`);

  // 4. Test Replacing an Image
  const testId = 'cat-rings';
  const newImg = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800';
  const replaced = homeMediaService.replaceImage(testId, newImg, {
    title: 'CUSTOM RINGS',
    subtitle: 'Exclusive Solitaires',
    altText: 'Custom luxury rings collection',
  });
  assert(replaced.currentImage === newImg, 'Image replaced successfully', replaced.currentImage);
  assert(replaced.title === 'CUSTOM RINGS', 'Custom title applied', replaced.title);
  assert(replaced.isCustom === true, 'Marked as custom', `isCustom=${replaced.isCustom}`);

  // 5. Test Visibility Toggle (Hide / Show)
  const isVisibleAfterToggle = homeMediaService.toggleVisibility(testId);
  assert(isVisibleAfterToggle === false, 'Item hidden successfully', `isVisible=${isVisibleAfterToggle}`);
  const isVisibleRestored = homeMediaService.toggleVisibility(testId);
  assert(isVisibleRestored === true, 'Item restored successfully', `isVisible=${isVisibleRestored}`);

  // 6. Test Resetting to Factory Default
  const restored = homeMediaService.resetToDefault(testId);
  assert(restored.isCustom === false, 'Reset to default clears custom flag', `isCustom=${restored.isCustom}`);
  assert(restored.title === 'RINGS', 'Title reverted to default RINGS', restored.title);

  // 7. Test Adding a Custom Card
  const newCard = homeMediaService.addCustomCard({
    title: 'SPECIAL FESTIVE EDITION',
    subtitle: 'Limited Holiday Jewels',
    section: 'category',
    categoryKey: 'necklaces',
    column: 3,
    order: 10,
    heightClass: 'aspect-[1/1]',
    currentImage: 'https://example.com/festive.png',
    defaultImage: 'https://example.com/festive.png',
    altText: 'Festive jewels',
    isVisible: true,
  });
  assert(Boolean(newCard.id), 'Custom card added with generated id', newCard.id);
  const found = homeMediaService.getById(newCard.id);
  assert(Boolean(found), 'Custom card retrievable by id', found?.title);

  // 8. Test Deleting Custom Card
  const deleted = homeMediaService.deleteItem(newCard.id);
  assert(deleted === true, 'Custom card deleted successfully', `deleted=${deleted}`);

  // 9. Reset All to Default
  const resetAll = homeMediaService.resetAllToDefault();
  assert(resetAll.every(i => !i.isCustom), 'All items cleared to default', 'All items default');

  // 10. Storage Stats Health Check
  const stats = homeMediaService.getStorageStats();
  assert(typeof stats.usedBytes === 'number', 'Storage stats returns usedBytes number', `${stats.usedFormatted}`);
  assert(stats.itemCount >= 10, 'Storage stats reports all managed items', `${stats.itemCount} items`);

  // 11. Verify cleanImage does not override custom replaced images
  const testNecklace = homeMediaService.replaceImage('cat-necklaces', 'data:image/webp;base64,TEST_CUSTOM_IMAGE');
  assert(testNecklace.cleanImage === undefined, 'cleanImage is undefined when custom image set', `cleanImage=${testNecklace.cleanImage}`);
  assert(testNecklace.currentImage.includes('TEST_CUSTOM_IMAGE'), 'currentImage is the custom image', testNecklace.currentImage);
  homeMediaService.resetToDefault('cat-necklaces');

  console.log('\n===============================================================');
  console.log('🎉 ALL HOME MEDIA MANAGER TESTS PASSED WITH 100% SUCCESS!');
  console.log('===============================================================\n');
}

runTest().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
