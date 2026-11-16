const fs = require('fs');
const path = require('path');

const MAX_IMAGE_SIZE_KB = 450;
const PUBLIC_DIRS = [
  path.join(__dirname, '..', 'public', 'images'),
  path.join(__dirname, '..', 'public', 'elements')
];

console.log('===============================================================');
console.log('🛡️ RASS PERFORMANCE & ASSET BUDGET GUARD');
console.log('===============================================================');

let violationCount = 0;
let checkedCount = 0;

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.webp', '.svg', '.png', '.jpg', '.jpeg'].includes(ext)) {
        checkedCount++;
        const stat = fs.statSync(fullPath);
        const sizeKb = stat.size / 1024;

        // Check WebP images specifically for strict budget
        if (ext === '.webp' && sizeKb > MAX_IMAGE_SIZE_KB) {
          console.error(`❌ BUDGET VIOLATION: WebP image exceeds ${MAX_IMAGE_SIZE_KB} KB -> ${entry.name} (${sizeKb.toFixed(1)} KB)`);
          violationCount++;
        }
      }
    }
  }
}

for (const dir of PUBLIC_DIRS) {
  scanDir(dir);
}

console.log(`\n>> Scanned ${checkedCount} public assets against ${MAX_IMAGE_SIZE_KB} KB budget.`);

if (violationCount > 0) {
  console.error(`\n❌ FAILED: ${violationCount} asset(s) exceed the performance budget.`);
  process.exit(1);
} else {
  console.log('✅ PASSED: All WebP assets are strictly within the ultra-fast performance budget!\n');
}
