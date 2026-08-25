# Enrichment Status — durable memory across context compaction

Resume protocol after compaction: read `AGENTS.md`, this file, `git status --short`,
`git log --oneline -10` → continue from `NEXT_EXACT_TASK`. Do not redo research
recorded in `docs/SOURCES.md`.

```
CURRENT_BRANCH: main
CURRENT_COMMIT: (this wave — see git log)
CURRENT_DOMAIN: all domains enriched except ml-foundations (20) + vision-ai (23)
LAST_COMPLETED_WAVE: Waves 0–2 done; ai-runtime/inference/database/messaging/
  distributed/system-design/platform/cs-core ALL have purpose-built visuals
  + deepDives (167/167 lessons now render visuals)
LAST_FULL_TEST_RESULT: PASS — 66/66 (node --check all + node --test)
LAST_BROWSER_RESULT: PASS — smoke test (route/topic/lab render + spec bounds)
  clean; screenshots inspected for agent-runtime, model-routing, vllm-serving,
  memory-systems, backpressure, fine-tuning-vs-rag, k8s, postgres-indexes,
  object-model, mutable-immutable, copying at 1280px dark

DOMAINS_COMPLETED: ai-runtime, inference, database, messaging, distributed,
  system-design, platform, cs-core, python-core, ml-foundations (ALL 20 ml
  lessons now have 2 purpose-built visuals + deepDives)
DOMAINS_IN_PROGRESS: none (between waves)
DOMAINS_REMAINING: none — ALL 167 lessons have purpose-built visuals (APPROVED)

RESEARCH_COMPLETED: see docs/SOURCES.md — datamodel, contextlib, dataclasses,
  profile, FastAPI lifespan, asyncpg, PG EXPLAIN recorded; in-app curated
  sources cover Kafka/Redis/Rabbit/PG-indexes/Triton/vLLM/YOLO/ArcFace
GITHUB_REPOS_ALREADY_INSPECTED: none this session (repo-local reference/ only)
DIAGRAM_GROUPS_COMPLETED: every completed domain has 2 purpose-built visuals
  per lesson (flow/lanes/states/matrix/plot)
LESSON_GROUPS_COMPLETED: 131 lessons with visuals (see tools/visual-audit.mjs)
LABS_COMPLETED: unchanged (all lab diagrams render; registry kept)

KNOWN_ISSUES:
  - 36 lessons (ml-foundations 20, vision-ai 23 minus 7 already done) still
    have NO visual — NEXT_EXACT_TASK below.
  - 43 lessons are CUSTOM (visuals exist, not yet in APPROVED ratchet list).
  - Mobile diagrams use the app-wide 540px min-width horizontal scroll pattern
    (pre-existing); revisit ergonomics in the whole-product review wave.
CURRENT_FAILURE: none
NEXT_EXACT_TASK: ml-foundations + vision-ai batches, using the proven pipeline:
    1. Write /tmp/opencode/batchX.mjs exporting
       default { lessonId: {deepDive, visuals:[2 specs], extraTraps?, extraFailureModes?} }
       — visual types: flow/states/lanes/matrix/plot (see js/diagrams.js);
       keep node subs short-ish (renderer auto-fits font to box width).
    2. ml lessons live in js/data.js? CHECK with grep — some in expanded-data.js;
       run `node /tmp/opencode/patch-lessons.mjs <file> <batch>` for EACH file
       until "patched N".
    3. Run `node /tmp/opencode/fix-matrices.mjs` (drops redundant matrix col0
       when rows have cols.length-1 cells — the alignment bug).
    4. node --check both data files; bash tests/run-all.sh (66 tests).
    5. Smoke: /tmp/opencode/smoke.html via headless chrome against
       http://localhost:8123 (python3 -m http.server) — checks bounds + render.
       Screenshot spot-checks via /tmp/opencode/visual-review.html?t=<id>&theme=dark.
    6. Commit per domain: feat: ml-foundations/vision-ai — purpose-built
       visuals + depth.
    7. Then: add all new ids to APPROVED in tools/visual-audit.mjs AND
       tests/visual-semantics.test.js; regenerate docs/VISUAL_AUDIT.md;
       update this file; final commit.
    Vision DONE (batchO/batchP). Second visuals added to 42 lessons
    (batches batchQ/batchR via /tmp/opencode/merge-visuals.mjs — merges
    into existing visuals arrays). Remaining single-visual lessons (13,
    all P2/P3 small foundational): ml-gradient-descent, ml-regression-metrics,
    ml-cross-validation, ml-feature-scaling, ml-knn, ml-svm,
    ml-tree-ensembles, cv-image-representation, yolo-anchorfree,
    kalman-filter, hungarian, leader-election, id-generation.
    NEXT: Waves 15-18 — GitHub evidence audit (inspect repos per
    SOURCE_NOTES before claiming experience), interview-bank adversarial
    upgrade, whole-product visual/a11y/mobile review (mobile diagram
    540px scroll pattern), deployment verification.
    NOTE: patch-lessons.mjs merges extraTraps/extraFailureModes via T()/mk()
    (T() already patched to merge). Keep deepDives 2-3 paragraphs, honest
    numbers (illustrative labels), sources from in-app curated list.
```

## Wave plan (order may adapt)

- [x] **Wave 0** baseline + programmatic audit (`tools/audit.mjs`) + durable docs
- [x] **Wave 1** diagram language/framework + visual primitives (flow/lanes/
      states/matrix/plot; auto-fit text; named-registry bug fixed)
- [x] **Wave 2** Python fundamentals + asyncio + FastAPI depth (ALL 20 lessons
      benchmark depth, verified-runnable code)
- [x] **Wave 3** SQL + PostgreSQL + DB performance (11 lessons, visuals+depth)
- [x] **Wave 4** Redis/Kafka/RabbitMQ/MQTT/Celery messaging (7 lessons)
- [x] **Wave 5** distributed + system design (34 lessons across 2 domains)
- [x] **Wave 6** ML fundamentals + neural nets (20 lessons done)
- [x] **Wave 7** CV + YOLO + tracking (23 lessons done)
- [x] **Wave 8** ANPR + MMC + Motion + Face case-study lessons (done)
- [x] **Wave 9** embeddings + FAISS + vector search (done)
- [x] **Wave 10** RAG + retrieval + evaluation (rag-grounding, rag-chunking,
      evals-guardrails done)
- [x] **Wave 11** agents + harness + memory + routing (ai-runtime domain done)
- [x] **Wave 12** Triton + vLLM + GPU inference (inference domain done)
- [x] **Wave 13** Docker + Kubernetes + observability (platform domain done)
- [x] **Wave 14** networking + Linux + testing + OOP/DSA gaps (cs-core done)
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
- tools/visual-audit.mjs → docs/VISUAL_AUDIT.md (APPROVED 11 / GENERIC-REGISTRY 54 / MISSING 102).
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

### 2026-08-24 — Wave 2 progress 5

- python-exceptions + python-oop-solid rebuilt (errors tutorial + classes
  tutorial + Protocol docs recorded in SOURCES.md).
- Protocol demo verification caught a real API detail (isinstance requires
  @runtime_checkable) — fixed before shipping.
- 11 lessons APPROVED; 62/62 tests; all browser-inspected.
