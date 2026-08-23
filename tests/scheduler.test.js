const test = require('node:test');
const assert = require('node:assert/strict');
const { loadScript } = require('./helpers');

const now = new Date('2026-08-23T12:00:00Z').getTime();
const sbox = loadScript('js/scheduler.js');
const S = sbox.window.InterviewScheduler;

test('sprint review intervals make weak cards return quickly', () => {
  const base = { repetitions: 0, intervalMs: 0, ease: 2.3, dueAt: now };
  assert.equal(S.rateCard(base, 'again', now, 'sprint').dueAt, now + 5*60*1000);
  assert.equal(S.rateCard(base, 'hard', now, 'sprint').dueAt, now + 30*60*1000);
  assert.equal(S.rateCard(base, 'good', now, 'sprint').dueAt, now + 4*60*60*1000);
  assert.equal(S.rateCard(base, 'easy', now, 'sprint').dueAt, now + 16*60*60*1000);
});

test('long-term good ratings expand interval', () => {
  const first = S.rateCard({ repetitions:0, intervalMs:0, ease:2.3, dueAt:now }, 'good', now, 'long');
  assert.equal(first.dueAt, now + 2*24*60*60*1000);
  const second = S.rateCard(first, 'good', first.dueAt, 'long');
  assert.ok(second.intervalMs >= first.intervalMs * 2);
});

test('topic mastery uses lesson, quiz, flashcard and explanation weighting', () => {
  assert.equal(S.topicMastery({ lesson:1, quiz:1, cards:1, explanation:1 }), 100);
  assert.equal(S.topicMastery({ lesson:1, quiz:0, cards:0, explanation:0 }), 20);
  assert.equal(S.topicMastery({ lesson:0, quiz:1, cards:0, explanation:0 }), 35);
});

test('study queue prioritizes due and high-priority weak topics', () => {
  const data = { topics:[
    { id:'high', priority:5, domain:'a', title:'High' },
    { id:'low', priority:1, domain:'b', title:'Low' }
  ]};
  const state = { topics:{ high:{ lesson:0, quiz:0, cards:0, explanation:0, lastStudied:0 }, low:{ lesson:1, quiz:1, cards:1, explanation:1, lastStudied:now } }, cards:{} };
  const q = S.buildStudyQueue(data, state, now);
  assert.equal(q[0].id, 'high');
  assert.ok(q[0].score > q[1].score);
});

test('unseen cards are new, not overdue', () => {
  assert.equal(S.isDue({ dueAt:0, lastReviewed:undefined }, now), false);
  assert.equal(S.isDue({ dueAt:now-1, lastReviewed:now-1000 }, now), true);
  const data={topics:[{id:'fresh',priority:5,domain:'a',title:'Fresh'}]};
  const state={topics:{},cards:{'fresh:0':{id:'fresh:0',topicId:'fresh',dueAt:0,repetitions:0}}};
  assert.equal(S.buildStudyQueue(data,state,now)[0].dueCards,0);
});
