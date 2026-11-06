import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, toMarkdown } from '../src/analyze.js';
test('empty repository reports evidence and actionable basics', () => {
 const report = analyze({});
 assert.deepEqual(report.findings.map(f => f.id), ['docs.readme', 'ci.missing', 'license.missing']);
 assert.match(toMarkdown(report), /No root README/);
});
test('recognizes setup, CI, license and matching test names', () => {
 const report = analyze({'README.md':'Setup Usage Testing', 'LICENSE':'MIT', '.github/workflows/ci.yml':'name: CI', 'src/cart.js':'export const total = 1;', 'test/cart.test.js':'test()'}, ['src/cart.js']);
 assert.equal(report.findings.length, 0);
 assert.deepEqual(report.changePlan.relatedTests, ['test/cart.test.js']);
});
test('normalizes windows paths and distinguishes test files', () => {
 const report = analyze({'src\\price.py':'# TODO validate', 'tests\\test_price.py':'pass'});
 assert.equal(report.summary.sourceFiles, 1);
 assert.equal(report.summary.testFiles, 1);
 assert.deepEqual(report.findings.find(f => f.id.startsWith('debt:')).evidence, ['src/price.py:1']);
});
test('large modules get characterization advice without claiming coverage', () => {
 const report = analyze({'old.js':'x\n'.repeat(401)});
 assert.ok(report.findings.some(f => f.id === 'size:old.js'));
 assert.match(report.findings.find(f=>f.id==='tests.mapping').action, /not coverage/);
});
test('local Markdown links resolve from each source directory with source lines', () => {
 const report = analyze({'docs/guide.md':'# Guide\n[OK](../README.md)\n[Missing](./setup.md#install)', 'README.md':'Setup Usage Testing'});
 const links = report.findings.filter(f=>f.id.startsWith('docs.link:'));
 assert.equal(links.length, 1);
 assert.deepEqual(links[0].evidence, ['docs/guide.md:3: ./setup.md#install -> docs/setup.md']);
});
test('images, encoded spaces, directories, queries and references use inventory', () => {
 const files={'docs/guide.md':'![Diagram](../assets/a%20b.png)\n[folder](../src/)\n[ref][install]\n[install]: <./missing file.md>\n[ok](../README.md?raw=1)'};
 const report=analyze(files,[],['docs/guide.md','assets/a b.png','src/main.js','README.md']);
 assert.deepEqual(report.findings.filter(f=>f.id.startsWith('docs.link:')).map(f=>f.evidence[0]), ['docs/guide.md:3: ./missing file.md -> docs/missing file.md']);
});
test('does not validate remote URLs, anchors, root paths or code examples', () => {
 const text=['[remote](https://example.invalid/nope)','[mail](mailto:dev@example.com)','[protocol](//example.com/nope)','[anchor](#missing)','[root](/site/path)','`[code](missing.md)`','```md','[sample](missing.md)','```','\\[escaped](missing.md)'].join('\n');
 assert.equal(analyze({'README.md':text}).findings.filter(f=>f.id.startsWith('docs.link:')).length,0);
});
test('balanced parentheses and collapsed/shortcut reference destinations', () => {
 const text='[one](./file(v1).md)\n[guide][]\n[guide]\n[guide]: missing.md';
 const report=analyze({'README.md':text},[],['README.md','file(v1).md']);
 assert.deepEqual(report.findings.filter(f=>f.id.startsWith('docs.link:')).map(f=>f.evidence[0]), ['README.md:2: missing.md -> missing.md','README.md:3: missing.md -> missing.md']);
});
