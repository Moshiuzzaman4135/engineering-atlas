# Enrichment Status — durable memory across context compaction

Resume protocol after compaction: read `AGENTS.md`, this file, `git status --short`,
`git log --oneline -10` → continue from `NEXT_EXACT_TASK`. Do not redo research
recorded in `docs/SOURCES.md`.

```
CURRENT_BRANCH: main
CURRENT_COMMIT: 8b972ea (fix: keep roadmap hover text readable in light mode)
CURRENT_DOMAIN: diagrams/infrastructure (Wave 1)
LAST_COMPLETED_WAVE: Wave 0 — baseline, audit, durable docs
LAST_FULL_TEST_RESULT: PASS — node --check all + 58/58 tests (2026-08-24)
LAST_BROWSER_RESULT: not yet run this session

DOMAINS_COMPLETED: none yet (audit only)
DOMAINS_IN_PROGRESS: diagram system rebuild (Wave 1)
DOMAINS_REMAINING: python-core, database, messaging, distributed, system-design,
  ml-foundations, vision-ai, inference, ai-runtime, platform, cs-core

RESEARCH_COMPLETED: none beyond repo inspection this session
GITHUB_REPOS_ALREADY_INSPECTED: (repo-local reference/ studies already sanitized;
  gh audit pending — see NEXT_EXACT_TASK queue order below)
DIAGRAM_GROUPS_COMPLETED: none
LESSON_GROUPS_COMPLETED: none
LABS_COMPLETED: existing 14 labs pass tests; upgrades deferred to owning waves

KNOWN_ISSUES:
  - All 167 lessons at depth ≤2; 159 lack code; ~110 missing tradeoffs/failures/scaling
  - Diagram registry: only ~10 renderers for 25 referenced keys; 87 topics use generic
  - Untracked junk at repo root (prompt.text, request, response, server, size, target)
    — shell artifacts; gitignored in this session, do NOT commit them
CURRENT_FAILURE: none
NEXT_EXACT_TASK: Wave 1 — rebuild js/diagrams.js into a real SVG kit
  (typed nodes: client/service/worker/db/cache/queue/storage/model/gpu/external,
  sync/async edges, title+desc accessibility, sequence + timeline + state +
  plan-tree + partition-map primitives), then register purpose-built diagrams for the
  highest-priority lessons before moving to content deepening (Wave 2).
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

### 2026-08-24 — Wave 0

- Baseline verified: `bash tests/run-all.sh` → 58/58 pass.
- Counts confirmed programmatically (see CONTENT_QUALITY_REPORT.md).
- Created `tools/audit.mjs` (reproducible depth/coverage audit).
- Wrote AGENTS.md, docs/CONTENT_QUALITY_REPORT.md, docs/SOURCES.md, this file.
- Added `.atlas-private/` and root artifact files to `.gitignore`.
