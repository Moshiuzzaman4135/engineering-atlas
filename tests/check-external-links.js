#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');

const ROOT=path.resolve(__dirname,'..');
const files=['README.md','docs/GITHUB_PAGES.md','docs/SOURCE_NOTES.md','js/data.js','js/expanded-data.js'];
const urls=[...new Set(files.flatMap(file=>[...fs.readFileSync(path.join(ROOT,file),'utf8').matchAll(/https:\/\/[^\s'"<>`)]+/g)].map(m=>m[0].replace(/[.,;:]$/,''))))]
  .filter(url=>!url.includes('moshiuzzaman4135.github.io/engineering-atlas'));

async function check(url){
  for(const method of ['HEAD','GET']){
    try{
      const response=await fetch(url,{method,redirect:'follow',signal:AbortSignal.timeout(15000),headers:{'user-agent':'Engineering-Atlas-Link-Check'}});
      if(response.status!==405||method==='GET')return {url,status:response.status,ok:response.status<500&&response.status!==404,final:response.url};
    }catch(error){if(method==='GET')return {url,status:'network-error',ok:false,error:error.message};}
  }
}

(async()=>{
  const results=[];
  for(let i=0;i<urls.length;i+=6)results.push(...await Promise.all(urls.slice(i,i+6).map(check)));
  const failed=results.filter(result=>!result.ok);
  console.log(JSON.stringify({checked:results.length,failed,redirected:results.filter(result=>result.final&&result.final!==result.url).length},null,2));
  process.exitCode=failed.length?1:0;
})();
