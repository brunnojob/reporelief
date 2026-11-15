import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { analyze } from '../src/analyze.js';
import { createDemo, demoFixes } from '../docs/sample.js';
import { messages, t, localizeReport, exportMarkdown } from '../docs/i18n.js';

test('interface keys, attributes and demo controls are translated in both directions', async () => {
  assert.deepEqual(Object.keys(messages.en).sort(), Object.keys(messages['pt-BR']).sort());
  const html = await readFile(new URL('../docs/index.html', import.meta.url), 'utf8');
  for (const [, key] of html.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)) {
    assert.ok(messages.en[key], key);
    assert.ok(messages['pt-BR'][key], key);
  }
  for (const fix of demoFixes) for (const part of ['title', 'detail']) {
    assert.notEqual(t('en', `fix.${fix.id}.${part}`), t('pt-BR', `fix.${fix.id}.${part}`));
  }
  assert.equal(t('pt-BR', 'status', { count: 2, total: 6 }), '2 de 6 achados exibidos. Análise heurística: revise as evidências antes de agir.');
});

test('all rule families, evidence descriptions and exported plans follow the chosen language', () => {
  const reports = [analyze({}), analyze(createDemo().files, ['src/session.js']), analyze({ 'README.md': '# Project', 'src/large.js': 'let n = 1;\n'.repeat(402) })];
  for (const report of reports) {
    const original = structuredClone(report);
    const pt = localizeReport(report, 'pt-BR');
    for (let i = 0; i < report.findings.length; i++) {
      assert.notEqual(pt.findings[i].title, report.findings[i].title);
      assert.notEqual(pt.findings[i].action, report.findings[i].action);
      assert.equal(pt.findings[i].id, report.findings[i].id);
      assert.equal(pt.findings[i].priority, report.findings[i].priority);
    }
    for (let i = 0; i < report.limitations.length; i++) assert.notEqual(pt.limitations[i], report.limitations[i]);
    assert.deepEqual(report, original, 'changing language must not mutate the original report');
    assert.deepEqual(localizeReport(report, 'en'), original);
    const markdown = exportMarkdown(report, 'pt-BR');
    assert.match(markdown, /^# Plano de manutenção RepoRelief/);
    assert.match(markdown, /## Revisão de alterações/);
    assert.match(markdown, /## Limites/);
    assert.doesNotMatch(markdown, /\[medium\]|\[high\]|\[low\]|No related tests identified/);
    assert.match(exportMarkdown(report, 'en'), /^# RepoRelief maintenance plan/);
  }
  assert.match(exportMarkdown(reports[1], 'pt-BR'), /README\.md:8: docs\/setup\.md -> docs\/setup\.md/);
  assert.match(exportMarkdown(reports[1], 'pt-BR'), /test\/session\.test\.js/);
});
