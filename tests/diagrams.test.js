const test=require('node:test');
const assert=require('node:assert/strict');
const {loadScript}=require('./helpers');

const Diagrams=loadScript('js/diagrams.js').window.InterviewDiagrams;

test('lesson diagrams communicate the selected engineering model',()=>{
  const expectations={
    eventloop:['Event Loop','Await DB','Blocking CPU'],
    planner:['SQL Query','Planner','Seq Scan','Index Scan'],
    decision:['Requirements','Capacity','Failure &amp; Scale','Trade-offs']
  };
  for(const [type,labels] of Object.entries(expectations)){
    const svg=Diagrams.render(type);
    for(const label of labels)assert.match(svg,new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),`${type}: ${label}`);
    assert.doesNotMatch(svg,/>Capture</,`${type} must not fall back to the video pipeline`);
  }
});

test('named registry specs render SVG, never function source',()=>{
  for(const name of ['harness','queue','scale','db','pipeline','gpu','eventloop','planner','decision']){
    const svg=Diagrams.renderVisual({named:name});
    assert.match(svg,/^<svg/,`${name} must render an svg element`);
    assert.doesNotMatch(svg,/function/,`${name} must not leak function source`);
  }
  assert.equal(Diagrams.renderVisual({named:'does-not-exist'}),'');
});

test('matrix renderer lays out labeled grids with row and column headers',()=>{
  const svg=Diagrams.renderVisual({type:'matrix',id:'mx-test',w:640,title:'Partition map',
   cols:[{label:'P0'},{label:'P1'},{label:'P2'}],
   rows:[{label:'consumer-1',cells:[{label:'owned',cls:'green'},{label:'owned',cls:'green'},null]},
         {label:'consumer-2',cells:[null,{label:'revoked',cls:'accent',dash:true},{label:'owned',cls:'green'}]}],
   notes:['one cell = partition owned by that consumer'],
   purpose:'show ownership'});
  assert.match(svg,/>P0</);assert.match(svg,/>consumer-1</);assert.match(svg,/>revoked</);assert.match(svg,/partition map/i);
});

test('plot renderer maps data coordinates onto axes',()=>{
  const svg=Diagrams.renderVisual({type:'plot',id:'pl-test',w:640,h:320,title:'Latency vs load',
   x:{label:'utilization %',min:0,max:100},y:{label:'p95 ms',min:0,max:1000},
   series:[{points:[[0,50],[60,80],[90,300],[100,950]],label:'p95',cls:'hot'}],
   vlines:[{x:70,label:'knee'}],markers:[{x:70,y:150,label:'target'}],
   purpose:'show knee'});
  assert.match(svg,/utilization %/);assert.match(svg,/>p95</);assert.match(svg,/>knee</);assert.match(svg,/<path[^>]*marker/);
});
