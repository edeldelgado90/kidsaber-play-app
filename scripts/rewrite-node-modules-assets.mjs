#!/usr/bin/env node
/**
 * Renames every `node_modules` directory under `dist/assets/` and rewrites the
 * references Metro emitted for the files inside them.
 *
 * Wrangler refuses to upload any file whose path contains a `node_modules`
 * segment (cloudflare/workers-sdk#3615). Metro puts the assets of packaged
 * dependencies exactly there — including the Nunito fonts, which the root
 * layout waits for before rendering anything. Deployed as-is those requests
 * 503 and the app is a permanently blank page.
 *
 * Directories nest (`assets/node_modules/expo-router/node_modules/...`), so
 * this renames the shallowest match, rewrites that exact path prefix, and
 * repeats until none are left. Renaming is safe because nothing derives these
 * paths at runtime — they are string literals in the bundle.
 *
 * Editing the bundle invalidates the content hash Metro baked into its
 * filename, so the last step re-hashes every rewritten bundle and renames it.
 * `public/_headers` serves `/_expo/*` as `immutable, max-age=31536000`: without
 * a new name, returning visitors keep a year-old cached bundle that still
 * points at the old asset paths — a blank page no redeploy can fix.
 */

import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, join, posix } from 'node:path';

const DIST = 'dist';
const ASSETS = join(DIST, 'assets');
const TARGET = 'node_modules';
const REPLACEMENT = 'vendor';

// Extensions that can carry an asset URL. Fonts and images never reference others.
const REWRITABLE = new Set(['.js', '.html', '.json', '.css', '.map']);

async function* walkDirs(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    yield path;
    yield* walkDirs(path);
  }
}

async function* walkFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkFiles(path);
    else yield path;
  }
}

/** Shallowest directory named `node_modules`, or null when none remain. */
async function findShallowest() {
  let found = null;
  for await (const dir of walkDirs(ASSETS)) {
    if (posix.basename(dir) !== TARGET) continue;
    if (found === null || dir.split('/').length < found.split('/').length) found = dir;
  }
  return found;
}

/** Replaces `from` with `to` across every rewritable file, returning the count. */
async function rewriteReferences(from, to) {
  let count = 0;
  for await (const file of walkFiles(DIST)) {
    if (!REWRITABLE.has(file.slice(file.lastIndexOf('.')))) continue;
    const source = await readFile(file, 'utf8');
    if (!source.includes(from)) continue;
    await writeFile(file, source.split(from).join(to));
    count++;
  }
  return count;
}

async function main() {
  if (!existsSync(ASSETS)) {
    console.log(`[assets] ${ASSETS} not present, skipping`);
    return;
  }

  let renamed = 0;
  for (let dir = await findShallowest(); dir !== null; dir = await findShallowest()) {
    const target = join(posix.dirname(dir), REPLACEMENT);
    if (existsSync(target)) {
      console.error(`[assets] cannot rename ${dir}: ${target} already exists`);
      process.exit(1);
    }

    await rename(dir, target);
    // Strip the leading "dist" so the literal matches the URL in the bundle.
    const files = await rewriteReferences(
      `${dir.slice(DIST.length)}/`,
      `${target.slice(DIST.length)}/`,
    );
    console.log(`[assets] ${dir} -> ${target} (${files} file(s) rewritten)`);
    renamed++;
  }

  // A survivor would 503 in production exactly as before, so fail loudly
  // rather than shipping another blank page.
  const stale = [];
  for await (const file of walkFiles(DIST)) {
    if (file.includes(`/${TARGET}/`)) stale.push(file);
  }
  if (stale.length > 0) {
    console.error(`[assets] paths still contain ${TARGET}:\n  ${stale.join('\n  ')}`);
    process.exit(1);
  }

  const rehashed = await rehashBundles();

  console.log(
    `[assets] done — ${renamed} director${renamed === 1 ? 'y' : 'ies'} renamed, ` +
      `${rehashed} bundle(s) re-hashed`,
  );
}

/**
 * Renames every `name-<md5>.js` bundle whose content no longer matches its
 * hash, and updates the references to it.
 *
 * Metro computes the hash before this script edits the file, so a rewritten
 * bundle keeps a name that describes its previous content. Under an immutable
 * cache policy that name is a promise the file no longer keeps.
 */
async function rehashBundles() {
  const HASHED = /^(.*)-([0-9a-f]{32})\.js$/;
  let count = 0;

  for await (const file of walkFiles(DIST)) {
    const match = HASHED.exec(basename(file));
    if (match === null) continue;

    const contents = await readFile(file);
    const hash = createHash('md5').update(contents).digest('hex');
    if (hash === match[2]) continue;

    const from = basename(file);
    const to = `${match[1]}-${hash}.js`;
    await rename(file, join(posix.dirname(file), to));
    await rewriteReferences(from, to);
    console.log(`[assets] ${from} -> ${to}`);
    count++;
  }

  return count;
}

await main();
