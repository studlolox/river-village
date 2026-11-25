import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(import.meta.dirname, '..', 'dist');
const MAX_BYTES = 30 * 1024 * 1024; // 30 MB

function dirSize(dir) {
  if (!fs.existsSync(dir)) return 0;
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    total += entry.isDirectory() ? dirSize(p) : fs.statSync(p).size;
  }
  return total;
}

const bytes = dirSize(distDir);
const mb = (bytes / (1024 * 1024)).toFixed(2);
if (bytes > MAX_BYTES) {
  console.error(`Precache budget FAILED: ${mb} MB exceeds 30 MB limit.`);
  process.exit(1);
}
console.log(`Precache budget PASSED: ${mb} MB / 30.00 MB`);
