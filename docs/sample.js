// In-memory example only. These files are displayed as text and are never executed.
const initialFiles = {
  'README.md': '# Orbit API\n\nA fictional service for this interactive audit.\n\n## Usage\nnode src/session.js\n\n[Local guide](docs/setup.md)\n',
  'src/billing.js': 'export function charge(amount) {\n  // TODO handle declined payments\n  return amount;\n}\n',
  'src/session.js': 'export const expires = 3600;\n',
  'test/session.test.js': 'import { test } from "node:test";\nimport assert from "node:assert/strict";\nimport { expires } from "../src/session.js";\ntest("session expires", () => assert.equal(expires, 3600));\n'
};
export const demoFixes = [
  { id: 'docs', file: 'docs/setup.md', matches: id => id.startsWith('docs.'), apply(files) {
    files['README.md'] += '\n## Setup\nInstall Node.js 22+. No external packages are needed.\n\n## Testing\nnode --test\n';
    files['docs/setup.md'] = '# Setup\n\nInstall Node.js 22 or later.\n\n## Usage\nnode src/session.js\n\n## Testing\nnode --test\n';
  } },
  { id: 'tests', file: 'test/billing.test.js', matches: id => id === 'tests.mapping', apply(files) {
    files['test/billing.test.js'] = 'import { test } from "node:test";\nimport assert from "node:assert/strict";\nimport { charge } from "../src/billing.js";\ntest("returns the supplied amount", () => assert.equal(charge(20), 20));\n';
  } },
  { id: 'ci', file: '.github/workflows/check.yml', matches: id => id === 'ci.missing', apply(files) {
    files['.github/workflows/check.yml'] = 'name: Checks\non: [push, pull_request]\npermissions:\n  contents: read\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - run: node --test\n';
  } },
  { id: 'license', file: 'LICENSE', matches: id => id === 'license.missing', apply(files) {
    files.LICENSE = 'MIT License\n\nCopyright (c) 2026 Orbit API example contributors\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the "Software"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n';
  } },
  { id: 'markers', file: 'src/billing.js', matches: id => id.startsWith('debt:'), apply(files) {
    files['src/billing.js'] = files['src/billing.js'].replace('// TODO handle declined payments', '// Follow-up tracked in example issue BILL-1: declined payments');
  } }
];
export function createDemo() { return { files: { ...initialFiles }, applied: [] }; }
export function applyDemoFix(state, id) {
  const fix = demoFixes.find(item => item.id === id);
  if (!fix || state.applied.includes(id)) return state;
  const files = { ...state.files };
  fix.apply(files);
  return { files, applied: [...state.applied, id] };
}
