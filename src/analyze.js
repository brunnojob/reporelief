import { missingMarkdownLinks } from './markdown-links.js';

const sourcePattern =
  /\.(?:[cm]?[jt]sx?|py|go|rs|java|cs|cpp|c|h|rb|php|swift|kt)$/i;

const testPattern =
  /(?:^|\/)(?:tests?|__tests__|specs?|__specs__)(?:\/|$)|(?:^|\/)(?:test|spec)[._-][^/]+$|[._-](?:test|spec)\.[^/]+$|(?:Tests?|Specs?)\.[^/]+$/;

const conventionalDirectory =
  /^(?:src|lib|app|tests?|__tests__|specs?|__specs__)$/;

const normalizePath = path =>
  path
    .replaceAll('\\', '/')
    .replace(/^(?:\.\/)+/, '')
    .replace(/\/+/g, '/');

function stem(path) {
  return path
    .split('/')
    .at(-1)
    .replace(/\.[^.]+$/, '')
    .replace(/^(?:test|spec)[._-]+/i, '')
    .replace(/[._-](?:test|spec)$/i, '')
    .replace(/(?:Tests?|Specs?)$/, '');
}

/**
 * Match conventional source/test layouts while retaining feature directories.
 *
 * src/auth/user.ts           -> auth/user
 * tests/auth/user.spec.ts    -> auth/user
 * tests/billing/user.test.ts -> billing/user
 */
function moduleKey(path) {
  const parts = path.split('/');
  parts.pop();

  const directory = parts
    .join('/')
    .replace(/^src\/(?:main|test)\/(?:java|kotlin)(?:\/|$)/, '')
    .split('/')
    .filter(part => part && !conventionalDirectory.test(part))
    .join('/');

  return `${directory}/${stem(path)}`;
}

function indexTests(tests) {
  const index = new Map();

  for (const path of tests) {
    const key = moduleKey(path);
    const matches = index.get(key);

    if (matches) matches.push(path);
    else index.set(key, [path]);
  }

  return index;
}

