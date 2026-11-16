const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  console.log('🚀 Running Comprehensive Test for Professional Admin Upgrades...');
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

  // Authenticate session
  await page.evaluate(() => {
    localStorage.setItem('rass_admin_session', JSON.stringify({
      id: 'admin_master_1',
      email: 'admin@rassbyriddhima.com',
      role: 'superadmin',
      name: 'Riddhima Singhania (Head of Design)',
      authProvider: 'master_fallback',
      lastLogin: new Date().toISOString()
    }));
    window.location.hash = '#admin';
    window.location.reload();
  });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Check for Emojis on page
  const pageText = await page.evaluate(() => document.body ? document.body.innerText : '');
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const foundEmojis = pageText.match(emojiRegex);
  console.log('Emoji presence check on page:', foundEmojis ? `Found: ${foundEmojis[0]}` : 'CLEAN (0 Emojis found)');

  // 2. Test Manual Order Creation
  console.log('\nTesting "Create Order" modal flow...');
  const clickedCreateOrder = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Create Order'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Create Order button clicked:', clickedCreateOrder);
  await new Promise(r => setTimeout(r, 800));

  const manualOrderModalVisible = await page.evaluate(() => {
    const m = document.querySelector('.fixed.inset-0');
    return m ? m.innerText.includes('Create Client Order') : false;
  });
  console.log('Manual Order Modal visible:', manualOrderModalVisible);

  if (manualOrderModalVisible) {
    // Fill client form
    await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      const inputs = Array.from(modal.querySelectorAll('input'));
      if (inputs[0]) {
        inputs[0].value = 'Kavita Singhal';
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (inputs[1]) {
        inputs[1].value = '+91 98111 22334';
        inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (inputs[2]) {
        inputs[2].value = '18 Civil Lines';
        inputs[2].dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (inputs[3]) {
        inputs[3].value = 'Jaipur';
        inputs[3].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    console.log('Filled client form details. Submitting order...');
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('.fixed.inset-0 button')).find(b => b.innerText.includes('Confirm Order'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // Check if Tax Invoice opened automatically
    const invoiceOpened = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0');
      return modal ? modal.innerText.includes('Invoice') || modal.innerText.includes('INV-2026-') : false;
    });
    console.log('Order created and Tax Invoice opened automatically:', invoiceOpened);

    // Close invoice modal if open
    await page.evaluate(() => {
      const closeBtn = document.querySelector('.fixed.inset-0 button');
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
  }

  // 3. Test Coupon Creation Modal with Presets
  console.log('\nTesting "Coupons" tab and Preset Creation...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('aside nav button'));
    const couponTab = btns.find(b => b.innerText.includes('Coupons'));
    if (couponTab) couponTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const clickedNewCoupon = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.innerText.includes('Create Coupon') || b.innerText.includes('New'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Create Coupon button clicked:', clickedNewCoupon);
  await new Promise(r => setTimeout(r, 600));

  const couponModalInfo = await page.evaluate(() => {
    const m = document.querySelector('.fixed.inset-0');
    if (!m) return null;
    return {
      title: m.querySelector('h3')?.innerText,
      hasPresets: m.innerText.includes('Quick Presets') && m.innerText.includes('Festive 20%'),
      hasRuleSummary: m.innerText.includes('Rule Summary'),
    };
  });
  console.log('Coupon Modal Info:', couponModalInfo);

  // Click Festive 20% preset
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.fixed.inset-0 button'));
    const festiveBtn = btns.find(b => b.innerText.includes('Festive 20%'));
    if (festiveBtn) festiveBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  const updatedCode = await page.evaluate(() => {
    const input = document.querySelector('.fixed.inset-0 input');
    return input ? input.value : null;
  });
  console.log('Preset auto-filled coupon code:', updatedCode);

  // Screenshot of the enhanced admin experience
  const screenshotPath = path.resolve('dist/admin-professional-screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Screenshot saved to: ${screenshotPath}`);

  if (errors.length > 0) {
    console.warn('\n⚠️ Page Errors:', errors);
  } else {
    console.log('\n✅ 0 Console Errors encountered during full test flow!');
  }

  await browser.close();
  console.log('\n🎉 Professional Admin Upgrade Verification 100% Complete!');
})();
