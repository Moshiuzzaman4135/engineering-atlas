const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    if(['.git','node_modules','coverage','screenshots'].includes(entry.name))return [];
    const full=path.join(dir,entry.name);
    return entry.isDirectory()?walk(full):[full];
  });
}

test('release documentation describes Engineering Atlas and contributor extension points',()=>{
  const readme=fs.readFileSync(path.join(ROOT,'README.md'),'utf8');
  assert.match(readme,/^# Engineering Atlas/m);
  assert.match(readme,/Interactive Systems & AI Knowledge Platform/);
  for(const section of ['Learning approach','Curriculum','Interactive labs','Project architecture','Offline use','Development','Adding a lesson','Adding a lab','Testing','Privacy','Roadmap']){
    assert.match(readme,new RegExp(`^## ${section}`,'mi'),`README section: ${section}`);
  }
  assert.ok(fs.existsSync(path.join(ROOT,'docs','DEVELOPMENT.md')));
});

test('Pages workflow follows the current official static-site shape',()=>{
  const workflow=fs.readFileSync(path.join(ROOT,'.github','workflows','pages.yml'),'utf8');
  for(const expected of ['contents: read','pages: write','id-token: write','actions/checkout@v6','actions/configure-pages@v5','actions/upload-pages-artifact@v4','actions/deploy-pages@v4']) assert.match(workflow,new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(workflow,/path:\s*[.'"]+/);
});

test('entry-point local resources and PWA assets resolve',()=>{
  const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
  const refs=[...html.matchAll(/(?:src|href)=["']([^"'#?]+)["']/g)].map(m=>m[1]);
  for(const ref of refs){
    if(/^(?:https?:|data:|mailto:)/i.test(ref))continue;
    assert.ok(fs.existsSync(path.join(ROOT,ref)),`missing index resource: ${ref}`);
  }
  const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'manifest.webmanifest'),'utf8'));
  for(const icon of manifest.icons||[])assert.ok(fs.existsSync(path.join(ROOT,icon.src)),`missing manifest icon: ${icon.src}`);
  const sw=fs.readFileSync(path.join(ROOT,'sw.js'),'utf8');
  for(const ref of sw.match(/['"]\.\/[^'"]+['"]/g).map(x=>x.slice(1,-1))){
    const clean=ref.replace(/^\.\//,'');
    if(clean)assert.ok(fs.existsSync(path.join(ROOT,clean)),`missing service-worker resource: ${clean}`);
  }
});

test('public release has no legacy/company branding or obvious secrets',()=>{
  const textFiles=walk(ROOT).filter(f=>/\.(?:html|js|css|md|json|webmanifest|txt|ya?ml|sh|svg)$/i.test(f)&&!f.includes(`${path.sep}docs${path.sep}superpowers${path.sep}`));
  const joined=textFiles.map(f=>fs.readFileSync(f,'utf8')).join('\n');
  const forbidden=[['Engineering','Learning','OS'].join(' '),['Engineering','_Learning','_OS'].join(''),['Learning','OS'].join(' '),['Me','vrik'].join(''),['Bangla','link'].join(''),['Kol','polok'].join(''),['Tiger','IT'].join('')];
  assert.doesNotMatch(joined,new RegExp(forbidden.join('|'),'i'));
  const secretPatterns=[['A','KIA'].join('')+'[A-Z0-9]{16}',['gh','p_'].join('')+'[A-Za-z0-9]{30,}',['github','_pat_'].join('')+'[A-Za-z0-9_]{30,}',['sk','-'].join('')+'[A-Za-z0-9_-]{16,}',['BEGIN ','PRIVATE KEY'].join('')];
  assert.doesNotMatch(joined,new RegExp(secretPatterns.join('|'),'i'));
  assert.doesNotMatch(joined,/https?:\/\/[^\s/@:]+:[^\s/@]+@/i,'URL-embedded credentials');
  assert.doesNotMatch(joined,/\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/,'private IPv4 address');
  const riskyFiles=walk(ROOT).filter(f=>/(^|[\\/])\.env(?:\.|$)|\.(?:pem|p12|pfx|key)$/i.test(f));
  assert.deepEqual(riskyFiles,[]);
});
