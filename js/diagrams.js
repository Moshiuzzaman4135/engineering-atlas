(function(){
'use strict';
const ENT={'&':'amp','<':'lt','>':'gt','"':'quot',"'":'#39'};
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>'&'+ENT[c]+';');

/* ---------- primitives ---------- */
function defs(){return '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#52617e"/></marker><marker id="arrow-hot" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#8b5cf6"/></marker></defs>';}
function node(x,y,w,h,label,cls){return `<rect class="arch-node ${cls||''}" x="${x}" y="${y}" rx="10" width="${w}" height="${h}"/><text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle">${esc(label)}</text>`;}
function labeled(x,y,w,h,label,sub,cls){let t=`<text x="${x+w/2}" y="${sub?y+h/2-2:y+h/2+4}" text-anchor="middle" font-weight="600">${esc(label)}</text>`;if(sub)t+=`<text class="arch-label" x="${x+w/2}" y="${y+h/2+13}" text-anchor="middle">${esc(sub)}</text>`;return `<rect class="arch-node ${cls||''}" x="${x}" y="${y}" rx="10" width="${w}" height="${h}"/>${t}`;}
function edge(x1,y1,x2,y2,cls,label){const m=`url(#${/hot/.test(cls||'')?'arrow-hot':'arrow'})`;return `<path class="arch-edge ${cls||''}" d="M${x1},${y1} L${x2},${y2}" marker-end="${m}"/>${label?`<text class="arch-label" x="${(x1+x2)/2}" y="${(y1+y2)/2-5}" text-anchor="middle">${esc(label)}</text>`:''}`;}
function polyline(pts,cls,label){const d='M'+pts.map(p=>p.join(',')).join(' L');const mid=pts[Math.floor(pts.length/2)-Math.max(1,pts.length%2)];const a=pts[Math.floor((pts.length-1)/2)],b=pts[Math.ceil((pts.length-1)/2)+ (pts.length>2?0:0)]||a;const lx=(a[0]+b[0])/2,ly=(a[1]+b[1])/2;const m=`url(#${/hot/.test(cls||'')?'arrow-hot':'arrow'})`;return `<path class="arch-edge ${cls||''}" d="${d}" marker-end="${m}"/>${label?`<text class="arch-label" x="${lx}" y="${ly-5}" text-anchor="middle">${esc(label)}</text>`:''}`;}
function svgWrap(body,o){o=o||{};const id=(o.id||'diagram').replace(/[^a-z0-9-]/gi,'-');return `<svg class="arch-svg" viewBox="0 0 ${o.w||760} ${o.h||300}" role="img" aria-labelledby="${id}-t ${id}-d"><title id="${id}-t">${esc(o.title||'Diagram')}</title><desc id="${id}-d">${esc(o.desc||o.title||'')}</desc>${defs()}${body}</svg>`;}

/* ---------- named diagrams (registry; no silent fallback) ---------- */
function harness(){let b=''; b+=node(20,110,95,52,'Request');b+=node(145,110,105,52,'Context','accent');b+=node(280,35,105,52,'Router','cyan');b+=node(280,110,105,52,'LLM','accent');b+=node(280,185,105,52,'Memory','green');b+=node(430,110,105,52,'Policy');b+=node(580,40,115,52,'Tools','green');b+=node(580,110,115,52,'Verifier','cyan');b+=node(580,180,115,52,'Trace / Evals');b+=edge(115,136,145,136,'hot arch-flow');b+=edge(250,136,280,61);b+=edge(250,136,280,136,'hot arch-flow');b+=edge(250,136,280,211);b+=edge(385,136,430,136,'hot arch-flow');b+=edge(535,136,580,66);b+=edge(535,136,580,136,'hot arch-flow');b+=edge(535,136,580,206);return svgWrap(b,{w:730,h:275,title:'Agent harness control loop',desc:'A request flows through context building, routing, model call, policy, tools, verification and tracing.'});}
function queue(){let b='';b+=node(25,110,110,54,'Producers');b+=node(190,90,150,94,'Broker / Queue','accent');b+=node(405,50,120,54,'Consumer A','green');b+=node(405,130,120,54,'Consumer B','green');b+=node(590,90,115,54,'Storage / UI');b+=edge(135,137,190,137,'hot arch-flow','events');b+=edge(340,118,405,77,'arch-flow');b+=edge(340,155,405,157,'arch-flow');b+=edge(525,77,590,117);b+=edge(525,157,590,117);return svgWrap(b,{w:735,h:240,title:'Queue decouples producers from consumers',desc:'Producers append events to a broker; independent consumers drain it; results land in storage or UI.'});}
function scale(){let b='';b+=node(20,105,90,50,'Clients');b+=node(145,105,115,50,'Load Balancer','cyan');b+=node(300,50,105,50,'App 1','green');b+=node(300,125,105,50,'App N','green');b+=node(450,25,100,50,'Cache','accent');b+=node(450,115,100,50,'Queue');b+=node(610,80,105,50,'Postgres','accent');b+=edge(110,130,145,130,'hot arch-flow');b+=edge(260,130,300,75);b+=edge(260,130,300,150);b+=edge(405,75,450,50);b+=edge(405,150,450,140);b+=edge(550,50,610,105);b+=edge(550,140,610,105);return svgWrap(b,{w:740,h:220,title:'Horizontal scaling topology',desc:'Clients hit a load balancer distributing across stateless app replicas backed by cache, queue and database.'});}
function db(){let b='';b+=node(20,110,100,52,'API');b+=node(160,35,115,52,'Redis Cache','green');b+=node(160,110,115,52,'Pool','cyan');b+=node(320,110,125,52,'Primary DB','accent');b+=node(500,40,110,52,'Replica 1');b+=node(500,120,110,52,'Replica N');b+=node(640,110,90,52,'S3/MinIO');b+=edge(120,136,160,61);b+=edge(120,136,160,136,'hot arch-flow');b+=edge(275,136,320,136,'hot arch-flow');b+=edge(445,136,500,66);b+=edge(445,136,500,146);b+=edge(445,136,640,136);return svgWrap(b,{w:750,h:215,title:'Database access path',desc:'API requests try cache first, then go through a connection pool to primary and replicas; blobs live in object storage.'});}
function pipeline(){let b='';const labels=['Capture','Detect','Track','Recognize','Publish'];labels.forEach((l,i)=>{b+=node(20+i*145,105,105,52,l,i===1||i===3?'accent':'');if(i<labels.length-1)b+=edge(125+i*145,131,165+i*145,131,'arch-flow')});return svgWrap(b,{w:735,h:230,title:'Video analytics pipeline stages',desc:'Frames are captured, objects detected, tracked across frames, recognized, then published as events.'});}
function gpu(){let b='';b+=node(25,105,105,52,'Requests');b+=node(170,105,110,52,'Triton Queue','accent');b+=node(330,45,120,52,'Dynamic Batch','cyan');b+=node(330,135,120,52,'Instance Group');b+=node(515,85,145,75,'GPU','green');b+=edge(130,131,170,131,'hot arch-flow');b+=edge(280,131,330,71,'arch-flow');b+=edge(280,131,330,161,'arch-flow');b+=edge(450,71,515,112,'hot arch-flow');b+=edge(450,161,515,132,'hot arch-flow');return svgWrap(b,{w:690,h:230,title:'GPU batching path',desc:'Requests queue up, form dynamic batches, execute on model instances bound to the GPU.'});}
function eventloop(){let b='';b+=node(20,100,95,52,'Ready Queue');b+=node(155,100,105,52,'Event Loop','accent');b+=node(315,25,105,52,'Task A');b+=node(470,25,105,52,'Await DB','green');b+=node(315,100,105,52,'Task B');b+=node(470,100,105,52,'Await HTTP','green');b+=node(315,180,105,52,'Task C');b+=node(470,180,120,52,'Blocking CPU','accent');b+=node(635,100,95,52,'Responses','cyan');b+=edge(115,126,155,126,'hot arch-flow');b+=edge(260,126,315,51,'arch-flow');b+=edge(260,126,315,126,'arch-flow');b+=edge(260,126,315,206,'arch-flow');b+=edge(420,51,470,51);b+=edge(420,126,470,126);b+=edge(420,206,470,206,'hot arch-flow');b+=edge(575,51,635,126);b+=edge(575,126,635,126);b+=edge(590,206,635,126);return svgWrap(b,{w:760,h:270,title:'Event loop scheduling with one blocking task',desc:'The loop dispatches tasks; awaited I/O frees the loop; blocking CPU work stalls every other task.'});}
function planner(){let b='';b+=node(20,105,100,52,'SQL Query');b+=node(155,105,110,52,'Planner','accent');b+=node(315,35,115,52,'Seq Scan');b+=node(315,145,115,52,'Index Scan','cyan');b+=node(485,35,115,52,'All Pages');b+=node(485,145,115,52,'Matching Pages','green');b+=node(650,105,90,52,'Rows');b+=edge(120,131,155,131,'hot arch-flow');b+=edge(265,131,315,61,'arch-flow','high match');b+=edge(265,131,315,171,'arch-flow','selective');b+=edge(430,61,485,61);b+=edge(430,171,485,171);b+=edge(600,61,650,131);b+=edge(600,171,650,131);return svgWrap(b,{w:760,h:240,title:'Planner chooses between scan strategies',desc:'For selective predicates an index scan reads few pages; for high-match predicates a sequential scan wins.'});}
function decision(){let b='';const labels=['Requirements','Capacity','API & Data','Architecture','Failure & Scale','Trade-offs'];labels.forEach((l,i)=>{const x=15+i*125;b+=node(x,100,i===4?115:105,52,l,i===0?'cyan':i===3?'accent':i===4?'green':'');if(i<labels.length-1)b+=edge(x+(i===4?115:105),126,140+i*125,126,'arch-flow')});return svgWrap(b,{w:770,h:230,title:'System design method steps',desc:'Design proceeds from requirements through capacity, API/data modeling, architecture, failure analysis and trade-offs.'});}

const registry={harness,queue,broker:queue,scale,api:scale,db,pipeline,gpu,eventloop,planner,decision};

/* ---------- declarative spec renderers ---------- */
function renderFlow(v){
 let b='';
 const nodes=v.nodes||[],edges=v.edges||[];
 const pos={};
 nodes.forEach(n=>{pos[n.id]=n;b+=labeled(n.x,n.y,n.w,n.h,n.label,n.sub,n.cls);});
 edges.forEach(e=>{
  const a=pos[e.from],c=pos[e.to];
  if(!a||!c)return;
  const pts=e.points||[[a.x+a.w,a.y+a.h/2],[c.x,c.y+c.h/2]];
  b+=polyline(pts,e.cls,e.label);
 });
 return svgWrap(b,{w:v.w,h:v.h,title:v.title,desc:v.purpose,id:v.id});
}
function renderStates(v){
 let b='';const nodes=v.nodes||[],edges=v.edges||[];const pos={};
 nodes.forEach(n=>{pos[n.id]=n;if(n.start)b+=`<circle cx="${n.x-12}" cy="${n.y+n.h/2}" r="4" fill="#8b5cf6"/>`;b+=labeled(n.x,n.y,n.w,n.h,n.label,n.sub,n.cls);});
 edges.forEach(e=>{
  const a=pos[e.from],c=pos[e.to];if(!a||!c)return;
  const pts=e.points||[[a.x+a.w,a.y+a.h/2],[c.x,c.y+c.h/2]];
  b+=polyline(pts,e.cls,e.label);
 });
 return svgWrap(b,{w:v.w,h:v.h,title:v.title,desc:v.purpose,id:v.id});
}
function renderLanes(v){
 let b='';const rows=v.rows||[];const x0=170,x1=v.w-20;
 // time axis
 b+=`<text class="arch-label" x="${x0}" y="16">${esc((v.axis&&v.axis.label)||'time →')}</text>`;
 rows.forEach((r,i)=>{
  const y=34+i*64;
  b+=`<text x="10" y="${y+22}" text-anchor="start" font-weight="600">${esc(r.label)}</text>`;
  (r.segments||[]).forEach(s=>{
   const sx=x0+s.from,sx2=x0+s.to;
   b+=`<rect class="arch-node ${s.cls||''}" x="${sx}" y="${y}" rx="7" width="${Math.max(sx2-sx,4)}" height="44"/><text x="${(sx+sx2)/2}" y="${y+26}" text-anchor="middle" font-size="9px">${esc(s.label)}</text>`;
  });
 });
 (v.marks||[]).forEach((m,i)=>{
  const mx=x0+m.at;const base=34+rows.length*64;
  b+=`<path class="arch-edge" d="M${mx},28 L${mx},${base-6}" stroke-dasharray="3 4"/><text class="arch-label" x="${mx}" y="${base+(i%2?32:16)}" text-anchor="middle">${esc(m.label)}</text>`;
 });
 return svgWrap(b,{w:v.w,h:(v.h||34+rows.length*64+56),title:v.title,desc:v.purpose,id:v.id});
}
function renderVisual(v){
 if(!v)return '';
 if(typeof v==='string')return registry[v]||'';
 if(v.named)return registry[v.named]||'';
 switch(v.type){
  case 'flow':return renderFlow(v);
  case 'states':return renderStates(v);
  case 'lanes':return renderLanes(v);
  default:return '';
 }
}
function has(type){return typeof registry[type]==='function';}
function render(type){const f=registry[type];return f?f():'';}
window.InterviewDiagrams={render,renderVisual,has};
})();
