# Enrichment Status — durable memory across context compaction

Resume protocol after compaction: read `AGENTS.md`, this file, `git status --short`,
`git log --oneline -10` → continue from `NEXT_EXACT_TASK`. Do not redo research
recorded in `docs/SOURCES.md`.

```
CURRENT_BRANCH: main
CURRENT_COMMIT: (this wave — see git log)
CURRENT_DOMAIN: python-core depth (Wave 2, ~60% done)
LAST_COMPLETED_WAVE: Wave 1 done; Wave 2 in progress — 4 python-core lessons rebuilt
LAST_FULL_TEST_RESULT: PASS — 62/62 (node --check all + node --test), incl. new visual-semantics tests
LAST_BROWSER_RESULT: PASS — coroutine lesson visuals inspected at 1280px dark + light, 390px mobile;
  fixed overlapping timeline mark labels, clipped segment labels, colliding state-edge labels

DOMAINS_COMPLETED: (diagram infra only)
DOMAINS_IN_PROGRESS: none (between waves)
DOMAINS_REMAINING: python-core, database, messaging, distributed, system-design,
  ml-foundations, vision-ai, inference, ai-runtime, platform, cs-core

RESEARCH_COMPLETED: Python docs asyncio-task.html + asyncio-future.html (see docs/SOURCES.md)
GITHUB_REPOS_ALREADY_INSPECTED: none this session (repo-local reference/ only)
DIAGRAM_GROUPS_COMPLETED: coroutine/task/future (3), event-loop cycle+timeline, TaskGroup scope+failure timeline, cancellation flow+deadline budget
LESSON_GROUPS_COMPLETED: python-coroutines-tasks, python-event-loop, python-taskgroup, python-cancellation-timeouts, async-semaphore-queue, python-gil, python-threading, python-multiprocessing, python-iterators-generators, python-exceptions (all benchmark depth)
LABS_COMPLETED: unchanged (all lab diagrams still render; registry kept)

KNOWN_ISSUES:
  - 111 lessons now render NO visual (was: unrelated generic pipeline). Intentional:
    fallback removed at root. Track in docs/VISUAL_AUDIT.md; fix per-domain in waves.
  - 55 lessons use shared registry renderers — semantic fit must be reviewed per lesson.
  - Mobile diagrams use the app-wide 540px min-width horizontal scroll pattern
    (pre-existing); revisit ergonomics in the whole-product review wave.
  - app.test.js diagram mock extended (renderVisual/has) — keep in sync with diagrams API.
CURRENT_FAILURE: none
NEXT_EXACT_TASK: Wave 2 continued — remaining python-core by priority:
  python-oop-solid (P4), python-object-model (P4), python-mutable-immutable (P4),
  python-profiling (P3), python-closures-decorators (P3), python-context-managers (P3),
  python-typing-dataclasses (P3), python-copying (P3), python-args-kwargs,
  python-scope-methods, then fastapi-lifecycle + async-db-pools (Wave 3 bridge).
  Per-lesson recipe (proven 10×, follow exactly):
    1. fetch the topic's official docs page; extract facts; append entry to
       D.sources.push in js/expanded-data.js (id: python-<topic>-docs style)
    2. rewrite the mk({...}) lesson: intuition/technical/deepDive (multi-
       paragraph, \n\n separated)/terms/functions/remember/tradeoffs/
       failureModes/scaling/security/traps/usedByYou/code+codeTitle/
       sources/prereqs/nextTopics/interviewAnswer/visuals[2+]
    3. visuals: {type:'flow'|'lanes'|'states', id:'py-<topic>-<slug>', w,h,
       title,purpose, nodes/edges|rows/segments/marks, howToRead[4],
       interviewerNotice[2]} — hand-tuned coordinates; check label collisions
    4. extract code via node -e and RUN with python3 (/usr/bin/python3 = 3.10);
       label 3.11+ features 'syntax-reviewed' honestly
    5. add id to APPROVED in BOTH tools/visual-audit.mjs and
       tests/visual-semantics.test.js; run node tools/visual-audit.mjs
    6. bash tests/run-all.sh → 62+ green; screenshot via
       /tmp/opencode/visual-review.html?t=<id> at 1280px; FIX collisions
    7. commit 'feat: rebuild <topic> lesson to benchmark depth'
  KNOWN TRAPS: avoid 'fetch(' in Python examples (offline test); avoid 'sk-'
  followed by long token in any id (release secret scan); nextTopics ids must
  exist (expansion test); lanes with 4 rows need h≈352 (mark labels clip);
  flow/states container nodes accept top:true for top-aligned labels.
  NOTE: local python3 is 3.10 — examples using TaskGroup/timeout()/except* are
  labeled 'syntax-reviewed, not executed locally' (verified behaviorally on 3.10
  where possible).
```

## Wave plan (order may adapt)

