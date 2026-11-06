#!/usr/bin/env node
import { readdir, readFile, realpath } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { analyze, toMarkdown } from '../src/analyze.js';
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node bin/reporelief.js [directory] [--json] [--changed BASE]\nReads text files only. Never runs project code. Outputs to stdout.');
  process.exit(0);
}
const flags = new Set(['--json', '--changed']);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--changed') { if (!args[++i] || args[i].startsWith('-')) throw new Error('--changed requires a git revision'); }
  else if (args[i].startsWith('-') && !flags.has(args[i])) throw new Error(`Unknown option: ${args[i]}`);
}
const directory = args[0] && !args[0].startsWith('-') ? args[0] : '.';
const root = await realpath(resolve(directory));
const ignored = new Set(['.git', 'node_modules', 'vendor', 'dist', 'build', 'coverage', '.next', '.venv', '__pycache__']);
const files = {};
const availablePaths = [];
let bytes = 0;
async function walk(relative = '') {
  for (const entry of await readdir(join(root, relative), { withFileTypes: true })) {
    const path = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink() || ignored.has(entry.name) || /^\.env(?:\.|$)/.test(entry.name)) continue;
    availablePaths.push(path);
    if (availablePaths.length > 10000) throw new Error('Inventory limit exceeded (10,000 entries).');
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile()) {
      if (/\.(png|jpg|gif|zip|pdf|lock|woff2?)$/i.test(entry.name)) continue;
      const { stat } = await import('node:fs/promises');
      if ((await stat(join(root, path))).size > 512000) continue;
      const buffer = await readFile(join(root, path));
      if (buffer.includes(0)) continue;
      bytes += buffer.length;
      if (bytes > 20000000 || Object.keys(files).length >= 10000) throw new Error('Scan limit exceeded (20 MB / 10,000 files). Choose a smaller directory.');
      files[path] = buffer.toString('utf8');
    }
  }
}
try {
  await walk();
  const index = args.indexOf('--changed');
  const changed = index < 0 ? [] : execFileSync('git', ['diff', '--name-only', '-z', `${args[index + 1]}...HEAD`, '--'], { cwd: root, encoding: 'utf8', maxBuffer: 2000000 }).split('\0').filter(Boolean);
  const report = analyze(files, changed, availablePaths);
  console.log(args.includes('--json') ? JSON.stringify(report, null, 2) : toMarkdown(report));
} catch (error) { console.error(`RepoRelief: ${error.message}`); process.exitCode = 1; }
