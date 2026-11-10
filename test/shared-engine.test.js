import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

for (const file of ['analyze.js', 'markdown-links.js']) {
  test(`browser and CLI share the same ${file}`, async () => {
    const [source, browser] = await Promise.all([
      readFile(new URL(`../src/${file}`, import.meta.url), 'utf8'),
      readFile(new URL(`../docs/${file}`, import.meta.url), 'utf8')
    ]);
    assert.equal(browser.replaceAll('\r\n', '\n'), source.replaceAll('\r\n', '\n'));
  });
}
