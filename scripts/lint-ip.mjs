import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const NAMES_PATH = path.join(SRC_DIR, 'assets', 'names.json');

const namesData = JSON.parse(fs.readFileSync(NAMES_PATH, 'utf8'));
const forbidden = namesData.forbiddenReferenceNames || [];
const forbiddenExtensions = ['.xnb', '.xwb', '.xsb'];

const violations = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (forbiddenExtensions.includes(ext)) {
      violations.push(`Forbidden binary asset format: ${path.relative(ROOT, full)}`);
      continue;
    }
    // Skip names.json itself (which defines forbiddenReferenceNames) and binary files
    if (full === NAMES_PATH) continue;
    if (['.png', '.jpg', '.webp', '.ogg', '.mp3', '.woff2', '.ico'].includes(ext)) {
      const lowerName = entry.name.toLowerCase();
      for (const word of forbidden) {
        if (lowerName.includes(word)) {
          violations.push(`Forbidden filename "${word}" in ${path.relative(ROOT, full)}`);
        }
      }
      continue;
    }
    const content = fs.readFileSync(full, 'utf8');
    // Allow negative regex checks in SPEC tests like not.toMatch(/.../i)
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('not.toMatch') || line.includes('not.toContain') || line.includes('forbidden')) return;
      const lower = line.toLowerCase();
      for (const word of forbidden) {
        const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (re.test(lower)) {
          violations.push(`Forbidden reference name "${word}" in ${path.relative(ROOT, full)}:${idx + 1}`);
        }
      }
    });
  }
}

walk(SRC_DIR);

if (violations.length > 0) {
  console.error('IP/Name lint failed:\n' + violations.map(v => '  - ' + v).join('\n'));
  process.exit(1);
}
console.log('IP/Name lint passed: 0 violations in src/.');