export function analyze(
  files,
  changed = [],
  availablePaths = Object.keys(files)
) {
  const entries = Object.entries(files).map(([path, content]) => [
    normalizePath(path),
    content
  ]);

  const paths = entries.map(([path]) => path);
  const inventory = [...new Set(availablePaths.map(normalizePath))];
  const codeEntries = entries.filter(([path]) => sourcePattern.test(path));
  const tests = codeEntries
    .filter(([path]) => testPattern.test(path))
    .map(([path]) => path);
  const sources = codeEntries.filter(([path]) => !testPattern.test(path));
  const testsByModule = indexTests(tests);

  const findings = [];

  const add = (id, priority, title, evidence, action) => {
    findings.push({ id, priority, title, evidence, action });
  };

  for (const link of missingMarkdownLinks(entries, inventory)) {
    add(
      `docs.link:${link.source}:${link.line}:${link.target}`,
      'medium',
      'Repair a missing local Markdown target',
      [
        `${link.source}:${link.line}: ${link.destination} -> ${link.target}`
      ],
      'Restore the target or update the link relative to the source file directory. Only local path existence is checked.'
    );
  }

  const readme = entries.find(([path]) =>
    /^readme(?:\.md|\.rst|\.txt)?$/i.test(path)
  );

  if (!readme) {
    add(
      'docs.readme',
      'high',
      'Add a project entry point',
      ['No root README found'],
      'Document purpose, setup, one runnable example and the test command.'
    );
  } else {
    const sections = [
      ['setup', /install|setup|getting started|quick.?start/i],
      ['testing', /test|verification/i],
      ['usage', /usage|example|how to use/i]
    ];

    for (const [section, pattern] of sections) {
      if (!pattern.test(readme[1])) {
        add(
          `docs.${section}`,
          'medium',
          `Document ${section}`,
          [readme[0]],
          `Add a ${section} section with commands verified by a maintainer.`
        );
      }
    }
  }

  if (!paths.some(path => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(path))) {
    add(
      'ci.missing',
      'high',
      'Make checks repeatable',
      ['No GitHub Actions workflow found'],
      'Add CI that runs the actual project checks on pushes and pull requests.'
    );
  }

  if (!paths.some(path => /^(?:license|copying)(?:\.[^/]+)?$/i.test(path))) {
    add(
      'license.missing',
      'medium',
      'Clarify reuse permissions',
      ['No root license file found'],
      'Choose and add a license appropriate to the project.'
    );
  }

  const unmatched = sources
    .filter(([path]) => !testsByModule.has(moduleKey(path)))
    .map(([path]) => path);

  if (unmatched.length) {
    add(
      'tests.mapping',
      'medium',
      'Review modules without matching test names',
      unmatched,
      'Check existing integration coverage first; add behavior tests for uncovered boundaries and failure paths. Filename and directory matching is a heuristic, not coverage.'
    );
  }

  for (const [path, content] of sources) {
    const lines = content.split(/\r\n|\n|\r/);

    if (lines.length > 400) {
      add(
        `size:${path}`,
        'medium',
        'Review a large module before changing it',
        [`${path}: ${lines.length} lines`],
        'Identify public behavior and add characterization tests before extracting responsibilities.'
      );
    }

    const markers = [];

    for (let index = 0; index < lines.length; index++) {
      if (/\b(?:TODO|FIXME|HACK)\b/.test(lines[index])) {
        markers.push(`${path}:${index + 1}`);
      }
    }

    if (markers.length) {
      add(
        `debt:${path}`,
        'low',
        'Triage maintenance markers',
        markers,
        'Validate each marker and convert actionable work into a scoped issue.'
      );
    }
  }

  const changedSet = new Set(changed.map(normalizePath));
  const changedSources = sources.filter(([path]) => changedSet.has(path));
  const relatedTests = new Set();

  for (const [path] of changedSources) {
    for (const test of testsByModule.get(moduleKey(path)) ?? []) {
      relatedTests.add(test);
    }
  }

  // Explicitly changed tests should also be included in the review plan.
  for (const test of tests) {
    if (changedSet.has(test)) relatedTests.add(test);
  }

  return {
    schemaVersion: 1,

    summary: {
      files: paths.length,
      sourceFiles: sources.length,
      testFiles: tests.length,
      findings: findings.length
    },

    findings,

    changePlan: {
      changed: [...changedSet],
      relatedTests: [...relatedTests],
      checklist: changedSet.size
        ? [
            'Explain the user-visible behavior change.',
            'Verify failure paths and backward compatibility.',
            'Run relevant tests, then the project check suite.',
            'Update documentation and record rollback steps.'
          ]
        : []
    },

    limitations: [
      'Static heuristics only; no code execution, semantic call graph or measured test coverage.',
      'Only supplied text files are analyzed. Review recommendations before applying changes.',
      'Test matching uses filenames and conventional directory layouts. Shared integration tests, custom layouts and multiple source files with the same module key may require manual review.',
      'Markdown links: bounded inline/reference syntax only; no external URL, anchor, HTML link or instruction validation. Missing targets may be excluded from the supplied inventory.'
    ]
  };
}

export function toMarkdown(report) {
  const { summary, findings, changePlan, limitations } = report;
  const singleLine = value => String(value).replace(/[\r\n]/g, ' ');

  return [
    '# RepoRelief maintenance plan',
    '',
    `${summary.files} files · ${summary.sourceFiles} source files · ${summary.testFiles} test files · ${summary.findings} findings`,
    '',
    ...findings.flatMap(finding => [
      `## [${finding.priority}] ${finding.title}`,
      '',
      ...finding.evidence.map(item => `- ${singleLine(item)}`),
      '',
      finding.action,
      ''
    ]),
    '## Change review',
    '',
    ...changePlan.checklist.map(item => `- [ ] ${singleLine(item)}`),
    '',
    'Related tests (filename and directory heuristic):',
    '',
    ...(changePlan.relatedTests.length
      ? changePlan.relatedTests.map(path => `- ${singleLine(path)}`)
      : ['- No related tests identified.']),
    '',
    '## Limits',
    '',
    ...limitations.map(item => `- ${singleLine(item)}`),
    ''
  ].join('\n');
}
