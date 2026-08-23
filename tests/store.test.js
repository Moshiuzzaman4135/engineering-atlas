const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScript } = require('./helpers');

function fakeStorage() {
  const map = new Map();
  return {
    getItem:k => map.has(k) ? map.get(k) : null,
    setItem:(k,v) => map.set(k,String(v)),
    removeItem:k => map.delete(k)
  };
}

test('store loads defaults and persists settings', () => {
  const storage = fakeStorage();
  const box = loadScript('js/store.js', { localStorage: storage });
  const Store = box.window.InterviewStore;
  const initial = Store.load();
  assert.equal(initial.schemaVersion, 2);
  assert.equal(initial.settings.mode, 'long');
  initial.settings.motion = false;
  Store.save(initial);
  assert.equal(Store.load().settings.motion, false);
});

test('store works when localStorage throws', () => {
  const broken = { getItem(){throw new Error('blocked')}, setItem(){throw new Error('blocked')}, removeItem(){throw new Error('blocked')} };
  const box = loadScript('js/store.js', { localStorage: broken });
  const Store = box.window.InterviewStore;
  const state = Store.load();
  state.settings.mode = 'long';
  assert.doesNotThrow(() => Store.save(state));
  assert.equal(Store.load().settings.mode, 'long');
});

test('export and import round-trip valid state and rejects invalid json', () => {
  const box = loadScript('js/store.js', { localStorage: fakeStorage() });
  const Store = box.window.InterviewStore;
  const state = Store.load();
  state.notes.demo = 'remember me';
  Store.save(state);
  const json = Store.exportState();
  assert.equal(JSON.parse(json).product,'engineering-atlas');
  Store.reset();
  const imported = Store.importState(json);
  assert.equal(imported.notes.demo, 'remember me');
  assert.throws(() => Store.importState('{bad json'));
  assert.throws(() => Store.importState(JSON.stringify({topics:[],cards:{}})),/Invalid Engineering Atlas backup/);
  assert.throws(() => Store.importState(JSON.stringify({topics:{},cards:{},settings:{mode:'turbo'}})),/Invalid Engineering Atlas backup/);
});

test('store migrates the legacy key without losing progress', () => {
  const storage=fakeStorage();
  storage.setItem('engineeringLearningOS.v2',JSON.stringify({schemaVersion:1,notes:{python:'keep this'},topics:{'python-event-loop':{lesson:1}}}));
  const box=loadScript('js/store.js',{window:{localStorage:storage}});
  const Store=box.window.InterviewStore;
  const migrated=Store.load();
  assert.equal(migrated.schemaVersion,2);
  assert.equal(migrated.notes.python,'keep this');
  assert.equal(migrated.topics['python-event-loop'].lesson,1);
  assert.ok(storage.getItem(Store.KEY));
  assert.equal(storage.getItem('engineeringLearningOS.v2'),null);
});
