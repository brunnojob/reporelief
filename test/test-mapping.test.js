import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze } from '../src/analyze.js';

const pairs = [
  ['src/price.py', 'tests/test_price.py'],
  ['src/price.go', 'src/price_test.go'],
  ['src/auth/user.ts', 'tests/auth/user.spec.ts'],
  ['src/main/java/com/acme/User.java', 'src/test/java/com/acme/UserTest.java'],
  ['src/price.ts', 'src/__tests__/price.test.ts']
];

for (const [source, relatedTest] of pairs) {
  test(`maps ${source} to ${relatedTest}`, () => {
    const report = analyze({ [source]: '', [relatedTest]: '' }, [source]);
    assert.equal(report.summary.sourceFiles, 1);
    assert.equal(report.summary.testFiles, 1);
    assert.ok(!report.findings.some(finding => finding.id === 'tests.mapping'));
    assert.deepEqual(report.changePlan.relatedTests, [relatedTest]);
  });
}

test('same filename in another feature does not imply test coverage', () => {
  const report = analyze({
    'src/auth/user.ts': '',
    'src/billing/user.ts': '',
    'tests/billing/user.test.ts': ''
  }, ['src/auth/user.ts']);
  assert.deepEqual(report.findings.find(finding => finding.id === 'tests.mapping').evidence, ['src/auth/user.ts']);
  assert.deepEqual(report.changePlan.relatedTests, []);
});

test('changed paths are normalized and explicitly changed tests are deduplicated', () => {
  const report = analyze({
    'src/price.py': '',
    'tests/test_price.py': ''
  }, ['./src\\price.py', '.\\tests\\test_price.py', 'tests/test_price.py']);
  assert.deepEqual(report.changePlan.changed, ['src/price.py', 'tests/test_price.py']);
  assert.deepEqual(report.changePlan.relatedTests, ['tests/test_price.py']);
});
