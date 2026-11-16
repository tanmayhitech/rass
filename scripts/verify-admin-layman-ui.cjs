const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Launching Chrome to inspect Redesigned Layman Admin Portal...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Capture console errors
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.toString());
  });

  await page.goto('http://localhost:5173/#admin', { waitUntil: 'networkidle2' });

  // Simulate authenticated admin session
  await page.evaluate(() => {
    localStorage.setItem('rass_admin_session', JSON.stringify({
      id: 'admin_master_1',
      email: 'admin@rassbyriddhima.com',
      role: 'superadmin',
      name: 'Riddhima Singhania (Head of Design)',
      authProvider: 'master_fallback',
      lastLogin: new Date().toISOString()
    }));
    window.location.reload();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Verify the 4 Layman Tabs exist
  const tabNames = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('nav button, header button'));
    return buttons.map(b => b.innerText.trim()).filter(Boolean);
  });
  console.log('Found navigation buttons:', tabNames);

  // Check the main heading and sections
  const mainContent = await page.evaluate(() => {
    const main = document.querySelector('main');
    return main ? main.innerText.slice(0, 500) : 'No main element';
  });
  console.log('\n--- Layman Dashboard Main Content ---');
  console.log(mainContent);

  // Click "Add New Jewellery Piece" button
  console.log('\nTesting "Add New Jewellery Piece" button click...');
  const clickedAdd = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const addBtn = buttons.find(b => b.innerText.includes('Add New Jewellery Piece'));
    if (addBtn) {
      addBtn.click();
      return true;
    }
    return false;
  });
  console.log('Add New Jewellery Piece button clicked:', clickedAdd);
  await new Promise(r => setTimeout(r, 1000));

  // Inspect the Modal
  const modalInfo = await page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0');
    if (!modal) return null;
    return {
      title: modal.querySelector('h3')?.innerText,
      hasLivePreview: modal.innerText.includes('Live Preview on Your Website'),
      hasImageUpload: modal.innerText.includes('Tap to Choose Photo') || modal.innerText.includes('Jewellery Photo'),
      hasPriceFields: modal.innerText.includes('Selling Price') && modal.innerText.includes('Cut Price'),
      hasStockCounter: modal.innerText.includes('How many pieces do you have?')
    };
  });
  console.log('Modal Inspection:', modalInfo);

  // Take screenshot for verification
  const screenshotPath = path.resolve('dist/admin-redesign-screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Screenshot saved to: ${screenshotPath}`);

  if (errors.length > 0) {
    console.warn('\n⚠️ Page Errors Encountered:', errors);
  } else {
    console.log('\n✅ 0 Console Errors encountered during Admin Portal interaction!');
  }

  await browser.close();
  console.log('\n🎉 Redesigned Layman Admin Portal UI Inspection Complete!');
})();