- [x] **Wave 0** baseline + programmatic audit (`tools/audit.mjs`) + durable docs
- [ ] **Wave 1** diagram language/framework + visual primitives
- [ ] **Wave 2** Python fundamentals + asyncio + FastAPI depth
- [ ] **Wave 3** SQL + PostgreSQL + DB performance
- [ ] **Wave 4** Redis/Kafka/RabbitMQ/Celery/MQTT
- [ ] **Wave 5** distributed systems + reliability + system design cases
- [ ] **Wave 6** ML fundamentals + neural nets
- [ ] **Wave 7** CV + YOLO + tracking
- [ ] **Wave 8** ANPR + MMC + Motion + Face Recognition case studies
- [ ] **Wave 9** embeddings + FAISS + vector search
- [ ] **Wave 10** RAG + retrieval + evaluation (+ RAG lab upgrade)
- [ ] **Wave 11** agents + harness + memory + routing
- [ ] **Wave 12** Triton + vLLM + GPU inference
- [ ] **Wave 13** Docker + Kubernetes + observability
- [ ] **Wave 14** networking + Linux + testing + OOP/DSA gaps
- [ ] **Wave 15** personal GitHub architecture synthesis (gh evidence audit)
- [ ] **Wave 16** interview-bank adversarial upgrade
- [ ] **Wave 17** whole-product visual/a11y/perf/security review
- [ ] **Wave 18** production deployment verification

## Session log

### 2026-08-24 — Wave 1

- Root cause fixed: `Diagrams.render()` no longer falls back to the CV pipeline for
  unknown/generic keys; app renders a Visual models section only from explicit
  topic `visuals` specs or a registered named renderer.
- `js/diagrams.js` rebuilt: shared primitives (labeled nodes with sublabels,
  polyline arrows, accessible `<title>/<desc>`), declarative renderers `flow`,
  `lanes` (timeline), `states` (state machine); named registry preserved for labs.
- app.js: multi-visual rendering with Purpose / How to read / Interviewer notice;
  multi-paragraph deepDive; per-lesson Further reading panel.
- Benchmark lesson `python-coroutines-tasks` rewritten from Python docs research:
  3 purpose-built visuals, verified-runnable code example (executed via python3),
  failure modes, traps, trade-offs, adversarial interview answer.
- New tests/visual-semantics.test.js (fallback removal, expected/forbidden terms,
  teaching apparatus) — the Coroutine regression is now automated.
- tools/visual-audit.mjs → docs/VISUAL_AUDIT.md (APPROVED 10 / GENERIC-REGISTRY 54 / MISSING 103).
- Browser inspection at 1280 dark+light and 390 mobile; fixed 3 label-collision
  defects found in inspection.

### 2026-08-24 — Wave 2 (in progress)

- python-event-loop, python-taskgroup, python-cancellation-timeouts rebuilt to
  benchmark depth from the asyncio docs research already recorded in SOURCES.md.
- 7 new purpose-built visuals; 3 renderer improvements (top-label containers,
  staggered timeline marks, lane-height fix for clipped mark labels).
- Code examples verified: event-loop example executed on 3.10 (0.1s overlapped vs
  0.2s with blocking call); cancel() semantics verified; TaskGroup/except* examples
  labeled honestly as 3.11+ syntax-reviewed (no 3.11+ runtime available locally).
- Offline-safety test false positive resolved by renaming Python example functions
  (kept the strict no-fetch guard).

### 2026-08-24 — Wave 2 progress 2

- async-semaphore-queue rebuilt: sync-primitives + queues docs researched and
  recorded in SOURCES.md; semaphore-slots timeline + bounded-queue pressure flow;
  code example executed (backpressure + ceiling visible in output).

### 2026-08-24 — Wave 0

- Baseline verified: `bash tests/run-all.sh` → 58/58 pass.
- Counts confirmed programmatically (see CONTENT_QUALITY_REPORT.md).
- Created `tools/audit.mjs` (reproducible depth/coverage audit).
- Wrote AGENTS.md, docs/CONTENT_QUALITY_REPORT.md, docs/SOURCES.md, this file.
- Added `.atlas-private/` and root artifact files to `.gitignore`.

### 2026-08-24 — Wave 2 progress 3

- python-gil, python-threading, python-multiprocessing rebuilt to benchmark depth
  (glossary/threading/multiprocessing docs read and recorded in SOURCES.md).
- Verified runnable: GIL demo (I/O overlap 0.3s vs CPU no-speedup 0.22s/4 threads;
  real lost-update race 10000/40000), threading bounded-handoff demo,
  multiprocessing pool (0.33s serial → 0.14s on 3 workers).
- Renderer: `top` label flag for container boxes now honored in flow specs too.
- Fixed nextTopics reference (python-concurrent-futures does not exist).
- 8 lessons now APPROVED; 62/62 tests; every rebuilt lesson browser-inspected.

### 2026-08-24 — Wave 2 progress 4

- python-iterators-generators rebuilt (glossary + language-reference yield
  semantics already researched this session, recorded in SOURCES.md).
- Memory-profile timeline + iterator-protocol map visuals; pipeline demo
  verified (104-byte generator vs 1M rows; single-pass emptiness; close()
  cleanup).
- 9 lessons APPROVED; 62/62 tests green.
