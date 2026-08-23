const test=require('node:test');
const assert=require('node:assert/strict');
const {loadScript}=require('./helpers');
const box=loadScript('js/simulations.js');
const S=box.window.InterviewSimulations;

test('scale simulation rewards cache and replicas',()=>{
  const a=S.ScaleSim.run({rps:1000,replicas:2,cacheHit:0,dbCapacity:500});
  const b=S.ScaleSim.run({rps:1000,replicas:4,cacheHit:.7,dbCapacity:500});
  assert.ok(b.dbQps<a.dbQps); assert.ok(b.p95Ms<a.p95Ms);
});

test('db simulation reduces scanned rows with index and replicas reduce primary reads',()=>{
  const a=S.DbSim.run({rows:1000000,selectivity:.01,index:false,cacheHit:0,pool:100,replicas:0});
  const b=S.DbSim.run({rows:1000000,selectivity:.01,index:true,cacheHit:.5,pool:30,replicas:2});
  assert.ok(b.scannedRows<a.scannedRows); assert.ok(b.primaryLoad<a.primaryLoad);
});

test('harness verification improves reliability at latency/cost tradeoff',()=>{
  const a=S.HarnessSim.run({routing:false,rag:false,memory:false,retries:false,verifier:false,guardrails:false});
  const b=S.HarnessSim.run({routing:true,rag:true,memory:true,retries:true,verifier:true,guardrails:true});
  assert.ok(b.successPct>a.successPct); assert.ok(b.latencyMs>a.latencyMs); assert.ok(b.costUnits>a.costUnits);
});

test('inference batching raises throughput but queue wait can raise p95',()=>{
  const a=S.InferenceSim.run({batch:1,concurrency:1,instances:1,quantization:false});
  const b=S.InferenceSim.run({batch:8,concurrency:16,instances:2,quantization:false});
  assert.ok(b.throughput>a.throughput); assert.ok(b.queueMs>=a.queueMs);
});

test('messaging simulation reflects delivery guarantees',()=>{
  const kafka=S.MessagingSim.run({broker:'kafka',rate:1200,consumers:4,consumerRate:250});
  const z=S.MessagingSim.run({broker:'zset',rate:1200,consumers:4,consumerRate:250});
  assert.equal(kafka.replay,'Strong'); assert.equal(z.ack,'Application-managed');
});

test('async simulation shows blocking work and concurrency caps',()=>{
  assert.ok(S.AsyncSim,'AsyncSim missing');
  const healthy=S.AsyncSim.run({rps:200,ioMs:80,limit:40,cpuMs:1});
  const blocked=S.AsyncSim.run({rps:200,ioMs:80,limit:40,cpuMs:18});
  assert.ok(blocked.eventLoopPressurePct>healthy.eventLoopPressurePct);
  assert.ok(blocked.p95Ms>healthy.p95Ms);
});

test('cosine simulation is invariant to vector magnitude',()=>{
  assert.ok(S.CosineSim,'CosineSim missing');
  const a=S.CosineSim.run({ax:1,ay:1,bx:2,by:2});
  const b=S.CosineSim.run({ax:10,ay:10,bx:2,by:2});
  assert.equal(a.cosine,1);
  assert.equal(b.cosine,1);
});

test('yolo threshold simulation exposes precision recall tradeoff',()=>{
  assert.ok(S.YoloSim,'YoloSim missing');
  const low=S.YoloSim.run({confidence:.2,iou:.7,crowding:.7});
  const high=S.YoloSim.run({confidence:.8,iou:.3,crowding:.7});
  assert.ok(low.recallPct>high.recallPct);
  assert.ok(high.precisionPct>=low.precisionPct);
});

test('capacity simulation follows littles law and replica utilization',()=>{
  assert.ok(S.CapacitySim,'CapacitySim missing');
  const one=S.CapacitySim.run({rps:500,latencyMs:200,replicas:1,capacityPerReplica:300});
  const four=S.CapacitySim.run({rps:500,latencyMs:200,replicas:4,capacityPerReplica:300});
  assert.equal(one.inFlight,100);
  assert.ok(four.utilizationPct<one.utilizationPct);
});

test('backpressure simulation exposes an unstable producer consumer gap',()=>{
  const r=S.BackpressureSim.run({producerRate:1200,consumers:4,consumerRate:250,buffer:1000,shedding:false});
  assert.equal(r.capacity,1000);
  assert.equal(r.queueGrowthPerSec,200);
  assert.equal(r.bufferFillSeconds,5);
  assert.equal(r.status,'unstable');
});

test('load balancer simulation makes unhealthy replicas and skew visible',()=>{
  const r=S.LoadBalancerSim.run({rps:900,replicas:3,unhealthy:1,skew:0,capacityPerReplica:500});
  assert.equal(r.healthyReplicas,2);
  assert.equal(r.averageRps,450);
  assert.equal(r.hottestRps,450);
  assert.equal(r.hottestUtilizationPct,90);
});

test('query planner chooses an index only when estimated work wins',()=>{
  const selective=S.PlannerSim.run({rows:1000000,selectivity:.001,index:true,correlation:.8});
  const broad=S.PlannerSim.run({rows:1000000,selectivity:.7,index:true,correlation:0});
  assert.equal(selective.plan,'Index Scan');
  assert.equal(selective.rowsScanned,1000);
  assert.equal(broad.plan,'Seq Scan');
  assert.equal(broad.rowsScanned,1000000);
});

test('ANPR capacity simulation separates sampled input from GPU throughput',()=>{
  const r=S.AnprCapacitySim.run({cameras:100,fps:25,sampleEvery:5,batch:10,inferenceMs:100,gpus:2});
  assert.equal(r.sampledFps,500);
  assert.equal(r.capacityFps,200);
  assert.equal(r.queueGrowthPerSec,300);
  assert.equal(r.status,'under-capacity');
});
