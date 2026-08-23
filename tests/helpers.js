const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function makeWindow() {
  return { InterviewOSData: undefined, InterviewScheduler: undefined, InterviewStore: undefined, InterviewSim: undefined, InterviewDiagrams: undefined };
}

function loadScript(rel, seed = {}) {
  const file = path.join(__dirname, '..', rel);
  const code = fs.readFileSync(file, 'utf8');
  const window = Object.assign(makeWindow(), seed.window || {});
  const sandbox = {
    window,
    console,
    Date,
    Math,
    JSON,
    setTimeout,
    clearTimeout,
    Blob: global.Blob,
    URL: global.URL,
    localStorage: seed.localStorage,
    document: seed.document,
  };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: file });
  return sandbox;
}

module.exports = { loadScript };
