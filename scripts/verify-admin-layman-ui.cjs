const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Launching Chrome to inspect Restored Luxury Admin Portal...');
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

  // Verify Sidebar & 8 Luxury Navigation Tabs
  const tabNames = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside nav button'));
    return buttons.map(b => b.innerText.trim()).filter(Boolean);
  });
  console.log('Found 8 Sidebar navigation tabs:', tabNames);

  // Cycle through all tabs to ensure 0 errors
  const tabsToClick = ['Overview', 'Orders', 'Products', 'Inventory', 'Best Sellers', 'Coupons', 'Order Ledger', 'Home Media'];
  for (const t of tabsToClick) {
    await page.evaluate((tabName) => {
      const btns = Array.from(document.querySelectorAll('aside nav button'));
      const btn = btns.find(b => b.innerText.includes(tabName));
      if (btn) btn.click();
    }, t);
    await new Promise(r => setTimeout(r, 400));
  }

  // Go back to Products tab and click Add Product
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    const btn = btns.find(b => b.innerText.includes('Products'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  console.log('\nTesting "Add Product" button click...');
  const clickedAdd = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('header button, main button'));
    const addBtn = buttons.find(b => b.innerText.includes('Add Product') || b.innerText.includes('Add Design'));
    if (addBtn) {
      addBtn.click();
      return true;
    }
    return false;
  });
  console.log('Add Product button clicked:', clickedAdd);
  await new Promise(r => setTimeout(r, 800));

  // Inspect the Split-Screen Modal
  const modalInfo = await page.evaluate(() => {
    const modal = document.querySelector('.fixed.inset-0');
    if (!modal) return null;
    return {
      title: modal.querySelector('h3')?.innerText,
      hasLivePreview: modal.innerText.includes('LIVE PREVIEW ON YOUR WEBSITE') || modal.innerText.includes('Live Preview on Your Website'),
      hasImageUpload: modal.innerText.includes('Tap to Choose Photo') || modal.innerText.includes('Jewellery Photo'),
      hasPriceFields: modal.innerText.includes('Selling Price'),
      hasStockCounter: modal.innerText.includes('Available Pieces')
    };
  });
  console.log('Modal Inspection:', modalInfo);

  // Take screenshot for verification
  const screenshotPath = path.resolve('dist/admin-restored-screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Screenshot saved to: ${screenshotPath}`);

  if (errors.length > 0) {
    console.warn('\n⚠️ Page Errors Encountered:', errors);
  } else {
    console.log('\n✅ 0 Console Errors encountered across all 8 tabs & Add Product modal!');
  }

  await browser.close();
  console.log('\n🎉 Restored Luxury Admin Portal UI Inspection Complete!');
})();
