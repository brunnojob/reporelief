import { analyze } from './analyze.js';
import { t, localizeReport, exportMarkdown } from './i18n.js?v=20261115-demo';
import { createDemo, applyDemoFix, demoFixes } from './sample.js?v=20261115-demo';
const $ = id => document.getElementById(id);
let locale;
try { locale = localStorage.getItem('reporelief-language'); } catch {}
if (!['en', 'pt-BR'].includes(locale)) locale = navigator.language.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
let demoState = createDemo();
let mode = 'sample';
let report = analyze(demoState.files);
const initialCount = report.summary.findings;
let sourcePath = 'README.md';
let localFiles;
let localPaths;
let busy = false;
let requestId = 0;
let notice;
const text = (key, vars) => t(locale, key, vars);
function element(tag, content, className) {
  const node = document.createElement(tag);
  if (content !== undefined) node.textContent = content;
  if (className) node.className = className;
  return node;
}
function translatePage() {
  document.documentElement.lang = locale;
  document.title = text('title');
  document.querySelector('meta[name="description"]').content = text('description');
  document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = text(node.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(node => { node.setAttribute('aria-label', text(node.dataset.i18nAriaLabel)); });
  $('language').value = locale;
}
function renderDemo() {
  $('demo-panel').hidden = mode !== 'sample';
  if (mode !== 'sample') return;
  const paths = Object.keys(demoState.files).sort();
  if (!paths.includes(sourcePath)) sourcePath = paths[0];
  $('sample-file').replaceChildren(...paths.map(path => new Option(path, path)));
  $('sample-file').value = sourcePath;
  $('sample-source').textContent = demoState.files[sourcePath].split('\n').map((line, index) => `${String(index + 1).padStart(2)}  ${line}`).join('\n');
  $('demo-fixes').replaceChildren(...demoFixes.map(fix => {
    const card = element('div', undefined, 'demo-fix');
    card.append(element('h4', text(`fix.${fix.id}.title`)), element('p', text(`fix.${fix.id}.detail`)));
    const applied = demoState.applied.includes(fix.id);
    const button = element('button', text(applied ? 'applied' : 'apply'), 'quiet');
    button.dataset.fix = fix.id;
    button.disabled = applied;
    card.append(button);
    return card;
  }));
  $('demo-progress').textContent = text('progress', { done: demoState.applied.length, steps: demoFixes.length, before: initialCount, after: report.summary.findings });
  if (!report.findings.length) $('demo-progress').append(element('p', text('completed')));
}
function render() {
  $('mode').textContent = text(mode === 'sample' ? 'sampleMode' : 'localMode');
  $('metrics').replaceChildren(...Object.entries(report.summary).map(([label, value]) => {
    const el = element('div', undefined, 'metric');
    el.append(element('strong', value), element('span', text(label)));
    return el;
  }));
  const translated = localizeReport(report, locale);
  const filtered = translated.findings.filter(f => $('priority').value === 'all' || f.priority === $('priority').value);
  $('findings').replaceChildren(...filtered.map(f => {
    const el = element('article', undefined, 'finding');
    const body = element('div');
    body.append(element('h3', f.title), element('code', f.evidence.join('\n')), element('p', f.action));
    if (mode === 'sample') {
      const inspect = element('button', text('inspect'), 'quiet inspect');
      inspect.dataset.inspect = f.id;
      body.append(inspect);
    }
    el.append(element('span', text(f.priority), `badge ${f.priority}`), body);
    return el;
  }));
  if (!filtered.length) $('findings').append(element('p', text(report.findings.length ? 'noFiltered' : 'noFindings'), 'empty'));
  const status = text('status', { count: filtered.length, total: report.findings.length });
  $('status').textContent = busy ? text('reading') : notice ? `${text(notice.key, notice.vars)} ${status}` : status;
  $('rerun').disabled = busy;
  $('export').disabled = busy;
  $('workbench').setAttribute('aria-busy', String(busy));
  renderDemo();
}
function runDemo(scroll = true) {
  requestId++;
  busy = false;
  demoState = createDemo();
  mode = 'sample';
  localFiles = undefined;
  localPaths = undefined;
  $('folder').value = '';
  $('priority').value = 'all';
  sourcePath = 'README.md';
  report = analyze(demoState.files);
  notice = undefined;
  render();
  if (scroll) {
    $('demo-title').tabIndex = -1;
    $('demo-title').focus({ preventScroll: true });
    $('workbench').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
$('demo').addEventListener('click', () => runDemo());
$('reset-demo').addEventListener('click', () => runDemo(false));
$('open-folder-demo').addEventListener('click', () => $('folder').click());
$('language').addEventListener('change', event => {
  locale = event.target.value;
  try { localStorage.setItem('reporelief-language', locale); } catch {}
  translatePage();
  render();
});
$('priority').addEventListener('change', () => { notice = undefined; render(); });
$('sample-file').addEventListener('change', event => { sourcePath = event.target.value; renderDemo(); });
$('demo-fixes').addEventListener('click', event => {
  const button = event.target.closest('[data-fix]');
  if (!button || mode !== 'sample') return;
  const before = report.summary.findings;
  const next = applyDemoFix(demoState, button.dataset.fix);
  if (next === demoState) return;
  demoState = next;
  sourcePath = demoFixes.find(fix => fix.id === button.dataset.fix).file;
  report = analyze(demoState.files);
  notice = { key: 'changeApplied', vars: { before, after: report.summary.findings } };
  render();
  // Rendering replaces the clicked button; keep keyboard focus on its new instance.
  $('sample-file').focus({ preventScroll: true });
});
$('findings').addEventListener('click', event => {
  const button = event.target.closest('[data-inspect]');
  if (!button || mode !== 'sample') return;
  const finding = report.findings.find(f => f.id === button.dataset.inspect);
  sourcePath = Object.keys(demoState.files).find(path => finding.evidence.some(e => e === path || e.startsWith(`${path}:`))) ?? 'README.md';
  renderDemo();
  $('sample-file').focus({ preventScroll: true });
  $('sample-source').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
$('rerun').addEventListener('click', () => {
  report = mode === 'sample' ? analyze(demoState.files) : analyze(localFiles, [], localPaths);
  notice = { key: 'auditAgain', vars: { count: report.summary.findings } };
  render();
});
$('folder').addEventListener('change', async event => {
  const selected = [...event.target.files];
  if (!selected.length) return;
  const currentRequest = ++requestId;
  busy = true;
  notice = undefined;
  render();
  try {
    const files = {};
    const availablePaths = [];
    let total = 0;
    if (selected.length > 10000) throw new Error('tooMany');
    for (const file of selected) {
      if (currentRequest !== requestId) return;
      const path = file.webkitRelativePath.split('/').slice(1).join('/');
      if (/(?:^|\/)(?:node_modules|\.git|dist|vendor|build|coverage|\.venv)(?:\/|$)|(?:^|\/)\.env(?:\.|$)/.test(path)) continue;
      availablePaths.push(path);
      if (file.size > 512000) continue;
      total += file.size;
      if (total > 20000000) throw new Error('tooLarge');
      const contents = await file.text();
      if (!contents.includes('\0')) files[path] = contents;
    }
    if (currentRequest !== requestId) return;
    if (!Object.keys(files).length) throw new Error('noText');
    localFiles = files;
    localPaths = availablePaths;
    report = analyze(files, [], availablePaths);
    mode = 'local';
    $('priority').value = 'all';
    notice = undefined;
  } catch (error) {
    if (currentRequest !== requestId) return;
    notice = { key: ['tooMany', 'tooLarge', 'noText'].includes(error.message) ? error.message : 'readError' };
  } finally {
    if (currentRequest === requestId) { busy = false; render(); }
  }
});
$('export').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([exportMarkdown(report, locale)], { type: 'text/markdown;charset=utf-8' }));
  const link = element('a');
  link.href = url;
  link.download = text('downloadName');
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
translatePage();
runDemo(false);
