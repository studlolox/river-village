import fs from 'node:fs';
import path from 'node:path';

const DIST = path.join(process.cwd(), 'dist');
const MAX_BYTES = 30 * 1024 * 1024; // 30 MB precache budget

function dirSize(dir) {
  let total = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += dirSize(full);
    else total += fs.statSync(full).size;
  }
  return total;
}

const bytes = dirSize(DIST);
const mb = (bytes / (1024 * 1024)).toFixed(2);
console.log(`Dist precache size: ${mb} MB (budget: 30.00 MB)`);
if (bytes > MAX_BYTES) {
  console.error(`ERROR: dist size ${mb} MB exceeds 30 MB budget.`);
  process.exit(1);
}
