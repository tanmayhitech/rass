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

  // Click Products tab
  await page.click('button[title="Products"]');
  await new Promise(r => setTimeout(r, 600));

  // Click Add Product
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Add Product')).click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Type title with real keyboard events
  await page.type('input[placeholder*="Noor Emerald"]', 'Puppeteer Tested Ruby Royal Ring');

  // Submit form
  await page.evaluate(() => {
    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Save & Publish')).click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const hasProduct = await page.evaluate(() => document.body.innerText.includes('Puppeteer Tested Ruby Royal Ring'));
  console.log('Product created and in catalog?:', hasProduct);
  await browser.close();
})();
