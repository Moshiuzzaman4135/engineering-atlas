const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');

test('runtime files are offline-safe and dependency free',()=>{
  const files=['index.html','css/styles.css','js/data.js','js/expanded-data.js','js/store.js','js/scheduler.js','js/simulations.js','js/diagrams.js','js/app.js'];
  for(const f of files){
    const p=path.join(ROOT,f);
    assert.ok(fs.existsSync(p),`${f} must exist`);
    const s=fs.readFileSync(p,'utf8');
    assert.doesNotMatch(s,/\bfetch\s*\(/,`${f} must not fetch network resources`);
    assert.doesNotMatch(s,/<script[^>]+type=["']module["']/i,`${f} must not use modules`);
    if(f==='index.html'){
      assert.doesNotMatch(s,/(src|href)=["']https?:\/\//i,'index must not load remote assets');
      assert.match(s,/id=["']app["']/);
      assert.match(s,/id=["']sidebar["']/);
      assert.match(s,/id=["']mobile-nav["']/);
    }
  }
});
