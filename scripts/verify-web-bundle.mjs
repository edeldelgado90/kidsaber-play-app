#!/usr/bin/env node
/**
 * Post-export assertion for the static web bundle.
 *
 * Metro's transform cache is not keyed on EXPO_PUBLIC_* values, so an export
 * can succeed while inlining a stale API URL from an earlier build. The failure
 * is silent at build time and fatal at runtime: src/infrastructure/config/env.ts
 * throws on a non-https URL, and __DEV__ folds to false in a production bundle,
 * so the page renders blank.
 *
 * Fails the build unless the bundle contains the expected URL and nothing that
 * looks like a loopback or private-network address.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const expected = process.env.EXPO_PUBLIC_API_URL;

if (!expected) {
  console.error('EXPO_PUBLIC_API_URL is not set; nothing to verify against.');
  process.exit(1);
}
if (!expected.startsWith('https://')) {
  console.error('EXPO_PUBLIC_API_URL must use https:// — env.ts throws otherwise.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const scripts = walk(DIST).filter(f => f.endsWith('.js'));
if (scripts.length === 0) {
  console.error(`No .js bundle found under ${DIST}/. Did the export run?`);
  process.exit(1);
}

// Trailing slashes are stripped by buildUrl in src/data/api/questionsApi.ts, so
// compare against the normalised form the bundle is expected to carry.
const normalised = expected.replace(/\/$/, '');

// Private-network ranges only. localhost and 127.0.0.1 are deliberately absent:
// the Firebase Auth SDK embeds "http://localhost" as a requestUri in several
// code paths, so matching those produces a false positive on every build.
const forbidden = [
  /http:\/\/10\.\d+\.\d+\.\d+/,
  /http:\/\/192\.168\.\d+\.\d+/,
  /http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+/,
];

let found = false;
const offenders = [];

for (const file of scripts) {
  const source = readFileSync(file, 'utf8');
  if (source.includes(normalised)) found = true;
  for (const pattern of forbidden) {
    const hit = source.match(pattern);
    if (hit) offenders.push(`${file}: ${hit[0]}`);
  }
}

if (offenders.length > 0) {
  console.error('Bundle contains a local address. The build used a stale cache:');
  offenders.forEach(o => console.error(`  ${o}`));
  console.error('Re-run the export with --clear.');
  process.exit(1);
}

if (!found) {
  // The URL itself is a secret in CI, so report the failure without echoing it.
  console.error(
    'Bundle does not contain the expected EXPO_PUBLIC_API_URL. ' +
      'The export likely reused a cached transform; re-run with --clear.',
  );
  process.exit(1);
}

console.log(
  `Bundle verified: expected API URL inlined, no local addresses (${scripts.length} script(s)).`,
);
