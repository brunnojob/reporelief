import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze } from '../src/analyze.js';
import { createDemo, applyDemoFix, demoFixes } from '../docs/sample.js';

test('interactive changes remove only their matching signals using the shared engine', () => {
  let state = createDemo();
  const original = createDemo();
  const initial = analyze(state.files);
  assert.ok(initial.findings.some(f => f.id.startsWith('docs.link:')));
  for (const fix of demoFixes) {
    const before = analyze(state.files);
    assert.ok(before.findings.some(f => fix.matches(f.id)), fix.id);
    const next = applyDemoFix(state, fix.id);
    const after = analyze(next.files);
    assert.deepEqual(after.findings.map(f => f.id), before.findings.filter(f => !fix.matches(f.id)).map(f => f.id), fix.id);
    assert.ok(next.files[fix.file]);
    assert.equal(applyDemoFix(next, fix.id), next, 'applying an already applied fix is a no-op');
    state = next;
  }
  assert.equal(analyze(state.files).summary.findings, 0);
  assert.equal(state.applied.length, 5);
  assert.deepEqual(createDemo(), original, 'demo reset restores untouched files');
  assert.equal(applyDemoFix(state, 'unknown'), state);
});

test('sample changes can be explored in any order without changing the initial scenario', () => {
  let state = createDemo();
  for (const fix of [...demoFixes].reverse()) state = applyDemoFix(state, fix.id);
  assert.equal(analyze(state.files).summary.findings, 0);
  assert.ok(analyze(createDemo().files).summary.findings > 0);
});
