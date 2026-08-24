# Enrichment Status — durable memory across context compaction

Resume protocol after compaction: read `AGENTS.md`, this file, `git status --short`,
`git log --oneline -10` → continue from `NEXT_EXACT_TASK`. Do not redo research
recorded in `docs/SOURCES.md`.

```
CURRENT_BRANCH: main
CURRENT_COMMIT: (this wave — see git log)
CURRENT_DOMAIN: diagram infrastructure (Wave 1) → next: python-core depth (Wave 2)
LAST_COMPLETED_WAVE: Wave 1 — typed diagram system + coroutine lesson benchmark
LAST_FULL_TEST_RESULT: PASS — 62/62 (node --check all + node --test), incl. new visual-semantics tests
LAST_BROWSER_RESULT: PASS — coroutine lesson visuals inspected at 1280px dark + light, 390px mobile;
  fixed overlapping timeline mark labels, clipped segment labels, colliding state-edge labels

DOMAINS_COMPLETED: (diagram infra only)
DOMAINS_IN_PROGRESS: none (between waves)
DOMAINS_REMAINING: python-core, database, messaging, distributed, system-design,
  ml-foundations, vision-ai, inference, ai-runtime, platform, cs-core

RESEARCH_COMPLETED: Python docs asyncio-task.html + asyncio-future.html (see docs/SOURCES.md)
GITHUB_REPOS_ALREADY_INSPECTED: none this session (repo-local reference/ only)
DIAGRAM_GROUPS_COMPLETED: coroutine/task/future (3 visuals: relationship, timeline, states)
LESSON_GROUPS_COMPLETED: python-coroutines-tasks (full rewrite to benchmark depth)
LABS_COMPLETED: unchanged (all lab diagrams still render; registry kept)

KNOWN_ISSUES:
  - 111 lessons now render NO visual (was: unrelated generic pipeline). Intentional:
    fallback removed at root. Track in docs/VISUAL_AUDIT.md; fix per-domain in waves.
  - 55 lessons use shared registry renderers — semantic fit must be reviewed per lesson.
  - Mobile diagrams use the app-wide 540px min-width horizontal scroll pattern
    (pre-existing); revisit ergonomics in the whole-product review wave.
  - app.test.js diagram mock extended (renderVisual/has) — keep in sync with diagrams API.
CURRENT_FAILURE: none
NEXT_EXACT_TASK: Wave 2 — Python core depth pass, starting with python-event-loop
  (research docs.python.org event loop reference first), then python-taskgroup and
  python-cancellation-timeouts using the same visuals+depth standard; add each to
  APPROVED in tools/visual-audit.mjs AND tests/visual-semantics.test.js only after
  browser inspection.
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
- tools/visual-audit.mjs → docs/VISUAL_AUDIT.md (APPROVED 1 / GENERIC-REGISTRY 55 /
  MISSING 111).
- Browser inspection at 1280 dark+light and 390 mobile; fixed 3 label-collision
  defects found in inspection.

### 2026-08-24 — Wave 0

- Baseline verified: `bash tests/run-all.sh` → 58/58 pass.
- Counts confirmed programmatically (see CONTENT_QUALITY_REPORT.md).
- Created `tools/audit.mjs` (reproducible depth/coverage audit).
- Wrote AGENTS.md, docs/CONTENT_QUALITY_REPORT.md, docs/SOURCES.md, this file.
- Added `.atlas-private/` and root artifact files to `.gitignore`.
