(function(){
  'use strict';
  const KEY='engineeringAtlas.v3';
  const LEGACY_KEY='engineeringLearningOS.v2';
  let memory=null;
  function defaults(){ return {product:'engineering-atlas',schemaVersion:2,createdAt:Date.now(),updatedAt:Date.now(),settings:{mode:'long',motion:true,theme:'system',targetDate:'',dailyGoal:8},topics:{},cards:{},mock:{history:[]},notes:{},stats:{sessions:0,minutes:0,lastOpen:Date.now()}}; }
  const record=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
  function mergeDefaults(s){
    const d=defaults(); s=record(s)?s:{};
    return Object.assign(d,s,{product:'engineering-atlas',schemaVersion:2,settings:Object.assign(d.settings,record(s.settings)?s.settings:{}),topics:record(s.topics)?s.topics:{},cards:record(s.cards)?s.cards:{},mock:Object.assign(d.mock,record(s.mock)?s.mock:{}),notes:record(s.notes)?s.notes:{},stats:Object.assign(d.stats,record(s.stats)?s.stats:{})});
  }
  function readRaw(){ try{return window.localStorage?window.localStorage.getItem(KEY):null}catch(e){return memory;} }
  function writeRaw(v){ memory=v; try{ if(window.localStorage) window.localStorage.setItem(KEY,v); }catch(e){} }
  function migrateLegacy(){
    try{
      if(!window.localStorage)return null;
      const raw=window.localStorage.getItem(LEGACY_KEY);
      if(!raw)return null;
      const state=mergeDefaults(JSON.parse(raw));
      writeRaw(JSON.stringify(state));
      window.localStorage.removeItem(LEGACY_KEY);
      return state;
    }catch(e){return null;}
  }
  function load(){ const raw=readRaw(); if(!raw)return migrateLegacy()||mergeDefaults(memory?JSON.parse(memory):null); try{return mergeDefaults(JSON.parse(raw));}catch(e){return defaults();} }
  function save(state){ state=mergeDefaults(state); state.updatedAt=Date.now(); writeRaw(JSON.stringify(state)); return state; }
  function reset(){ memory=null; try{if(window.localStorage){window.localStorage.removeItem(KEY);window.localStorage.removeItem(LEGACY_KEY);}}catch(e){} return defaults(); }
  function exportState(){ return JSON.stringify(load(),null,2); }
  function validBackup(parsed){
    if(!record(parsed)||!record(parsed.topics)||!record(parsed.cards))return false;
    if(parsed.settings&&!record(parsed.settings))return false;
    if(parsed.settings&&parsed.settings.mode&&!['sprint','long'].includes(parsed.settings.mode))return false;
    if(parsed.settings&&parsed.settings.theme&&!['system','dark','light'].includes(parsed.settings.theme))return false;
    if(parsed.notes&&!record(parsed.notes))return false;
    if(parsed.mock&&(!record(parsed.mock)||!Array.isArray(parsed.mock.history||[])))return false;
    return Object.values(parsed.topics).every(record)&&Object.values(parsed.cards).every(record);
  }
  function importState(json){ const parsed=JSON.parse(json); if(!validBackup(parsed)) throw new Error('Invalid Engineering Atlas backup'); const state=mergeDefaults(parsed); save(state); return state; }
  window.InterviewStore={load,save,reset,exportState,importState,defaults,KEY};
})();
