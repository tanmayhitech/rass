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

  const tabs = ['Overview', 'Inventory', 'Products', 'Orders', 'Best Sellers', 'Coupons', 'Order Ledger', 'Home Media'];
  for (const t of tabs) {
    await page.evaluate((tab) => {
      const btn = document.querySelector(`button[title="${tab}"]`);
      if (btn) btn.click();
    }, t);
    await new Promise(r => setTimeout(r, 600));
    const sample = await page.evaluate(() => {
      const main = document.querySelector('main');
      return main ? main.innerText.slice(0, 300) : 'No main element';
    });
    console.log(`\n=== TAB: ${t} ===`);
    console.log(sample);
  }
  await browser.close();
})();
