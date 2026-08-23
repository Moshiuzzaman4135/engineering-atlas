(function(){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const round=n=>Math.round(n*10)/10;

const MessagingSim={run(c){
  c=Object.assign({broker:'kafka',rate:1000,consumers:4,consumerRate:300},c||{});
  const capacity=Math.max(1,c.consumers*c.consumerRate);
  const backlog=Math.max(0,c.rate-capacity);
  const meta={
    kafka:{ordering:'Per partition',replay:'Strong',ack:'Offset + app idempotency',durability:'High'},
    rabbit:{ordering:'Queue delivery order (redelivery can reorder)',replay:'Limited',ack:'Manual ACK + confirms',durability:'High with quorum'},
    streams:{ordering:'Stream ID',replay:'Strong within retention',ack:'XACK + pending entries',durability:'Redis persistence dependent'},
    zset:{ordering:'Score order',replay:'Manual',ack:'Application-managed',durability:'Redis persistence dependent'},
    mqtt:{ordering:'Topic/QoS dependent',replay:'Limited',ack:'QoS dependent',durability:'Broker/config dependent'}
  }[c.broker]||{};
  return Object.assign({label:'Synthetic simulation — not a benchmark',capacity,backlog,utilizationPct:round(clamp(c.rate/capacity*100,0,999)),queueGrowthPerSec:backlog},meta);
}};

const ScaleSim={run(c){
  c=Object.assign({rps:800,replicas:3,cacheHit:.4,dbCapacity:500,appCapacityPerReplica:350},c||{});
  const appCap=Math.max(1,c.replicas*c.appCapacityPerReplica);
  const appUtil=clamp(c.rps/appCap,0,3);
  const dbQps=c.rps*(1-clamp(c.cacheHit,0,.98));
  const dbUtil=clamp(dbQps/Math.max(1,c.dbCapacity),0,4);
  const pressure=Math.max(appUtil,dbUtil);
  const p95=45 + 85*Math.pow(appUtil,2) + 140*Math.pow(dbUtil,2) + (pressure>1?(pressure-1)*650:0);
  return {label:'Synthetic simulation — not a benchmark',appCapacity:appCap,appUtilPct:round(appUtil*100),dbQps:round(dbQps),dbUtilPct:round(dbUtil*100),p95Ms:Math.round(p95),status:pressure<.75?'healthy':pressure<1?'warm':'overloaded'};
}};

const DbSim={run(c){
  c=Object.assign({rows:1e6,selectivity:.01,index:false,cacheHit:0,pool:50,replicas:0,readRatio:.8},c||{});
  const select=clamp(c.selectivity,.000001,1);
  const scanned=c.index?Math.max(20,Math.ceil(c.rows*select*1.15)):c.rows;
  const uncached=1-clamp(c.cacheHit,0,.98);
  const readPrimaryFraction=c.replicas>0?1/(c.replicas+1):1;
  const queryCost=(scanned/c.rows)*100;
  const connectionPenalty=c.pool>80?(c.pool-80)*.45:0;
  const primaryLoad=queryCost*uncached*(1-c.readRatio+c.readRatio*readPrimaryFraction)+connectionPenalty;
  return {label:'Synthetic simulation — not a benchmark',scannedRows:Math.round(scanned),primaryLoad:round(primaryLoad),poolPressure:round(connectionPenalty),cacheMissPct:round(uncached*100),recommendation:!c.index?'Add/validate a selective index after EXPLAIN ANALYZE':c.pool>80?'Bound the pool; too many connections can increase contention':'Profile the next expensive query'};
}};

const HarnessSim={run(c){
  c=Object.assign({routing:false,rag:false,memory:false,retries:false,verifier:false,guardrails:false},c||{});
  let success=58,lat=620,cost=1,context=2800,risk=32;
  if(c.routing){success+=5;lat+=35;cost-=.08;}
  if(c.rag){success+=10;lat+=120;cost+=.18;context+=1800;}
  if(c.memory){success+=5;lat+=60;cost+=.08;context+=900;}
  if(c.retries){success+=7;lat+=220;cost+=.35;}
  if(c.verifier){success+=8;lat+=180;cost+=.28;risk-=8;}
  if(c.guardrails){success+=3;lat+=45;cost+=.04;risk-=15;}
  return {label:'Synthetic simulation — not a benchmark',successPct:round(clamp(success,0,99)),latencyMs:Math.round(lat),costUnits:round(Math.max(.2,cost)),contextTokens:context,riskScore:clamp(risk,1,100)};
}};

const InferenceSim={run(c){
  c=Object.assign({batch:1,concurrency:1,instances:1,quantization:false},c||{});
  const batch=clamp(Number(c.batch)||1,1,64), conc=clamp(Number(c.concurrency)||1,1,256), inst=clamp(Number(c.instances)||1,1,8);
  const quant=c.quantization?1.32:1;
  const throughput=42*inst*quant*(1+Math.log2(batch)*.48)*Math.min(1.35,.55+Math.log2(conc+1)*.18);
  const queue=Math.max(0,(conc-inst*batch))*4 + Math.max(0,batch-1)*2.5;
  const compute=85/(quant*(1+Math.log2(batch)*.12));
  const memory=round(inst*(c.quantization?5.4:9.2)+batch*.18);
  return {label:'Synthetic simulation — not a benchmark',throughput:Math.round(throughput),queueMs:Math.round(queue),computeMs:Math.round(compute),p95Ms:Math.round(compute+queue+18),gpuMemoryGB:memory};
}};

const RagSim={run(c){
  c=Object.assign({topK:5,chunk:700,rerank:true,queryRewrite:true},c||{});
  let recall=62+Math.min(18,c.topK*2.4)+(c.queryRewrite?7:0);
  let precision=84-Math.max(0,c.topK-4)*3+(c.rerank?11:0);
  const context=Math.round(c.topK*c.chunk*.72);
  const latency=85+c.topK*10+(c.rerank?95:0)+(c.queryRewrite?120:0);
  return {label:'Synthetic simulation — not a benchmark',recallPct:round(clamp(recall,0,98)),precisionPct:round(clamp(precision,20,98)),contextTokens:context,latencyMs:latency};
}};


const AsyncSim={run(c){
  c=Object.assign({rps:200,ioMs:80,limit:40,cpuMs:2},c||{});
  const rps=Math.max(1,Number(c.rps)||1),io=Math.max(0,Number(c.ioMs)||0),limit=Math.max(1,Number(c.limit)||1),cpu=Math.max(0,Number(c.cpuMs)||0);
  const inFlight=round(rps*(io+cpu)/1000);
  const ioCapacity=limit/Math.max(.001,(io+cpu)/1000);
  const eventPressure=clamp(rps*cpu/10,0,100);
  const saturation=clamp(rps/ioCapacity,0,5);
  const queue=Math.max(0,Math.round((saturation-1)*io*2));
  const p95=Math.round(io+cpu+queue+(eventPressure>70?(eventPressure-70)*3:0));
  return {label:'Synthetic simulation — not a benchmark',inFlight,ioCapacity:Math.round(ioCapacity),eventLoopPressurePct:round(eventPressure),queueMs:queue,p95Ms:p95,status:eventPressure>85||saturation>1.2?'overloaded':eventPressure>60||saturation>.85?'warm':'healthy'};
}};

const CosineSim={run(c){
  c=Object.assign({ax:1,ay:0,bx:1,by:0},c||{});
  const ax=Number(c.ax)||0,ay=Number(c.ay)||0,bx=Number(c.bx)||0,by=Number(c.by)||0;
  const dot=ax*bx+ay*by,na=Math.hypot(ax,ay),nb=Math.hypot(bx,by);
  const cos=na&&nb?clamp(dot/(na*nb),-1,1):0;
  const angle=Math.acos(clamp(cos,-1,1))*180/Math.PI;
  return {label:'Synthetic geometry — not a model benchmark',dot:round(dot),normA:round(na),normB:round(nb),cosine:round(cos),angleDeg:round(angle),match:cos>=.8?'strong':cos>=.5?'possible':'weak'};
}};

const YoloSim={run(c){
  c=Object.assign({confidence:.4,iou:.5,crowding:.4},c||{});
  const conf=clamp(Number(c.confidence)||0,0,1),iou=clamp(Number(c.iou)||0,0,1),crowd=clamp(Number(c.crowding)||0,0,1);
  const recall=clamp(96-conf*55-(.55-iou)*12*crowd,20,99);
  const precision=clamp(48+conf*48+(0.55-iou)*18-(crowd*8),25,99);
  const candidates=Math.max(2,Math.round(36*(1-conf*.72)*(1+crowd*.55)));
  const kept=Math.max(1,Math.round(candidates*(.35+iou*.45)));
  return {label:'Synthetic detector-threshold simulation — not a benchmark',precisionPct:round(precision),recallPct:round(recall),candidates,kept,duplicateRisk:round(clamp(iou*100+crowd*20,0,100)),missRisk:round(clamp(conf*100+(0.45-iou)*15,0,100))};
}};

const CapacitySim={run(c){
  c=Object.assign({rps:500,latencyMs:200,replicas:2,capacityPerReplica:300,headroom:.3},c||{});
  const rps=Math.max(0,Number(c.rps)||0),lat=Math.max(1,Number(c.latencyMs)||1),replicas=Math.max(1,Number(c.replicas)||1),per=Math.max(1,Number(c.capacityPerReplica)||1);
  const capacity=replicas*per,util=rps/capacity,inFlight=round(rps*lat/1000),headroom=clamp(Number(c.headroom)||0,0,.8);
  const recommended=Math.max(1,Math.ceil(rps/(per*(1-headroom||.01))));
  return {label:'Synthetic capacity planning — not a benchmark',inFlight,capacity,utilizationPct:round(util*100),recommendedReplicas:recommended,headroomPct:round(headroom*100),status:util<.7?'healthy':util<1?'warm':'overloaded'};
}};

const BackpressureSim={run(c){
  c=Object.assign({producerRate:1200,consumers:4,consumerRate:250,buffer:1000,shedding:false},c||{});
  const capacity=Math.max(1,Number(c.consumers)*Number(c.consumerRate));
  const gap=Math.max(0,Number(c.producerRate)-capacity);
  const buffer=Math.max(0,Number(c.buffer)||0);
  return {label:'Synthetic queue model — not a benchmark',capacity,queueGrowthPerSec:gap,bufferFillSeconds:gap?round(buffer/gap):0,droppedPerSec:c.shedding?gap:0,status:gap?(c.shedding?'protected':'unstable'):'stable'};
}};

const LoadBalancerSim={run(c){
  c=Object.assign({rps:900,replicas:3,unhealthy:0,skew:0,capacityPerReplica:500},c||{});
  const healthy=Math.max(1,Number(c.replicas)-Number(c.unhealthy));
  const average=Number(c.rps)/healthy;
  const hottest=average*(1+clamp(Number(c.skew)||0,0,1)*Math.max(0,healthy-1));
  const utilization=hottest/Math.max(1,Number(c.capacityPerReplica));
  return {label:'Synthetic traffic distribution — not a benchmark',healthyReplicas:healthy,averageRps:round(average),hottestRps:round(hottest),hottestUtilizationPct:round(utilization*100),p95Ms:Math.round(35+55*utilization*utilization+(utilization>1?(utilization-1)*500:0)),status:utilization<.75?'healthy':utilization<1?'warm':'overloaded'};
}};

const PlannerSim={run(c){
  c=Object.assign({rows:1000000,selectivity:.01,index:true,correlation:.5},c||{});
  const rows=Math.max(1,Number(c.rows)||1),selectivity=clamp(Number(c.selectivity)||0,.000001,1),matched=Math.max(1,Math.round(rows*selectivity));
  const seqCost=rows,indexCost=50+matched*(4-3*clamp(Number(c.correlation)||0,0,1));
  const useIndex=!!c.index&&indexCost<seqCost*.85;
  return {label:'Synthetic planner intuition — not PostgreSQL cost units',plan:useIndex?'Index Scan':'Seq Scan',rowsMatched:matched,rowsScanned:useIndex?matched:rows,seqCost:Math.round(seqCost),indexCost:Math.round(indexCost),reason:!c.index?'No usable index':useIndex?'Selective lookup is cheaper':'Broad/random heap access makes the index unattractive'};
}};

const AnprCapacitySim={run(c){
  c=Object.assign({cameras:100,fps:25,sampleEvery:5,batch:10,inferenceMs:100,gpus:2},c||{});
  const sampled=Number(c.cameras)*Number(c.fps)/Math.max(1,Number(c.sampleEvery));
  const capacity=Number(c.gpus)*Number(c.batch)/(Math.max(1,Number(c.inferenceMs))/1000);
  const gap=Math.max(0,sampled-capacity),util=sampled/Math.max(1,capacity);
  return {label:'Synthetic ANPR capacity model — not a benchmark',sampledFps:round(sampled),capacityFps:round(capacity),queueGrowthPerSec:round(gap),gpuUtilizationPct:round(clamp(util*100,0,999)),status:gap?'under-capacity':util>.8?'warm':'stable'};
}};

window.InterviewSimulations={MessagingSim,ScaleSim,DbSim,HarnessSim,InferenceSim,RagSim,AsyncSim,CosineSim,YoloSim,CapacitySim,BackpressureSim,LoadBalancerSim,PlannerSim,AnprCapacitySim};
})();
