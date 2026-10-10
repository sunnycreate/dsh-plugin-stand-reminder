/**
 * Packaging contract test.
 *
 * These are the checks the profile loader itself performs before it will select
 * the bundle, so a typo here fails an install with a rolled-back profile:
 *   - `cordis.patch.yml` must be valid YAML (a `//` comment is not),
 *   - it must insert the row the package actually exports,
 *   - every path declared in `exports` / `dsh.bundle` must exist in the tarball.
 */
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * A deliberately small YAML reader: block sequences of mappings, and `key: value`
 * pairs nested by indentation. Enough to validate the patch layer without
 * pulling a dependency into a plugin that has none.
 */
function parsePatchYaml(source) {
  const rootValue = [];
  // Each frame owns the container its children go into: the root list, a nested
  // list, or the mapping of the most recent sequence item.
  const stack = [{ indent: -1, container: rootValue }];
  const owner = () => {
    const frame = stack.at(-1);
    return Array.isArray(frame.container) ? frame.container.at(-1) : frame.container;
  };

  for (const [index, rawLine] of source.split(/\r?\n/).entries()) {
    const line = rawLine.replace(/\t/g, '  ');
    const text = line.trim();
    if (text === '' || text.startsWith('#')) continue;
    // A JS-style comment is the exact mistake this test exists to catch.
    if (text.startsWith('//')) throw new Error(`line ${index + 1}: "//" is not a YAML comment`);
    const indent = line.length - line.trimStart().length;

    // Pop back to the container this line belongs to.
    while (stack.length > 1 && indent <= stack.at(-1).indent) stack.pop();

    if (text.startsWith('- ')) {
      const item = text.slice(2).trim();
      const separator = item.indexOf(':');
      if (separator < 1) throw new Error(`line ${index + 1}: expected "- key: value"`);
      const key = item.slice(0, separator).trim();
      const value = item.slice(separator + 1).trim();
      const entry = { [key]: value };
      const frame = stack.at(-1);
      if (!Array.isArray(frame.container)) throw new Error(`line ${index + 1}: sequence inside a mapping value`);
      frame.container.push(entry);
      stack.push({ indent, container: entry });
      // `- key:` opens a nested block for that key.
      if (value === '') {
        const nested = [];
        entry[key] = nested;
        stack.push({ indent, container: nested });
      }
      continue;
    }

    const separator = text.indexOf(':');
    if (separator < 1) throw new Error(`line ${index + 1}: expected "key: value"`);
    const key = text.slice(0, separator).trim();
    const value = text.slice(separator + 1).trim();
    const target = owner();
    if (!target || typeof target !== 'object' || Array.isArray(target)) {
      throw new Error(`line ${index + 1}: key without a parent mapping`);
    }
    if (value === '') {
      const nested = [];
      target[key] = nested;
      stack.push({ indent, container: nested });
    } else {
      target[key] = value;
    }
  }
  return rootValue;
}

async function readPackage() {
  return JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
}

test('cordis.patch.yml is valid YAML and inserts this package', async () => {
  const pkg = await readPackage();
  const source = await readFile(resolve(root, pkg.dsh.bundle.patch), 'utf8');
  const documents = parsePatchYaml(source);

  assert.equal(documents.length, 1, 'the patch layer is a single entry');
  const [entry] = documents;
  assert.ok(Array.isArray(entry.insert), 'the patch must declare an insert list');
  assert.equal(entry.insert.length, 1, 'exactly one row is inserted');
  const row = entry.insert[0];
  assert.equal(row.name, pkg.name, 'the inserted row must load this package');
  assert.ok(row.id && row.id !== '', 'the row needs an id');
  // A `//` comment would have thrown above; assert the file keeps a real one.
  assert.match(source, /^#/m, 'use "#" for YAML comments');
});

test('every path the manifest promises exists', async () => {
  const pkg = await readPackage();
  const promised = [
    pkg.main,
    ...Object.values(pkg.exports),
    pkg.dsh.bundle.patch,
  ].filter(value => typeof value === 'string');
  for (const relative of promised) {
    const info = await stat(resolve(root, relative)).catch(() => null);
    assert.ok(info?.isFile(), `${relative} is declared in package.json but missing`);
  }
});

test('the client half is declared and reachable', async () => {
  const pkg = await readPackage();
  assert.equal(pkg.dsh.client.platform, 'web');
  assert.ok(Array.isArray(pkg.dsh.client.inject));
  // The client half must not be resolvable as the package root, or the Host
  // half and the browser half would collide.
  assert.notEqual(pkg.main, pkg.exports['./client']);
  const client = await readFile(resolve(root, pkg.exports['./client']), 'utf8');
  assert.match(client, /^window\.__ModuleLoader__\.load\(/, 'the client half must use the host protocol');
  assert.match(client, new RegExp(`id: "${pkg.name}"`), 'the registered id must match the package name');
});
