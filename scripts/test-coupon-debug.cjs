const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/#admin', { waitUntil: 'networkidle2' });
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
  await new Promise(r => setTimeout(r, 1200));

  // Navigate to Coupons
  await page.click('button[title="Coupons"]');
  await new Promise(r => setTimeout(r, 600));

  // Click Create Coupon
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Create Coupon')).click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Type into coupon code
  await page.type('input[placeholder*="FESTIVE20"]', 'FESTIVE99');

  // Click Activate button
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Activate');
    console.log('Button found:', btn?.innerText);
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  const hasCoupon = await page.evaluate(() => document.body.innerText.includes('FESTIVE99'));
  console.log('Coupon created and in list?:', hasCoupon);

  await browser.close();
})();
