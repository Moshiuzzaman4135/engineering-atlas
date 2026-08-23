const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {loadScript}=require('./helpers');

function loadExpanded(){
  const first=loadScript('js/data.js');
  return loadScript('js/expanded-data.js',{window:first.window}).window.InterviewOSData;
}

test('expanded curriculum is future-proof and deep',()=>{
  const D=loadExpanded();
  assert.ok(D.topics.length>=120,`expected >=120 topics, got ${D.topics.length}`);
  for(const id of ['python-event-loop','python-gil','python-taskgroup','async-db-pools','ml-bias-variance','ml-metrics','cosine-similarity','yolo-architecture','iou-nms','object-tracking','anpr-end-to-end','mmc-pipeline','motion-detection','vlm-vs-vllm','vllm-serving','system-design-capacity','consistent-hashing','cdn-design','distributed-locks','saga-pattern','outbox-pattern']){
    assert.ok(D.topics.some(t=>t.id===id),`missing ${id}`);
  }
});

test('curriculum has an ordered progressive path plus a priority path',()=>{
  const D=loadExpanded();
  assert.ok(Array.isArray(D.priorityPath)&&D.priorityPath.length>=20);
  assert.ok(Array.isArray(D.curriculumPhases)&&D.curriculumPhases.length>=8);
  assert.equal(D.curriculumPhases[0].id,'foundations');
  for(const p of D.curriculumPhases){
    assert.ok(p.title&&p.goal&&Array.isArray(p.topics)&&p.topics.length>=3,p.id);
  }
});

test('glossary and project evidence are rich enough for long-term study',()=>{
  const D=loadExpanded();
  assert.ok(Array.isArray(D.glossary)&&D.glossary.length>=90,`glossary ${D.glossary&&D.glossary.length}`);
  for(const id of ['ivip','anpr','vms-events','govms','frs','rag','local-ai','kindermate','commchat','football-intelligence','ocr-runtime']){
    assert.ok(D.projects.some(p=>p.id===id),`missing project ${id}`);
  }
});

test('new topics expose terms, functions and prerequisite links where useful',()=>{
  const D=loadExpanded();
  for(const id of ['python-event-loop','python-taskgroup','postgres-explain','yolo-architecture','cosine-similarity','anpr-end-to-end','system-design-capacity']){
    const t=D.topics.find(x=>x.id===id);
    assert.ok(t,`missing ${id}`);
    assert.ok(Array.isArray(t.terms)&&t.terms.length>=2,`${id} terms`);
    assert.ok(Array.isArray(t.functions)&&t.functions.length>=1,`${id} functions`);
  }
});

test('Engineering Atlas identity and PWA contract are public-facing',()=>{
  const ROOT=path.resolve(__dirname,'..');
  for(const f of ['manifest.webmanifest','sw.js','assets/icon-192.png','assets/icon-512.png','assets/atlas-mark.svg']) assert.ok(fs.existsSync(path.join(ROOT,f)),f);
  const index=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  const start=fs.readFileSync(path.join(ROOT,'START_HERE.html'),'utf8');
  const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'manifest.webmanifest'),'utf8'));
  const sw=fs.readFileSync(path.join(ROOT,'sw.js'),'utf8');
  assert.match(index,/<title>Engineering Atlas — Systems &amp; AI Knowledge Platform<\/title>/i);
  assert.match(index,/Interactive Systems &amp; AI Knowledge Platform/i);
  assert.match(start,/Engineering Atlas/i);
  assert.equal(manifest.name,'Engineering Atlas');
  assert.equal(manifest.short_name,'Atlas');
  assert.match(sw,/engineering-atlas-v\d+/i);
  assert.match(index,/manifest\.webmanifest/);
  assert.doesNotMatch([index,start,JSON.stringify(manifest),sw].join('\n'),/Engineering Learning OS|Learning OS/i);
});

test('repository contains no target-company branding',()=>{
  const ROOT=path.resolve(__dirname,'..');
  const files=[];
  (function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(['.git','.verify'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(/\.(html|js|css|md|json|webmanifest|txt|yml|yaml)$/i.test(e.name))files.push(p);}})(ROOT);
  const joined=files.map(f=>fs.readFileSync(f,'utf8')).join('\n');
  const forbidden=new RegExp([['me','vrik'].join(''),['mave','rick'].join('')].join('|'),'i');
  assert.doesNotMatch(joined,forbidden);
});


test('all curriculum references resolve and key weak-area lessons are present',()=>{
  const D=loadExpanded();
  const ids=new Set(D.topics.map(t=>t.id));
  for(const id of D.priorityPath) assert.ok(ids.has(id),`priority path references missing topic ${id}`);
  for(const phase of D.curriculumPhases){
    for(const id of phase.topics) assert.ok(ids.has(id),`${phase.id} references missing topic ${id}`);
  }
  for(const topic of D.topics){
    for(const id of topic.prerequisites||[]) assert.ok(ids.has(id),`${topic.id} prerequisite missing ${id}`);
    for(const id of topic.nextTopics||[]) assert.ok(ids.has(id),`${topic.id} next topic missing ${id}`);
  }
  for(const id of ['python-args-kwargs','python-scope-methods','db-normalization-bcnf','sql-window-cte','docker-fundamentals','docker-network-volumes','kubernetes-core','linux-process-memory']){
    assert.ok(ids.has(id),`missing weak-area/platform topic ${id}`);
  }
});

test('mock interview bank is broad, identified, and includes follow-ups',()=>{
  const D=loadExpanded();
  assert.ok(D.mockQuestions.length>=40,`mock questions ${D.mockQuestions.length}`);
  const ids=D.mockQuestions.map(q=>q.id);
  assert.equal(new Set(ids).size,ids.length,'mock question ids must be unique');
  for(const q of D.mockQuestions){
    assert.ok(q.id&&q.category&&q.q&&Array.isArray(q.rubric)&&q.rubric.length>=3,q.id||q.q);
    assert.ok(Array.isArray(q.followUps)&&q.followUps.length>=2,`${q.id} follow-ups`);
  }
  const categories=new Set(D.mockQuestions.map(q=>q.category));
  for(const category of ['Python','Backend','PostgreSQL','Messaging','Distributed Systems','Infrastructure','Machine Learning','Computer Vision','RAG & LLM Systems','GPU Inference','Production Incidents','Architecture Leadership']) assert.ok(categories.has(category),`missing ${category}`);
});

test('every lesson belongs to a curriculum phase and content ids are unique',()=>{
  const D=loadExpanded();
  const topicIds=D.topics.map(t=>t.id),projectIds=D.projects.map(p=>p.id),cheatIds=D.cheatsheets.map(c=>c.id);
  assert.equal(new Set(topicIds).size,topicIds.length,'duplicate topic id');
  assert.equal(new Set(projectIds).size,projectIds.length,'duplicate project id');
  assert.equal(new Set(cheatIds).size,cheatIds.length,'duplicate cheat id');
  const mapped=new Set(D.curriculumPhases.flatMap(p=>p.topics));
  for(const id of topicIds) assert.ok(mapped.has(id),`orphan lesson ${id}`);
});
