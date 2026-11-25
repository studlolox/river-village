import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(rootDir, 'src');
const namesPath = path.join(srcDir, 'assets', 'names.json');

const namesRegistry = JSON.parse(fs.readFileSync(namesPath, 'utf8'));
const forbidden = (namesRegistry.forbiddenReferenceNames || []).map((n) => n.toLowerCase());

const forbiddenExtensions = ['.xnb', '.xwb', '.xsb'];
const textExtensions = new Set(['.js', '.mjs', '.json', '.html', '.css', '.md', '.webmanifest']);

const violations = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    const relPath = path.relative(rootDir, fullPath);
    const ext = path.extname(entry.name).toLowerCase();

    if (forbiddenExtensions.includes(ext)) {
      violations.push(`Forbidden reference binary format: ${relPath}`);
    }

    const lowerName = entry.name.toLowerCase();
    for (const term of forbidden) {
      if (lowerName.includes(term)) {
        violations.push(`Forbidden term "${term}" in filename: ${relPath}`);
      }
    }

    if (textExtensions.has(ext) && relPath !== 'src/assets/names.json') {
      const content = fs.readFileSync(fullPath, 'utf8').toLowerCase();
      for (const term of forbidden) {
        const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(content)) {
          violations.push(`Forbidden reference name "${term}" in ${relPath}`);
        }
      }
    }
  }
}

walk(srcDir);

if (violations.length > 0) {
  console.error('IP / Naming check FAILED:');
  for (const v of violations) console.error(' -', v);
  process.exit(1);
}

console.log(`IP / Naming check PASSED (${Object.keys(namesRegistry.entities || {}).length} entity groups registered).`);
