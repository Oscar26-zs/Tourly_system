const fs = require('fs');
const path = require('path');

function readFiles(dir) {
  const res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) res.push(...readFiles(p));
    else if (e.isFile() && /\.(ts|tsx|js|jsx)$/.test(e.name)) res.push(p);
  }
  return res;
}

const projectRoot = path.resolve(__dirname, '..');
const guideDir = path.join(projectRoot, 'src', 'features', 'guide');
const files = readFiles(guideDir);
const keyRegex = /t\(\s*['"`]([a-zA-Z0-9_.\-]+)['"`]\s*(?:,|\))/g;
const keys = new Set();
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = keyRegex.exec(content)) !== null) {
    const k = m[1];
    if (k.startsWith('guide.')) keys.add(k);
  }
}

const en = JSON.parse(fs.readFileSync(path.join(projectRoot, 'src', 'Locales', 'en.json'), 'utf8'));
function hasKey(obj, key) {
  const parts = key.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
    else return false;
  }
  return true;
}

const missing = [];
for (const k of Array.from(keys).sort()) {
  if (!hasKey(en, k)) missing.push(k);
}

console.log('Guide keys used in code:', keys.size);
console.log('Missing keys in en.json:', missing.length);
if (missing.length) console.log(missing.join('\n'));
else console.log('None');
