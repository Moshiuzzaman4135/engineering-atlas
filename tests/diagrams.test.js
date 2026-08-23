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
