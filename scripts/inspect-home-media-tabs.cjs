const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/#admin');
  await page.evaluate(() => {
    localStorage.setItem('rass_admin_session', JSON.stringify({ id: 'admin_1', email: 'admin@rassbyriddhima.com' }));
    window.location.reload();
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const mTab = btns.find(b => b.innerText && b.innerText.includes('Home Media'));
    if (mTab) mTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const filterButtons = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.map(b => ({ text: b.innerText?.trim(), title: b.title, class: b.className })).filter(b => b.text && b.text.length < 25);
  });
  console.log('Filter buttons:', filterButtons);
  await browser.close();
})();
