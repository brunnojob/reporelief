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
