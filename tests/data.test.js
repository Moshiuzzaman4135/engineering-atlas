const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScript } = require('./helpers');

test('curriculum covers priority AI runtime and systems topics', () => {
  const data = loadScript('js/data.js').window.InterviewOSData;
  assert.ok(data.topics.length >= 40);
  for (const id of ['agent-runtime','harness-optimization','model-routing','kafka-deep-dive','redis-streams','rabbitmq-deep-dive','postgres-indexes','db-load-reduction','load-balancing','triton-optimization']) {
    assert.ok(data.topics.some(t => t.id === id), `missing ${id}`);
  }
});

test('personal project map includes core systems the user has worked on', () => {
  const data = loadScript('js/data.js').window.InterviewOSData;
  for (const id of ['ivip','anpr','vms-events','govms','frs','rag','local-ai']) {
    assert.ok(data.projects.some(p => p.id === id), `missing ${id}`);
  }
});

test('each topic has active-recall and interview transfer content', () => {
  const data = loadScript('js/data.js').window.InterviewOSData;
  for (const topic of data.topics) {
    assert.ok(topic.intuition && topic.technical && topic.interviewAnswer, topic.id);
    assert.ok(Array.isArray(topic.quiz) && topic.quiz.length >= 1, `${topic.id} quiz`);
    assert.ok(Array.isArray(topic.cards) && topic.cards.length >= 2, `${topic.id} cards`);
  }
});

test('Priority requirement coverage maps role skills to curriculum and user evidence', () => {
  const data = loadScript('js/data.js').window.InterviewOSData;
  assert.ok(data.requirements.length >= 10);
  for (const r of data.requirements) {
    assert.ok(r.skill && r.status && r.topics && r.topics.length, `requirement ${r.skill} must map to topics`);
    assert.ok(r.evidence, `requirement ${r.skill} must explain evidence or gap`);
  }
});
