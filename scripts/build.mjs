/**
 * Build the deliverable artifacts.
 *
 *   lib/index.js   – Host half (ESM), loaded by the Cordis loader.
 *   client/client.js – Client half wrapped in the host's `window.__ModuleLoader__`
 *                      factory protocol. React and the DSH platform modules stay
 *                      external and are resolved from the host module table at
 *                      runtime, so no framework code is duplicated.
 *
 * Run: node scripts/build.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));

/** Platform modules the host already provides; never bundle them. */
const EXTERNAL = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  '@deepseek-ai/dsh-client-locale',
  '@deepseek-ai/dsh-client-ui-primitives',
];

await mkdir(resolve(root, 'lib'), { recursive: true });
await mkdir(resolve(root, 'client'), { recursive: true });

/** Host half: plain ESM, nothing external. */
await build({
  absWorkingDir: root,
  entryPoints: ['src/host/index.js'],
  outfile: 'lib/index.js',
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node22',
  logLevel: 'info',
});

/** Client half: one self-contained factory registered in the host's module loader. */
await build({
  absWorkingDir: root,
  entryPoints: ['src/client/index.jsx'],
  outfile: 'client/client.js',
  bundle: true,
  format: 'iife',
  globalName: '__dshStandReminderModule',
  platform: 'browser',
  target: 'chrome120',
  external: EXTERNAL,
  jsx: 'automatic',
  banner: {
    js: `window.__ModuleLoader__.load({ id: ${JSON.stringify(pkg.name)}, factory: (require) => {`,
  },
  footer: {
    js: 'return __dshStandReminderModule; } });',
  },
  logLevel: 'info',
});

console.log(`built ${pkg.name}@${pkg.version}`);
