#!/usr/bin/env node
'use strict';
// Reproducible curriculum audit. Usage: node tools/audit.mjs [--json]
import fs from 'node:fs';

const window = {};
for (const f of ['js/data.js', 'js/expanded-data.js']) {
  new Function('window', fs.readFileSync(f, 'utf8'))(window);
}
const D = window.InterviewOSData;

const textLen = v => {
  if (!v) return 0;
  if (Array.isArray(v)) return v.join(' ').length;
  return String(v).length;
};

// Depth scale:
// 0 stub | 1 definition | 2 explanation+example | 3 strong explanation+visual |
// 4 production mechanics+failures+tradeoffs | 5 senior/interview-ready
function depth(t) {
  let s = 0;
  if (textLen(t.intuition) + textLen(t.technical) >= 120) s = Math.max(s, 1);
  if (textLen(t.intuition) + textLen(t.technical) + textLen(t.deepDive) >= 350) s = Math.max(s, 2);
  const strong =
    textLen(t.deepDive) >= 400 &&
    textLen(t.keyPoints) > 0 &&
    t.diagram && t.diagram !== 'generic';
  if (strong) s = Math.max(s, 3);
  const prod =
    textLen(t.failureModes) > 0 &&
    textLen(t.tradeoffs) > 0 &&
    (textLen(t.code) > 0 || /```/.test(String(t.deepDive)));
  if (prod) s = Math.max(s, 4);
  const senior =
    prod &&
    textLen(t.scaling) > 0 &&
    textLen(t.traps || t.security) > 0 &&
    textLen(t.sources) > 0 &&
    textLen(t.usedByYou) > 0;
  if (senior) s = Math.max(s, 5);
  return s;
}

const topics = D.topics.map(t => {
  const d = depth(t);
  return {
    id: t.id,
    domain: t.domain,
    title: t.title,
    priority: t.priority,
    diagram: t.diagram,
    depth: d,
    missing: {
      code: !t.code,
      tradeoffs: !textLen(t.tradeoffs),
      failureModes: !textLen(t.failureModes),
      scaling: !textLen(t.scaling),
      traps: !textLen(t.traps),
      security: !textLen(t.security),
      sources: !textLen(t.sources),
      usedByYou: !textLen(t.usedByYou),
      functions: !textLen(t.functions)
    },
    deepDiveChars: textLen(t.deepDive),
    codeChars: textLen(t.code)
  };
});

const byDomain = {};
for (const t of topics) {
  byDomain[t.domain] = byDomain[t.domain] || { total: 0, levels: {}, avgDeepDive: 0 };
  const b = byDomain[t.domain];
  b.total++;
  b.levels[t.depth] = (b.levels[t.depth] || 0) + 1;
}
for (const k in byDomain) {
  const ds = topics.filter(t => t.domain === k).map(t => t.deepDiveChars);
  byDomain[k].avgDeepDive = Math.round(ds.reduce((a, b) => a + b, 0) / ds.length);
}

const diagramsUsed = {};
topics.forEach(t => { diagramsUsed[t.diagram] = (diagramsUsed[t.diagram] || 0) + 1; });

const priorityPathIds = new Set(
  D.projects.flatMap(p => p.topics || [])
);

const summary = {
  generatedAt: new Date().toISOString(),
  counts: {
    lessons: topics.length,
    domains: D.domains.length,
    projects: D.projects.length,
    mockQuestions: D.mockQuestions.length,
    cheatsheets: D.cheatsheets.length,
    sources: D.sources.length,
    priority5: topics.filter(t => t.priority === 5).length,
    priority4: topics.filter(t => t.priority === 4).length
  },
  depthHistogram: topics.reduce((a, t) => ((a[t.depth] = (a[t.depth] || 0) + 1), a), {}),
  byDomain,
  diagramsUsed,
  distinctDiagramRenderers: Object.keys(diagramsUsed).length,
  missingCounts: {},
  level45ShareOfP5:
    Math.round((topics.filter(t => t.priority === 5 && t.depth >= 4).length /
      Math.max(topics.filter(t => t.priority === 5).length, 1)) * 100)
};
for (const f of Object.keys(topics[0].missing)) {
  summary.missingCounts[f] = topics.filter(t => t.missing[f]).length;
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ summary, topics }, null, 2));
} else {
  console.log(JSON.stringify(summary, null, 2));
}
