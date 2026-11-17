const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  console.log('📸 Capturing simplified Festive Studio UI screenshot...');
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

  // Navigate to Coupons tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    const couponTab = btns.find(b => b.innerText.includes('Coupons'));
    if (couponTab) couponTab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot simplified festive card
  const el = await page.$('.bg-white.rounded-3xl.border');
  if (el) {
    await el.screenshot({ path: path.resolve('dist/simplified-festive-card.png') });
    console.log('✅ Saved dist/simplified-festive-card.png');
  } else {
    console.log('❌ Element not found');
  }

  if (errors.length > 0) {
    console.warn('⚠️ Console errors:', errors);
  } else {
    console.log('✨ 0 Console errors!');
  }

  await browser.close();
})();
