// Fails the build if the output in dist/ would publish private data:
// a phone number, an email address, or a copy of any file from context/.
//
// Generic patterns run everywhere (including CI, where context/ is absent).
// Exact checks against the CV's own phone number and email, and file-hash
// checks against context/, run whenever context/ exists locally. The private
// values are read from context/ at run time so they never enter the repo.

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(root, 'dist');
const contextDir = join(root, 'context');

const TEXT_EXTENSIONS = new Set(['.html', '.xml', '.txt', '.js', '.mjs', '.css', '.json', '.svg', '.webmanifest', '.md']);

const UK_MOBILE = /(?:\+44\s?\(?0?\)?\s?7\d{3}|\b07\d{3})[\s.-]?\d{3}[\s.-]?\d{3}\b/g;
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)*\.[A-Z]{2,}/gi;
const ALLOWED_EMAILS = new Set();

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

/** Turns "+44 7700 900123" into a regex that matches it with any separators and a 0 or +44 prefix. */
function phonePattern(raw) {
  const digits = raw.replace(/\D/g, '').replace(/^44/, '').replace(/^0/, '');
  const body = digits.split('').join('[\\s().-]*');
  return new RegExp(`(?:\\+?44[\\s().-]*(?:0[\\s().-]*)?|0)?${body}`, 'g');
}

async function loadPrivateValues() {
  if (!existsSync(contextDir)) return { patterns: [], hashes: new Map() };

  const patterns = [];
  const cvPath = join(contextDir, 'CV.md');
  if (existsSync(cvPath)) {
    const cv = await readFile(cvPath, 'utf8');
    for (const match of cv.matchAll(/\+44[\d\s]{9,14}\d/g)) {
      patterns.push({ label: 'CV phone number', regex: phonePattern(match[0]) });
    }
    for (const match of cv.matchAll(EMAIL)) {
      const escaped = match[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      patterns.push({ label: 'CV email address', regex: new RegExp(escaped, 'gi') });
    }
  }

  const hashes = new Map();
  for (const file of await walk(contextDir)) {
    if (file.endsWith('.DS_Store')) continue;
    hashes.set(sha256(await readFile(file)), relative(root, file));
  }
  return { patterns, hashes };
}

async function main() {
  if (!existsSync(distDir)) {
    console.error('check-dist: dist/ not found. Run the build first.');
    process.exit(1);
  }

  const { patterns, hashes } = await loadPrivateValues();
  const problems = [];

  for (const file of await walk(distDir)) {
    const rel = relative(root, file);
    const buffer = await readFile(file);

    const copied = hashes.get(sha256(buffer));
    if (copied) problems.push(`${rel}: identical copy of ${copied}`);

    if (!TEXT_EXTENSIONS.has(extname(file).toLowerCase())) continue;
    const text = buffer.toString('utf8');

    for (const match of text.matchAll(UK_MOBILE)) {
      problems.push(`${rel}: UK mobile number "${match[0]}"`);
    }
    for (const match of text.matchAll(EMAIL)) {
      if (!ALLOWED_EMAILS.has(match[0].toLowerCase())) {
        problems.push(`${rel}: email address "${match[0]}"`);
      }
    }
    for (const { label, regex } of patterns) {
      if (regex.test(text)) problems.push(`${rel}: contains the ${label}`);
      regex.lastIndex = 0;
    }
  }

  if (problems.length > 0) {
    console.error(`check-dist: ${problems.length} privacy problem(s) found in dist/:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  const scope = hashes.size > 0 ? 'generic + context/ checks' : 'generic checks only (context/ not present)';
  console.log(`check-dist: no private data found in dist/ (${scope}).`);
}

await main();
