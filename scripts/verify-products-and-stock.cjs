const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  console.log('🚀 Verifying Unified Products & Stock tab with Least-Stock sorting...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 1000 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.toString()));

  await page.goto('http://localhost:5173/#admin', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('rass_admin_session', JSON.stringify({
      id: 'admin_master_1', email: 'admin@rassbyriddhima.com', role: 'superadmin',
      name: 'Riddhima Singhania (Head of Design)', authProvider: 'master_fallback',
      lastLogin: new Date().toISOString()
    }));
    window.location.hash = '#admin';
    window.location.reload();
  });
  await new Promise(r => setTimeout(r, 1800));

  // 1. Verify navigation sidebar
  const navTabs = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    return btns.map(b => b.innerText.trim());
  });
  console.log('Sidebar Navigation Tabs:', navTabs);

  const hasProductsAndStock = navTabs.some(t => t.includes('Products & Stock'));
  const hasSeparateInventory = navTabs.some(t => t.trim() === 'Inventory' || t.startsWith('Inventory\n'));
  console.log('Has Products & Stock tab:', hasProductsAndStock);
  console.log('Has separate Inventory tab (should be false):', hasSeparateInventory);

  // 2. Click "Products & Stock" tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    const prodTab = btns.find(b => b.innerText.includes('Products & Stock'));
    if (prodTab) prodTab.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 3. Inspect top summary cards and table
  const stockSummary = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.grid.grid-cols-1.sm\\:grid-cols-3 > div'));
    return cards.map(c => c.innerText.trim().replace(/\n+/g, ' '));
  });
  console.log('\nTop Stock Summary Cards:', stockSummary);

  // 4. Test Sorting by Least Units First
  console.log('\nSelecting "Least Units First (Low Stock)" sort option...');
  await page.evaluate(() => {
    const selects = Array.from(document.querySelectorAll('select'));
    const sortSelect = selects.find(s => Array.from(s.options).some(o => o.value === 'stock_asc'));
    if (sortSelect) {
      sortSelect.value = 'stock_asc';
      sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 500));

  const topRowsStock = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tbody tr')).slice(0, 5);
    return rows.map(r => {
      const name = r.querySelector('td:nth-child(1) span')?.innerText;
      const stock = r.querySelector('td:nth-child(4) span')?.innerText;
      return `${name} -> ${stock}`;
    });
  });
  console.log('Top rows sorted by least stock first:', topRowsStock);

  // 5. Test Quick Stock Increment (+) on the first row
  console.log('\nTesting Quick Stock [+] button on top row...');
  const beforeStock = await page.evaluate(() => {
    return document.querySelector('tbody tr:first-child td:nth-child(4) span')?.innerText;
  });
  console.log('Stock before click:', beforeStock);

  await page.evaluate(() => {
    const plusBtn = document.querySelector('tbody tr:first-child td:nth-child(4) button[title="Add 1 piece"]');
    if (plusBtn) plusBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const afterStock = await page.evaluate(() => {
    return document.querySelector('tbody tr:first-child td:nth-child(4) span')?.innerText;
  });
  console.log('Stock after click [+1]:', afterStock);

  // Take screenshot
  const screenshotPath = path.resolve('dist/products-and-stock-verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`\n📸 Screenshot saved to: ${screenshotPath}`);

  if (errors.length > 0) {
    console.warn('⚠️ Console errors:', errors);
  } else {
    console.log('✨ 0 Console errors encountered!');
  }

  await browser.close();
  console.log('🎉 Verification Complete!');
})();
