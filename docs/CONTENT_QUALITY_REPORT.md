# Content Quality Report — Engineering Atlas

Engineering quality audit of the curriculum. This is a report about the material,
not learner mastery. Regenerate numbers with:

```
node tools/audit.mjs
node tools/audit.mjs --json   # full per-lesson detail
```

## Depth scale (internal development classification)

- **0** stub
- **1** definition
- **2** explanation + basic example
- **3** strong explanation + concrete example + useful visual
- **4** production mechanics + failures + trade-offs
- **5** senior / interview ready

Targets: Priority Interview Path lessons → 5. Important Master Curriculum lessons →
4–5. Small foundational lessons may appropriately stay 3.

## Baseline audit (Wave 0, 2026-08-24)

Counts: **167 lessons, 11 domains, 11 project case studies, 42 mock questions,
12 cheatsheets, 34 sources, 62 priority-5 lessons, 73 priority-4 lessons.**

### Depth histogram (baseline)

| Depth | Lessons |
|-------|---------|
| 0–1 | 3 |
| 2 | 164 |
| 3 | 0 |
| 4 | 0 |
| 5 | 0 |

Every domain averages only ~120–200 chars of `deepDive`. Priority-5 lessons at depth
≥4: **0%**.

### Missing-field counts (out of 167)

| Field | Missing |
|-------|---------|
| code | 159 |
| security | 116 |
| scaling | 111 |
| tradeoffs | 109 |
| failureModes | 109 |
| traps | 107 |
| sources | 97 |
| usedByYou | 74 |
| functions | 43 |

### Diagram audit (baseline)

25 distinct diagram keys are referenced by topics, but the renderer registry in
`js/diagrams.js` implements only ~10 (`harness, queue/broker, scale/api, db, pipeline,
gpu, eventloop, planner, decision`). All other keys silently fall through to the
generic pipeline renderer. 87 topics reference `generic` outright.

Consequences (defects to fix in Wave 1+):

1. Nearly every lesson shows the same "boxes with arrows" picture.
2. No diagram carries a title/description; no legends; no sequence/timeline/state/
   plan-tree/partition-map forms exist.
3. No failure-path visuals anywhere.
4. No "HOW TO READ THIS" or "WHAT AN INTERVIEWER SHOULD NOTICE" teaching apparatus.
5. Unregistered keys (`router`, `memory`, `rag`, `vector`, `trace`, `security`,
   `kafka`, `inference`, `cache`, …) render as the generic pipeline — misleading.

### Verdict

The platform is structurally sound (store, scheduler, labs, tests, release tooling all
work) but content is uniformly shallow: strong skeleton, thin muscle. The two highest-
leverage fixes are (1) a real diagram language with purpose-built diagrams for major
lessons and (2) systematic deepening of lessons domain-by-domain per
`docs/ENRICHMENT_STATUS.md` wave order.

## Wave progress snapshots

Updated after each enrichment wave by rewriting this section (keep baseline above).

### After Wave 1 — (pending)

