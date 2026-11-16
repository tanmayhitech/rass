const fs = require('fs');
const path = require('path');

const envFile = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';
const lines = envFile.split('\n');

const distAssets = path.resolve('dist/assets');
if (!fs.existsSync(distAssets)) {
  console.log('dist/assets does not exist. Run npm run build first.');
  process.exit(1);
}

const distFiles = fs.readdirSync(distAssets).filter(f => f.endsWith('.js'));
const distContent = distFiles.map(f => fs.readFileSync(path.join(distAssets, f), 'utf8')).join('\n');

console.log('Scanning dist bundles for .env variables:');
let leakedCount = 0;

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const parts = trimmed.split('=');
  const key = parts[0].trim();
  const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  if (!val || val.length < 5) continue;
  
  const inDist = distContent.includes(val);
  const isVite = key.startsWith('VITE_') || key.startsWith('NEXT_PUBLIC_');
  const isSecret = key.includes('SECRET') || key.includes('SERVICE_ROLE') || key.includes('KEY_SECRET') || (key.includes('RESEND') && key.includes('KEY'));

  let status = 'SAFE (Not in bundle)';
  if (inDist) {
    if (isSecret) {
      status = 'CRITICAL LEAK (Secret found in client bundle!)';
      leakedCount++;
    } else {
      status = 'EXPOSED BY DESIGN (Public client variable)';
    }
  }

  console.log(`- ${key}: ${status} [in bundle: ${inDist}, public prefix: ${isVite}]`);
}

console.log(`Total critical leaks detected: ${leakedCount}`);
