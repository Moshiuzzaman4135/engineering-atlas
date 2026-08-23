const test=require('node:test');
const assert=require('node:assert/strict');
const {loadScript}=require('./helpers');

const data={topics:[{id:'kafka-deep-dive',title:'Kafka',domain:'messaging',priority:5,intuition:'i',technical:'t',interviewAnswer:'a',usedByYou:[],tradeoffs:[],failureModes:[],scaling:[],security:[],traps:[],quiz:[{q:'q',options:['a','b'],answer:0,why:'w'}],cards:[{q:'cq',a:'ca'}]}],domains:[{id:'messaging',title:'Messaging',icon:'⇄'}],projects:[],mockQuestions:[],cheatsheets:[],sources:[]};
const store={defaults:()=>({settings:{mode:'sprint',targetDate:'2026-08-25T15:00:00+06:00',motion:true},topics:{},cards:{},mock:{history:[]},notes:{},stats:{}}),load(){return this.defaults()},save(s){return s},exportState(){return '{}'},importState(){return this.defaults()},reset(){return this.defaults()}};
const sched={topicMastery:()=>0,buildStudyQueue:()=>[{id:'kafka-deep-dive',title:'Kafka',domain:'messaging',priority:5,mastery:0,dueCards:0,score:100}],domainMastery:()=>({messaging:{value:0}}),rateCard:s=>s};
const seed={window:{InterviewOSData:data,InterviewStore:store,InterviewScheduler:sched,InterviewSimulations:{MessagingSim:{run:()=>({capacity:1,backlog:0,utilizationPct:1,replay:'Strong',ordering:'Per partition',ack:'Ack',label:'sim'})},ScaleSim:{run:()=>({appUtilPct:1,dbQps:1,dbUtilPct:1,p95Ms:1,status:'healthy',label:'sim'})},DbSim:{run:()=>({scannedRows:1,primaryLoad:1,poolPressure:0,cacheMissPct:1,recommendation:'profile',label:'sim'})},HarnessSim:{run:()=>({successPct:90,latencyMs:1,costUnits:1,riskScore:1,label:'sim'})},RagSim:{run:()=>({recallPct:90,precisionPct:90,contextTokens:1,latencyMs:1,label:'sim'})},InferenceSim:{run:()=>({throughput:1,queueMs:1,p95Ms:1,gpuMemoryGB:1,label:'Synthetic simulation — not a benchmark'})}},InterviewDiagrams:{render:()=>'<svg></svg>'}}};
const box=loadScript('js/app.js',seed);
const A=box.window.InterviewApp;

test('route parser supports every top-level route and topic ids',()=>{
  const r=A.parseRoute('#/topic/kafka-deep-dive'); assert.equal(r.page,'topic'); assert.equal(r.id,'kafka-deep-dive');
  for(const page of ['dashboard','roadmap','labs','review','mock','projects','cheats','sources']) assert.equal(A.parseRoute('#/'+page).page,page);
});

test('core screens render meaningful headings',()=>{
  assert.match(A.renderScreen({page:'dashboard'}),/Today|Dashboard/i);
  assert.match(A.renderScreen({page:'roadmap'}),/Roadmap/i);
  assert.match(A.renderScreen({page:'topic',id:'kafka-deep-dive'}),/Kafka/);
  assert.match(A.renderScreen({page:'labs'}),/Lab/i);
  assert.match(A.renderScreen({page:'review'}),/Review/i);
  assert.match(A.renderScreen({page:'mock'}),/Mock/i);
  assert.match(A.renderScreen({page:'projects'}),/Project/i);
  assert.match(A.renderScreen({page:'cheats'}),/Cheat/i);
  assert.match(A.renderScreen({page:'sources'}),/Sources|Research/i);
});

test('topic screen starts with recall before explanation and has quiz/self explanation controls',()=>{
  const html=A.renderScreen({page:'topic',id:'kafka-deep-dive'});
  assert.ok(html.indexOf('Recall first') < html.indexOf('Simple intuition'));
  assert.match(html,/self-explanation/i);
  assert.match(html,/quiz-option/);
});

test('every interactive lab has a render path and labels synthetic metrics',()=>{
  for(const lab of ['messaging','scale','db','harness','rag','inference','failure']){
    const html=A.renderLab(lab);
    assert.ok(html.length>100,`${lab} lab should render`);
  }
  assert.match(A.renderLab('inference'),/not a benchmark/i);
});

test('project screen uses personalized project names and strengths',()=>{
  const d2={...data,projects:[{id:'ivip',name:'iVip / Vision Relay',summary:'video platform',flow:['FastAPI','Redis'],strengths:['producer consumer'],gaps:['no ack'],upgrade:'use streams'}]};
  const b2=loadScript('js/app.js',{window:{InterviewOSData:d2,InterviewStore:store,InterviewScheduler:sched,InterviewSimulations:{},InterviewDiagrams:{render:()=>'<svg></svg>'}}});
  const html=b2.window.InterviewApp.renderProjects();
  assert.match(html,/iVip \/ Vision Relay/);
  assert.match(html,/producer consumer/);
  assert.match(html,/no ack|use streams/);
});

test('review screen keeps answer hidden until explicit reveal control',()=>{
  const html=A.renderReview();
  assert.match(html,/Reveal answer/);
  assert.match(html,/flash-answer/);
  assert.doesNotMatch(html,/rating-row show/);
});

test('roadmap shows priority requirement coverage when requirement mappings exist',()=>{
  const d3={...data,requirements:[{skill:'Harness Optimization',status:'High-priority growth',topics:['kafka-deep-dive'],evidence:'transfer your eval work'}]};
  const b3=loadScript('js/app.js',{window:{InterviewOSData:d3,InterviewStore:store,InterviewScheduler:sched,InterviewSimulations:{MessagingSim:{run:()=>({capacity:1,backlog:0,utilizationPct:1,replay:'Strong',ordering:'x',ack:'x'})}},InterviewDiagrams:{render:()=>'<svg></svg>'}}});
  const html=b3.window.InterviewApp.renderRoadmap();
  assert.match(html,/Requirement coverage/i);
  assert.match(html,/Harness Optimization/);
  assert.match(html,/transfer your eval work/);
});

test('dashboard guides a durable active-learning journey without deadline pressure',()=>{
  const html=A.renderDashboard();
  for(const section of ['Continue Learning','Priority Interview Path','Master Curriculum','Review Due','Weak Areas','Recent Topics','Project Architectures','Interactive Labs','Mock Interview']) assert.match(html,new RegExp(section,'i'),section);
  assert.match(html,/Learn.*Explain.*Visualize.*Recall.*Apply.*Interview.*Review/is);
  assert.match(html,/0 scheduled cards/i);
  assert.match(html,/Study cycle/i);
  assert.match(html,/Recall/i);
  assert.match(html,/Lab/i);
  assert.match(html,/Mock/i);
  assert.doesNotMatch(html,/countdown|days.*hours.*min.*sec/is);
});
