const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {loadScript}=require('./helpers');

const data={topics:[{id:'kafka-deep-dive',title:'Kafka',domain:'messaging',priority:5,intuition:'i',technical:'t',interviewAnswer:'a',usedByYou:[],tradeoffs:[],failureModes:[],scaling:[],security:[],traps:[],quiz:[{q:'q',options:['a','b'],answer:0,why:'w'}],cards:[{q:'cq',a:'ca'}]}],domains:[{id:'messaging',title:'Messaging',icon:'⇄'}],projects:[],mockQuestions:[],cheatsheets:[],sources:[]};
const store={defaults:()=>({settings:{mode:'sprint',targetDate:'2026-08-25T15:00:00+06:00',motion:true},topics:{},cards:{},mock:{history:[]},notes:{},stats:{}}),load(){return this.defaults()},save(s){return s},exportState(){return '{}'},importState(){return this.defaults()},reset(){return this.defaults()}};
const sched={topicMastery:()=>0,buildStudyQueue:()=>[{id:'kafka-deep-dive',title:'Kafka',domain:'messaging',priority:5,mastery:0,dueCards:0,score:100}],domainMastery:()=>({messaging:{value:0}}),rateCard:s=>s};
const seed={window:{InterviewOSData:data,InterviewStore:store,InterviewScheduler:sched,InterviewSimulations:{MessagingSim:{run:()=>({capacity:1,backlog:0,utilizationPct:1,replay:'Strong',ordering:'Per partition',ack:'Ack',label:'sim'})},ScaleSim:{run:()=>({appUtilPct:1,dbQps:1,dbUtilPct:1,p95Ms:1,status:'healthy',label:'sim'})},DbSim:{run:()=>({scannedRows:1,primaryLoad:1,poolPressure:0,cacheMissPct:1,recommendation:'profile',label:'sim'})},HarnessSim:{run:()=>({successPct:90,latencyMs:1,costUnits:1,riskScore:1,label:'sim'})},RagSim:{run:()=>({recallPct:90,precisionPct:90,contextTokens:1,latencyMs:1,label:'sim'})},InferenceSim:{run:()=>({throughput:1,queueMs:1,p95Ms:1,gpuMemoryGB:1,label:'Synthetic simulation — not a benchmark'})}},InterviewDiagrams:{render:()=>'<svg></svg>'}}};
Object.assign(seed.window.InterviewSimulations,{
  AsyncSim:{run:()=>({inFlight:1,ioCapacity:1,eventLoopPressurePct:1,p95Ms:1,status:'healthy',label:'sim'})},
  CosineSim:{run:()=>({dot:1,cosine:1,angleDeg:0,match:'strong',label:'sim'})},
  YoloSim:{run:()=>({precisionPct:1,recallPct:1,candidates:1,kept:1,duplicateRisk:1,missRisk:1,label:'sim'})},
  CapacitySim:{run:()=>({inFlight:1,capacity:1,utilizationPct:1,recommendedReplicas:1,label:'sim'})},
  BackpressureSim:{run:()=>({capacity:1,queueGrowthPerSec:0,bufferFillSeconds:0,droppedPerSec:0,status:'stable',label:'sim'})},
  LoadBalancerSim:{run:()=>({healthyReplicas:1,averageRps:1,hottestRps:1,hottestUtilizationPct:1,status:'healthy',label:'sim'})},
  PlannerSim:{run:()=>({plan:'Index Scan',rowsMatched:1,rowsScanned:1,seqCost:1,indexCost:1,reason:'selective',label:'sim'})},
  AnprCapacitySim:{run:()=>({sampledFps:1,capacityFps:1,queueGrowthPerSec:0,gpuUtilizationPct:1,status:'stable',label:'sim'})}
});
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
  for(const lab of ['python','backpressure','db','messaging','loadbalancer','planner','cosine','rag','harness','inference','yolo','anpr','capacity','failure']){
    const html=A.renderLab(lab);
    assert.ok(html.length>100,`${lab} lab should render`);
  }
  assert.match(A.renderLab('inference'),/not a benchmark/i);
});

test('lab sliders have programmatically associated labels',()=>{
  const html=A.renderLab('backpressure');
  assert.match(html,/label for="lab-producerRate"/);
  assert.match(html,/input id="lab-producerRate"[^>]+data-lab-input="producerRate"/);
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

test('mock interview reveals category and follow-up questions',()=>{
  const d4={...data,mockQuestions:[{id:'python-1',type:'rapid',category:'Python',q:'Does async mean parallel?',rubric:['Concurrency','I/O','CPU'],followUps:['What blocks the loop?','When use processes?']}]};
  const b4=loadScript('js/app.js',{window:{InterviewOSData:d4,InterviewStore:store,InterviewScheduler:sched,InterviewSimulations:{},InterviewDiagrams:{render:()=>'<svg></svg>'}}});
  const html=b4.window.InterviewApp.renderMock();
  assert.match(html,/Python/);
  assert.match(html,/Follow-up questions/);
  assert.match(html,/What blocks the loop/);
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

test('settings expose system, dark, and light themes',()=>{
  const html=A.renderSources();
  assert.match(html,/data-setting="theme"/);
  for(const value of ['system','dark','light']) assert.match(html,new RegExp(`value="${value}"`));
});

test('top bar exposes an explicit persisted theme toggle',()=>{
  const html=fs.readFileSync('index.html','utf8');
  assert.match(html,/data-action="toggle-theme"/);
  assert.match(html,/aria-label="Switch to (dark|light) theme"/);
});
