const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.removeItem('rass_admin_session');
    window.location.hash = '#admin';
  });
  await new Promise(r => setTimeout(r, 600));

  // Type wrong password
  await page.click('input[type="password"]', { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await page.type('input[type="password"]', 'WrongPass!');
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 1200));

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Body text after wrong password:');
  console.log(text);
  await browser.close();
})();
