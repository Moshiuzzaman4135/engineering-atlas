const test=require('node:test');
const assert=require('node:assert/strict');
const {loadScript}=require('./helpers');

const Diagrams=loadScript('js/diagrams.js').window.InterviewDiagrams;
const window={};
for(const f of ['js/data.js','js/expanded-data.js'])
  new Function('window',require('fs').readFileSync(f,'utf8'))(window);
const D=window.InterviewOSData;

// Lessons that passed the visual quality bar. Ratchet: add ids only after
// purpose-built, semantically validated visuals exist.
const APPROVED=['python-coroutines-tasks','python-event-loop','python-taskgroup','python-cancellation-timeouts','async-semaphore-queue','python-gil','python-threading','python-multiprocessing','python-iterators-generators','python-exceptions','python-oop-solid','python-object-model','python-mutable-immutable','python-copying','python-closures-decorators','python-context-managers','python-typing-dataclasses','python-args-kwargs','python-scope-methods','python-profiling','fastapi-lifecycle','async-db-pools'];

test('generic diagram fallback is removed at the root',()=>{
  assert.equal(Diagrams.render('generic'),'','unknown/generic keys must not render a fake pipeline');
  assert.equal(Diagrams.render('nonexistent-type'),'');
  assert.match(Diagrams.render('pipeline'),/Capture/,'pipeline renderer remains available for real vision lessons');
});

test('approved lessons ship topic-specific visuals with teaching apparatus',()=>{
  for(const id of APPROVED){
    const t=D.topics.find(x=>x.id===id);
    assert.ok(t,`lesson ${id} exists`);
    assert.ok(Array.isArray(t.visuals)&&t.visuals.length>=2,`${id} has multiple explicit visuals`);
    for(const v of t.visuals){
      const svg=Diagrams.renderVisual(v);
      assert.ok(svg&&svg.startsWith('<svg'),`${id}: visual "${v.title}" renders`);
      assert.match(svg,new RegExp(`<title id="[^"]+t">${v.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}`),'visual carries an accessible title');
      assert.ok(v.purpose&&v.purpose.length>40,'visual states a specific purpose');
    }
  }
});

test('coroutine lesson: primary visuals teach coroutine/task/future semantics',()=>{
  const t=D.topics.find(x=>x.id==='python-coroutines-tasks');
  const all=()=>t.visuals.map(v=>Diagrams.renderVisual(v)).join('');
  const required=['Coroutine object','Task','Future','Event Loop'];
  for(const term of required)
    assert.match(all(),new RegExp(term),'expected concept missing from visuals: '+term);
  // state vocabulary appears in the lifecycle visual
  const statesSvg=Diagrams.renderVisual(t.visuals[2]);
  for(const term of ['pending','running','suspended','done','cancelled'])
    assert.match(statesSvg,new RegExp(term),'task-lifecycle visual lacks state: '+term);
  // timeline shows scheduling + suspension
  const lanesSvg=Diagrams.renderVisual(t.visuals[1]);
  assert.match(lanesSvg,/create_task/);
  assert.match(lanesSvg,/suspended/);
});

test('coroutine lesson: no computer-vision pipeline leakage in its visuals',()=>{
  const t=D.topics.find(x=>x.id==='python-coroutines-tasks');
  const all=t.visuals.map(v=>Diagrams.renderVisual(v)).join('');
  for(const bad of ['Capture','Detect','Track','Recognize','Publish'])
    assert.doesNotMatch(all,new RegExp('>'+bad),`CV pipeline term leaked into ${t.id} visuals: ${bad}`);
});

test('wave-2 lessons: visuals carry their defining semantics',()=>{
  const all=id=>D.topics.find(x=>x.id===id).visuals.map(v=>Diagrams.renderVisual(v)).join('');
  assert.match(all('python-object-model'),/rebind/i);
  assert.match(all('python-mutable-immutable'),/TypeError/);
  assert.match(all('python-copying'),/deepcopy/);
  assert.match(all('python-closures-decorators'),/__closure__|cell/i);
  assert.match(all('python-context-managers'),/__exit__/);
  assert.match(all('python-typing-dataclasses'),/__hash__/);
  assert.match(all('python-args-kwargs'),/KEYWORD_ONLY/);
  assert.match(all('python-scope-methods'),/Enclosing|nonlocal/i);
  assert.match(all('python-profiling'),/cumtime|tottime/i);
  assert.match(all('fastapi-lifecycle'),/lifespan/i);
  assert.match(all('async-db-pools'),/reset|acquire/i);
});
