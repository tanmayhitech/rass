const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
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
    const pTab = btns.find(b => b.innerText && b.innerText.includes('Products'));
    if (pTab) pTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const addBtn = btns.find(b => b.innerText && b.innerText.includes('Add Product'));
    if (addBtn) addBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const inputs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('form input, form select, form textarea')).map(i => ({
      tag: i.tagName,
      type: i.type,
      value: i.value,
      required: i.required,
      placeholder: i.placeholder
    }));
  });
  console.log('INPUTS LIST:', JSON.stringify(inputs, null, 2));

  // Now type title
  await page.type('input[placeholder*="Noor Emerald"]', 'Test Maang Tikka Luxury Piece');
  await new Promise(r => setTimeout(r, 300));

  // Click submit
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Save & Publish'));
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const text = await page.evaluate(() => document.body.innerText);
  console.log('Does table contain new product?:', text.includes('Test Maang Tikka Luxury Piece'));
  await browser.close();
})();
