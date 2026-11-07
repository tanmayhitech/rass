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

  // Navigate to Orders
  await page.click('button[title="Orders"]');
  await new Promise(r => setTimeout(r, 600));

  // Click Invoice button
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Invoice');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const hasInvoice = await page.evaluate(() => document.body.innerText.includes('TAX INVOICE'));
  console.log('Invoice modal opened?:', hasInvoice);

  // Close invoice modal by clicking X
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[title="Close"]') || Array.from(document.querySelectorAll('button')).find(b => b.querySelector('svg.lucide-x') || b.querySelector('svg'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Click Slip button
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Slip');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const hasSlip = await page.evaluate(() => document.body.innerText.includes('COURIER DISPATCH') || document.body.innerText.includes('DELIVERY SLIP'));
  console.log('Courier slip modal opened?:', hasSlip);

  await browser.close();
})();
