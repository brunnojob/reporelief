import { analyze, toMarkdown } from './analyze.js';
const $ = id => document.getElementById(id);
const sample = { 'README.md':'# Orbit API\nUsage: start the server.\n[Setup guide](docs/setup.md)', 'src/billing.js':'export function charge(amount) {\n // TODO handle declined payments\n return amount;\n}', 'src/session.js':'export const expires = 3600;', 'test/session.test.js':'test("session expires", () => {});' };
let report;
function render() {
 $('metrics').replaceChildren(...Object.entries(report.summary).map(([label,value]) => { const el=document.createElement('div'); el.className='metric'; const strong=document.createElement('strong'); strong.textContent=value; const span=document.createElement('span'); span.textContent=label.replace(/([A-Z])/g,' $1').toUpperCase(); el.append(strong,span); return el; }));
 const filtered=report.findings.filter(f=>$('priority').value==='all'||f.priority===$('priority').value);
 $('findings').replaceChildren(...filtered.map(f=>{const el=document.createElement('article');el.className='finding';const badge=document.createElement('span');badge.className=`badge ${f.priority}`;badge.textContent=f.priority;const body=document.createElement('div');const title=document.createElement('h3');title.textContent=f.title;const evidence=document.createElement('code');evidence.textContent=f.evidence.join('\n');const action=document.createElement('p');action.textContent=f.action;body.append(title,evidence,action);el.append(badge,body);return el;}));
 $('status').textContent=`${filtered.length} findings shown. Heuristics only; review evidence before acting.`;
}
function runDemo(){report=analyze(sample);$('mode').textContent='SAMPLE REPOSITORY';render();}
$('demo').addEventListener('click',runDemo);
$('priority').addEventListener('change',render);
$('folder').addEventListener('change',async event=>{
 try {
 const files={};const availablePaths=[];let total=0;const selected=[...event.target.files];
 if(selected.length>10000)throw new Error('Choose a smaller folder (10,000 files maximum).');
 for(const file of selected){const path=file.webkitRelativePath.split('/').slice(1).join('/');if(/(?:^|\/)(?:node_modules|\.git|dist|vendor|build|coverage|\.venv)(?:\/|$)|(?:^|\/)\.env(?:\.|$)/.test(path))continue;availablePaths.push(path);if(file.size>512000)continue;total+=file.size;if(total>20000000)throw new Error('Choose a smaller folder (20 MB maximum).');const text=await file.text();if(!text.includes('\0'))files[path]=text;}
 report=analyze(files,[],availablePaths);$('mode').textContent='LOCAL FOLDER';render();
 }catch(error){$('status').textContent=error.message;}
});
$('export').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([toMarkdown(report)],{type:'text/markdown'}));const link=document.createElement('a');link.href=url;link.download='reporelief-plan.md';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
runDemo();
