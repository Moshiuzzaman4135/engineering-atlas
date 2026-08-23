(function(){
  'use strict';
  const KEY='engineeringLearningOS.v2';
  let memory=null;
  const DEFAULT_TARGET='2026-08-25T15:00:00+06:00';
  function defaults(){ return {schemaVersion:1,createdAt:Date.now(),updatedAt:Date.now(),settings:{mode:'sprint',motion:true,theme:'system',targetDate:DEFAULT_TARGET,dailyGoal:8},topics:{},cards:{},mock:{history:[]},notes:{},stats:{sessions:0,minutes:0,lastOpen:Date.now()}}; }
  function mergeDefaults(s){
    const d=defaults(); s=s&&typeof s==='object'?s:{};
    return Object.assign(d,s,{settings:Object.assign(d.settings,s.settings||{}),topics:s.topics||{},cards:s.cards||{},mock:Object.assign(d.mock,s.mock||{}),notes:s.notes||{},stats:Object.assign(d.stats,s.stats||{})});
  }
  function readRaw(){ try{return window.localStorage?window.localStorage.getItem(KEY):null}catch(e){return memory;} }
  function writeRaw(v){ memory=v; try{ if(window.localStorage) window.localStorage.setItem(KEY,v); }catch(e){} }
  function load(){ const raw=readRaw(); if(!raw) return mergeDefaults(memory?JSON.parse(memory):null); try{return mergeDefaults(JSON.parse(raw));}catch(e){return defaults();} }
  function save(state){ state=mergeDefaults(state); state.updatedAt=Date.now(); writeRaw(JSON.stringify(state)); return state; }
  function reset(){ memory=null; try{if(window.localStorage)window.localStorage.removeItem(KEY)}catch(e){} return defaults(); }
  function exportState(){ return JSON.stringify(load(),null,2); }
  function importState(json){ const parsed=JSON.parse(json); if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)) throw new Error('Invalid Engineering Learning OS backup'); const state=mergeDefaults(parsed); save(state); return state; }
  window.InterviewStore={load,save,reset,exportState,importState,defaults,KEY};
})();
