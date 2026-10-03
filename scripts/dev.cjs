#!/usr/bin/env node

/**
 * SDK watch mode: `tsc --watch` into dist/, with src/version.ts kept current.
 *
 * Started by turbo alongside the web dev server (see `apps/web/turbo.json`), so
 * an SDK edit lands in dist/ — which the web app reads directly, never
 * pre-bundled — without a manual rebuild. Only the module build is watched; the
 * browser bundles (`build:browser`, `build:bot`) are for external consumers and
 * still come from `pnpm build`.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { writeVersionFile } = require('./generate-version-info.cjs');

const SRC_DIR = path.join(__dirname, '..', 'src');

writeVersionFile();

// Refresh the dev version when source changes; tsc picks the new version.ts up
// on its next pass. writeVersionFile is a no-op when nothing relevant changed,
// which also stops its own write from re-triggering this watcher forever.
let timer = null;
fs.watch(SRC_DIR, { recursive: true }, (_event, file) => {
  if (!file || file === 'version.ts') return;
  clearTimeout(timer);
  timer = setTimeout(writeVersionFile, 300);
});

const tsc = spawn('tsc', ['--watch', '--preserveWatchOutput'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
tsc.on('exit', (code) => process.exit(code ?? 0));
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => tsc.kill(signal));
}
