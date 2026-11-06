import { missingMarkdownLinks } from './markdown-links.js';

const sourcePattern = /\.(?:[cm]?[jt]sx?|py|go|rs|java|cs|cpp|c|h|rb|php|swift|kt)$/i;
const testPattern = /(?:^|\/)(?:tests?|__tests__|spec)(?:\/|\.)|(?:[._-](?:test|spec))\.[^.]+$|_test\.go$/i;
const stem = path => path.split('/').at(-1).replace(/\.[^.]+$/, '').replace(/[._-](test|spec)$/, '');

export function analyze(files, changed = [], availablePaths = Object.keys(files)) {
  const entries = Object.entries(files).map(([path, content]) => [path.replaceAll('\\', '/').replace(/^\.\//, ''), content]);
  const paths = entries.map(([path]) => path);
  const tests = paths.filter(path => testPattern.test(path));
  const sources = entries.filter(([path]) => sourcePattern.test(path) && !testPattern.test(path));
  const findings = [];
  const add = (id, priority, title, evidence, action) => findings.push({ id, priority, title, evidence, action });
  for (const link of missingMarkdownLinks(entries, availablePaths)) {
    add(`docs.link:${link.source}:${link.line}:${link.target}`, 'medium',
      'Repair a missing local Markdown target',
      [`${link.source}:${link.line}: ${link.destination} -> ${link.target}`],
      'Restore the target or update the link relative to the source file directory. Only local path existence is checked.');
  }
  const readme = entries.find(([path]) => /^readme(?:\.md|\.rst|\.txt)?$/i.test(path));
  if (!readme) add('docs.readme', 'high', 'Add a project entry point', ['No root README found'], 'Document purpose, setup, one runnable example and the test command.');
  else {
    for (const [section, pattern] of [['setup', /install|setup|getting started|quick.?start/i], ['testing', /test|verification/i], ['usage', /usage|example|how to use/i]]) {
      if (!pattern.test(readme[1])) add(`docs.${section}`, 'medium', `Document ${section}`, [readme[0]], `Add a ${section} section with commands verified by a maintainer.`);
    }
  }
  if (!paths.some(p => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(p))) add('ci.missing', 'high', 'Make checks repeatable', ['No GitHub Actions workflow found'], 'Add CI that runs the actual project checks on pushes and pull requests.');
  if (!paths.some(p => /^(?:license|copying)(?:\..*)?$/i.test(p))) add('license.missing', 'medium', 'Clarify reuse permissions', ['No root license file found'], 'Choose and add a license appropriate to the project.');
  const unmatched = sources.filter(([path]) => !tests.some(test => stem(test) === stem(path)));
  if (unmatched.length) add('tests.mapping', 'medium', 'Review modules without matching test names', unmatched.map(([p]) => p), 'Check existing integration coverage first; add behavior tests for uncovered boundaries and failure paths. Filename matching is a heuristic, not coverage.');
  for (const [path, content] of sources) {
    const lines = content.split('\n').length;
    if (lines > 400) add(`size:${path}`, 'medium', 'Review a large module before changing it', [`${path}: ${lines} lines`], 'Identify public behavior and add characterization tests before extracting responsibilities.');
    const markers = content.split('\n').flatMap((line, index) => /\b(TODO|FIXME|HACK)\b/.test(line) ? [`${path}:${index + 1}`] : []);
    if (markers.length) add(`debt:${path}`, 'low', 'Triage maintenance markers', markers, 'Validate each marker and convert actionable work into a scoped issue.');
  }
  const changedSet = new Set(changed.map(p => p.replaceAll('\\', '/')));
  const changedSources = sources.filter(([p]) => changedSet.has(p));
  const relatedTests = tests.filter(test => changedSources.some(([path]) => stem(test) === stem(path)));
  return {
    schemaVersion: 1,
    summary: { files: paths.length, sourceFiles: sources.length, testFiles: tests.length, findings: findings.length },
    findings,
    changePlan: { changed: [...changedSet], relatedTests, checklist: changedSet.size ? ['Explain the user-visible behavior change.', 'Verify failure paths and backward compatibility.', 'Run relevant tests, then the project check suite.', 'Update documentation and record rollback steps.'] : [] },
    limitations: ['Static heuristics only; no code execution, semantic call graph or measured test coverage.', 'Only supplied text files are analyzed. Review recommendations before applying changes.', 'Markdown links: bounded inline/reference syntax only; no external URL, anchor, HTML link or instruction validation. Missing targets may be excluded from the supplied inventory.']
  };
}

export function toMarkdown(report) {
  const { summary } = report;
  return ['# RepoRelief maintenance plan', '', `${summary.files} files · ${summary.sourceFiles} source files · ${summary.testFiles} test files · ${summary.findings} findings`, '', ...report.findings.flatMap(f => [`## [${f.priority}] ${f.title}`, '', ...f.evidence.map(e => `- ${e.replace(/[\r\n]/g, ' ')}`), '', f.action, '']), '## Change review', '', ...report.changePlan.checklist.map(item => `- [ ] ${item}`), '', 'Related tests (filename heuristic):', ...report.changePlan.relatedTests.map(p => `- ${p}`), '', '## Limits', ...report.limitations.map(item => `- ${item}`), ''].join('\n');
}
