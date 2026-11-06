import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const cli = new URL('../bin/reporelief.js', import.meta.url);
const run = (...args) => execFileSync(process.execPath, [fileURLToPath(cli), ...args], {encoding:'utf8'});
test('CLI inventories binary assets without reading them as source text', async () => {
 const root=await mkdtemp(join(tmpdir(),'reporelief-'));
 try {
  await mkdir(join(root,'docs'));
  await writeFile(join(root,'README.md'),'![asset](docs/image.png)\n[broken](docs/absent.md)');
  await writeFile(join(root,'docs/image.png'),Buffer.from([0,1,2]));
  const report=JSON.parse(run(root,'--json'));
  assert.equal(report.summary.files,1);
  assert.deepEqual(report.findings.filter(f=>f.id.startsWith('docs.link:')).map(f=>f.evidence[0]),['README.md:2: docs/absent.md -> docs/absent.md']);
 } finally {await rm(root,{recursive:true,force:true});}
});
test('showcase report is reproducible from its fixture', async () => {
 const root=fileURLToPath(new URL('../examples/neglected-repo',import.meta.url));
 const expected=await readFile(new URL('../examples/maintenance-plan.md',import.meta.url),'utf8');
 assert.equal(run(root).replaceAll('\r\n','\n'),expected.replaceAll('\r\n','\n'));
});
