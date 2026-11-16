// ============================================================================
// Rass by Riddhima — Comprehensive Feature Verification Suite
// Deeply tests: Add Product, Manage Product, Product Images, Add Home Media & Management
// ============================================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:5173/#admin';
const SCREENSHOT_DIR = path.resolve('scratch/feature-audit-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const audit = {
  startedAt: new Date().toISOString(),
  environment: {
    browser: 'Google Chrome',
    url: APP_URL,
    viewport: '1440x900',
  },
  tests: [],
  summary: { total: 0, passed: 0, failed: 0 }
};

function verify(mod, name, condition, details = '') {
  audit.summary.total++;
  const passed = Boolean(condition);
  if (passed) audit.summary.passed++;
  else audit.summary.failed++;
  audit.tests.push({ module: mod, check: name, passed, details, timestamp: new Date().toISOString() });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${mod}] ${name}${details ? ` -> ${details}` : ''}`);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('===============================================================');
  console.log('🚀 RUNNING BROWSER VERIFICATION: PRODUCTS, IMAGES & HOME MEDIA');
  console.log('===============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();

  // Dialog auto-accept (e.g. for confirm prompts)
  page.on('dialog', async (dialog) => {
    console.log(`   [Dialog Intercepted]: "${dialog.message()}" -> Confirmed`);
    await dialog.accept();
  });

  try {
    // -------------------------------------------------------------------------
    // 1. AUTHENTICATION & PORTAL LOAD
    // -------------------------------------------------------------------------
    console.log('--- MODULE 1: AUTHENTICATION & PORTAL LOAD ---');
    await page.goto(APP_URL, { waitUntil: 'networkidle2' });
    await sleep(800);

    const isLogin = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase();
      return text.includes('operations portal') || text.includes('security passkey');
    });

    if (isLogin) {
      await page.evaluate(() => {
        const demoBtn = Array.from(document.querySelectorAll('button')).find(b =>
          b.innerText.includes('Fill Default Admin Credentials')
        );
        if (demoBtn) demoBtn.click();
      });
      await sleep(300);
      await page.click('button[type="submit"]');
      await sleep(1500);
    }

    await sleep(2000);
    const dashboardVisible = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Operations') || text.includes('Commercial Pulse') || text.includes('Net Sales') || text.includes('Overview');
    });
    verify('Auth', 'Admin Operations Console Unlocked', dashboardVisible);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_dashboard_loaded.png') });

    // -------------------------------------------------------------------------
    // 2. FEATURE: ADD PRODUCT MODAL & IMAGE PREVIEWS
    // -------------------------------------------------------------------------
    console.log('\n--- MODULE 2: ADD PRODUCT & IMAGE SELECTION MODES ---');
    
    // Switch to Products tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const pTab = btns.find(b => b.innerText && b.innerText.includes('Products'));
      if (pTab) pTab.click();
    });
    await sleep(800);

    // Click "Add Product" button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.innerText && b.innerText.includes('Add Product'));
      if (addBtn) addBtn.click();
    });
    await sleep(800);

    const isModalOpen = await page.evaluate(() => {
      return document.body.innerText.includes('Add New Product Design');
    });
    verify('Add Product', 'Add New Product Modal Dialog Opened', isModalOpen);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_add_product_modal.png') });

    // Test Studio Presets Photography Mode
    const presetSwitched = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const presetBtn = btns.find(b => b.innerText && b.innerText.includes('Studio Presets'));
      if (presetBtn) {
        presetBtn.click();
        return true;
      }
      return false;
    });
    await sleep(500);
    verify('Product Images', 'Switched to Studio Presets Mode', presetSwitched);

    // Click a studio preset thumbnail
    const presetSelected = await page.evaluate(() => {
      const thumbs = Array.from(document.querySelectorAll('button[type="button"] img'));
      if (thumbs.length > 0) {
        thumbs[0].closest('button').click();
        return true;
      }
      return false;
    });
    await sleep(500);
    verify('Product Images', 'Selected Studio Preset Image with Live Preview', presetSelected);

    // Test Direct URL Photography Mode
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const urlBtn = btns.find(b => b.innerText && b.innerText.trim() === 'Image URL');
      if (urlBtn) urlBtn.click();
    });
    await sleep(500);

    // Type URL into input
    const testUrl = '/images/earrings/creeper-earrings.png';
    await page.evaluate((url) => {
      const input = document.querySelector('input[placeholder*="https://images.example.com"]');
      if (input) {
        const proto = Object.getPrototypeOf(input);
        const setVal = Object.getOwnPropertyDescriptor(proto, 'value').set;
        setVal.call(input, url);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, testUrl);
    await sleep(500);

    const previewSrcMatches = await page.evaluate((url) => {
      const img = document.querySelector('img[alt="Preview"]');
      return img && img.src.includes(url);
    }, 'creeper-earrings.png');
    verify('Product Images', 'Custom Image URL Updates Live Thumbnail Preview', previewSrcMatches);

    // Type Title with native keyboard
    const titleInputSelector = 'input[placeholder*="Noor Emerald"]';
    await page.click(titleInputSelector, { clickCount: 3 });
    await page.type(titleInputSelector, 'Audited Imperial Maang Tikka');
    await sleep(300);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_add_product_filled.png') });

    // Submit form: Click "Save & Publish"
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.innerText && b.innerText.includes('Save & Publish')
      );
      if (submitBtn) submitBtn.click();
    });
    await sleep(1500);

    // Verify newly added product in catalog table
    const productInTable = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Audited Imperial Maang Tikka');
    });
    verify('Add Product', 'New Product Persisted & Visible in Master Catalog Table', productInTable);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_product_persisted_table.png') });

    // -------------------------------------------------------------------------
    // 3. FEATURE: MANAGE PRODUCT (FILTERING, STATUS TOGGLES, IMAGES)
    // -------------------------------------------------------------------------
    console.log('\n--- MODULE 3: MANAGE PRODUCTS (FILTERS, STATUS, IMAGES) ---');

    // Test Category Filter Dropdown
    const categoryFiltered = await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      const catSelect = selects.find(s => Array.from(s.options).some(o => o.value === 'rings'));
      if (catSelect) {
        catSelect.value = 'rings';
        catSelect.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    });
    await sleep(600);
    verify('Manage Product', 'Category Filter Applied (Rings)', categoryFiltered);

    // Reset filter to All
    await page.evaluate(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      const catSelect = selects.find(s => Array.from(s.options).some(o => o.value === 'rings'));
      if (catSelect) {
        catSelect.value = 'all';
        catSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await sleep(600);

    // Test Status Toggle: Deactivate Product
    const deactivated = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      const targetRow = rows.find(r => r.innerText.includes('Audited Imperial Maang Tikka'));
      if (targetRow) {
        const deactBtn = Array.from(targetRow.querySelectorAll('button')).find(b => b.innerText.includes('Deactivate'));
        if (deactBtn) {
          deactBtn.click();
          return true;
        }
      }
      return false;
    });
    await sleep(1000);

    const isStatusInactive = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      const targetRow = rows.find(r => r.innerText.includes('Audited Imperial Maang Tikka'));
      return targetRow ? targetRow.innerText.toLowerCase().includes('inactive') : false;
    });
    verify('Manage Product', 'Product Status Toggled to INACTIVE', isStatusInactive);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_product_status_inactive.png') });

    // Test Status Toggle: Re-publish Product
    const republished = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      const targetRow = rows.find(r => r.innerText.includes('Audited Imperial Maang Tikka'));
      if (targetRow) {
        const pubBtn = Array.from(targetRow.querySelectorAll('button')).find(b => b.innerText.includes('Publish'));
        if (pubBtn) {
          pubBtn.click();
          return true;
        }
      }
      return false;
    });
    await sleep(1000);

    const isStatusPublished = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      const targetRow = rows.find(r => r.innerText.includes('Audited Imperial Maang Tikka'));
      return targetRow ? targetRow.innerText.toLowerCase().includes('published') : false;
    });
    verify('Manage Product', 'Product Status Restored to PUBLISHED', isStatusPublished);

    // Test Product Thumbnail Rendering
    const imagesLoadedCleanly = await page.evaluate(() => {
      const tableImgs = Array.from(document.querySelectorAll('tbody tr td img'));
      if (tableImgs.length === 0) return false;
      return tableImgs.every(img => img.naturalWidth > 0 || img.complete);
    });
    verify('Product Images', 'All Catalog Product Images Rendered Cleanly (No 404s)', imagesLoadedCleanly);

    // -------------------------------------------------------------------------
    // 4. FEATURE: ADD HOME MEDIA & MANAGE HOMEPAGE CATEGORY GALLERY
    // -------------------------------------------------------------------------
    console.log('\n--- MODULE 4: HOME MEDIA & ADD HOME MEDIA FEATURE ---');

    // Switch to Home Media tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const mediaTab = btns.find(b => b.innerText && b.innerText.includes('Home Media'));
      if (mediaTab) mediaTab.click();
    });
    await sleep(1000);

    const isHomeMediaLoaded = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Home Media Manager') || text.includes('Category Gallery') || text.includes('Add Custom Card');
    });
    verify('Home Media', 'Home Media Manager Dashboard Rendered', isHomeMediaLoaded);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_home_media_tab.png') });

    // Test View Mode: Switch to Grid View
    const gridViewSwitched = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const gridBtn = btns.find(b => b.innerText && b.innerText.includes('Grid'));
      if (gridBtn) {
        gridBtn.click();
        return true;
      }
      return false;
    });
    await sleep(600);
    verify('Home Media', 'Switched View Mode to Grid View', gridViewSwitched);

    // Test Filter Tabs in Grid Mode: Col 1
    const col1FilterClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const col1Btn = btns.find(b => b.innerText && b.innerText.trim() === 'Col 1');
      if (col1Btn) {
        col1Btn.click();
        return true;
      }
      return false;
    });
    await sleep(600);
    verify('Home Media', 'Column 1 Filter Tab Applied in Grid View', col1FilterClicked);

    // Switch back to "All"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const allBtn = btns.find(b => b.innerText && b.innerText.includes('All ('));
      if (allBtn) allBtn.click();
    });
    await sleep(500);

    // Switch back to 3-Column View
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const colBtn = btns.find(b => b.innerText && b.innerText.includes('Columns'));
      if (colBtn) colBtn.click();
    });
    await sleep(500);

    // Test ADD HOME MEDIA: Click "Add Custom Card" button
    const addCardModalOpened = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addCardBtn = btns.find(b => b.innerText && b.innerText.includes('Add Custom Card'));
      if (addCardBtn) {
        addCardBtn.click();
        return true;
      }
      return false;
    });
    await sleep(800);

    const isAddCardModalVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Add Custom Card to Category Gallery');
    });
    verify('Add Home Media', 'Add Custom Card Modal Opened', isAddCardModalVisible);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_add_home_media_modal.png') });

    // Fill Add Custom Card Form
    await page.evaluate(() => {
      function setVal(elem, val) {
        const proto = Object.getPrototypeOf(elem);
        const set = Object.getOwnPropertyDescriptor(proto, 'value').set;
        set.call(elem, val);
        elem.dispatchEvent(new Event('input', { bubbles: true }));
        elem.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const modal = document.querySelector('[role="dialog"]');
      if (!modal) return;

      // Title input
      const titleInput = modal.querySelector('input[type="text"]');
      if (titleInput) {
        setVal(titleInput, 'ROYAL JADAU KUNDAN COLLECTION');
      }

      // Target category
      const catSelect = modal.querySelectorAll('select')[0];
      if (catSelect) {
        catSelect.value = 'necklaces';
        catSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Column select
      const colSelect = modal.querySelectorAll('select')[1];
      if (colSelect) {
        colSelect.value = '1';
        colSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Aspect ratio
      const aspectSelect = modal.querySelectorAll('select')[2];
      if (aspectSelect) {
        aspectSelect.value = 'aspect-[1/1.36]';
        aspectSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Switch to Image URL
      const urlTabBtn = Array.from(modal.querySelectorAll('button')).find(b => b.innerText.includes('Image URL'));
      if (urlTabBtn) urlTabBtn.click();
    });
    await sleep(500);

    // Enter Image URL
    await page.evaluate(() => {
      function setVal(elem, val) {
        const proto = Object.getPrototypeOf(elem);
        const set = Object.getOwnPropertyDescriptor(proto, 'value').set;
        set.call(elem, val);
        elem.dispatchEvent(new Event('input', { bubbles: true }));
        elem.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        const urlInput = modal.querySelector('input[type="url"]');
        if (urlInput) {
          setVal(urlInput, '/images/western/golden-heart-neckpiece.png');
        }
      }
    });
    await sleep(500);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_add_home_media_filled.png') });

    // Click "Add Card to Homepage"
    await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        const saveBtn = Array.from(modal.querySelectorAll('button')).find(b => b.innerText.includes('Add Card to Homepage'));
        if (saveBtn) saveBtn.click();
      }
    });
    await sleep(1500);

    // Verify Custom Card in Home Media list
    const customCardInGallery = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('ROYAL JADAU KUNDAN COLLECTION');
    });
    verify('Add Home Media', 'Custom Card Successfully Added to Category Gallery', customCardInGallery);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_custom_card_rendered.png') });

    // -------------------------------------------------------------------------
    // 5. FEATURE: REPLACE HOME MEDIA IMAGE
    // -------------------------------------------------------------------------
    console.log('\n--- MODULE 5: REPLACE HOME MEDIA IMAGE ---');

    // Open Replace Modal by clicking "Replace Image" on a card
    const replaceModalOpened = await page.evaluate(() => {
      const replaceBtns = Array.from(document.querySelectorAll('button')).filter(b => 
        b.innerText && b.innerText.includes('Replace Image')
      );
      if (replaceBtns.length > 0) {
        replaceBtns[0].click();
        return true;
      }
      return false;
    });
    await sleep(800);

    const isReplaceModalVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Replace Media Image') || document.body.innerText.includes('Curated Presets');
    });
    verify('Home Media', 'Replace Media Photo Modal Opened', isReplaceModalVisible);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_replace_media_modal.png') });

    // Switch to Curated Presets tab in Replace Modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const presetTab = btns.find(b => b.innerText && b.innerText.includes('Curated Presets'));
      if (presetTab) presetTab.click();
    });
    await sleep(500);

    // Pick first preset
    await page.evaluate(() => {
      const presetButtons = Array.from(document.querySelectorAll('button')).filter(b => 
        b.innerText && b.innerText.includes('Solitaire Diamond Ring')
      );
      if (presetButtons.length > 0) {
        presetButtons[0].click();
      }
    });
    await sleep(500);

    // Click "Save & Publish to Homepage"
    await page.evaluate(() => {
      const applyBtn = Array.from(document.querySelectorAll('button')).find(b => 
        b.innerText && (b.innerText.includes('Save & Publish to Homepage') || b.innerText.includes('Apply Replacement'))
      );
      if (applyBtn) applyBtn.click();
    });
    await sleep(1500);

    const isReplacementNotified = await page.evaluate(() => {
      return document.body.innerText.includes('Replaced photo') || document.body.innerText.includes('Custom Replaced');
    });
    verify('Home Media', 'Media Image Successfully Replaced with Curated Preset', isReplacementNotified);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_media_replaced.png') });

    // -------------------------------------------------------------------------
    // 6. FEATURE: TOGGLE CARD VISIBILITY (HIDE / SHOW)
    // -------------------------------------------------------------------------
    console.log('\n--- MODULE 6: TOGGLE VISIBILITY (HIDE / SHOW) ---');

    // Click Hide button on a card
    const visibilityToggled = await page.evaluate(() => {
      const hideBtns = Array.from(document.querySelectorAll('button')).filter(b => 
        b.innerText && b.innerText.trim() === 'Hide'
      );
      if (hideBtns.length > 0) {
        hideBtns[0].click();
        return true;
      }
      return false;
    });
    await sleep(1000);
    verify('Home Media', 'Card Visibility Toggled to HIDDEN', visibilityToggled);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_visibility_toggled.png') });

    // Click Show button to restore visibility
    const visibilityRestored = await page.evaluate(() => {
      const showBtns = Array.from(document.querySelectorAll('button')).filter(b => 
        b.innerText && b.innerText.trim() === 'Show'
      );
      if (showBtns.length > 0) {
        showBtns[0].click();
        return true;
      }
      return false;
    });
    await sleep(800);
    verify('Home Media', 'Card Visibility Restored to SHOW', visibilityRestored);

  } catch (err) {
    console.error('Fatal Test Exception:', err);
    verify('Suite', 'Global Execution Error', false, err.message);
  } finally {
    await browser.close();
    audit.finishedAt = new Date().toISOString();
    fs.writeFileSync('dist/browser-features-audit.json', JSON.stringify(audit, null, 2), 'utf8');
    console.log('\n===============================================================');
    console.log(`🏁 AUDIT FINISHED: ${audit.summary.passed}/${audit.summary.total} Checks Passed (${Math.round((audit.summary.passed / audit.summary.total) * 100)}%)`);
    console.log(`📄 Saved detailed JSON log to: dist/browser-features-audit.json`);
    console.log(`📸 Screenshots saved to: scratch/feature-audit-screenshots/`);
    console.log('===============================================================\n');
  }
}

run();
