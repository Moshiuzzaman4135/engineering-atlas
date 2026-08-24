# Engineering Atlas — Agent Instructions

Long-lived rules for any agent working in this repository. Changing progress lives in
`docs/ENRICHMENT_STATUS.md`; curriculum audit in `docs/CONTENT_QUALITY_REPORT.md`;
research memory in `docs/SOURCES.md`.

## Product

Static, dependency-free vanilla HTML/CSS/JS knowledge platform. Must keep working:

1. On GitHub Pages under `/engineering-atlas/`.
2. From `unzip -> START_HERE.html -> study` (file:// mode).
3. Offline via service worker where supported.

Do NOT migrate to React/Vue/bundlers without strong evidence of need.
Preserve existing store, scheduler, tests, release tooling.

## Architecture map

- `index.html` / `START_HERE.html` — entry points
- `js/data.js` — core data: domains, topics (lessons), projects, mockQuestions,
  cheatsheets, requirements, sources. IIFE setting `window.InterviewOSData`.
- `js/expanded-data.js` — extends `window.InterviewOSData` with more domains/topics
  (IIFE, must load AFTER `js/data.js`).
- `js/diagrams.js` — SVG diagram renderers. API: `window.InterviewDiagrams.render(type)`
  returns an SVG string. Topic field `diagram` selects renderer by key.
- `js/app.js` — rendering/routing/UI. `js/store.js` — persistence. `js/scheduler.js` —
  spaced review. `js/simulations.js` — interactive labs.
- `tests/run-all.sh` — full suite (`node --check` each JS file + `node --test`).

## Topic schema (lesson)

Common fields: `id, domain, title, priority(2..5), diagram, intuition, technical,
deepDive, interviewAnswer, quizCorrect, terms[], functions[], prerequisites[],
nextTopics[], keyPoints[], usedByYou[], tradeoffs[], failureModes[], scaling[],
security[], traps[], sources[], code, codeTitle, cards[], quiz[]`.

Depth targets: Priority Interview Path lessons → level 5. Master Curriculum → 4–5.
Small foundational lessons may stay 3. Depth scale is defined in
`docs/CONTENT_QUALITY_REPORT.md`.

## Content rules

- Write like a senior architect mentoring a mid-level engineer. Explain WHY.
- No generic filler ("X is powerful and widely used"), no forced analogies.
- Never invent benchmark numbers. Label illustrative math as illustrative;
  label lab outputs as synthetic/simulated.
- Personal experience claims: only what is CONFIRMED by repo evidence
  (see docs/SOURCE_NOTES.md). Distinguish OBSERVED design vs POTENTIAL evolution.
- Never include credentials, internal hosts/IPs, customer data, or private source code.
  Sanitized educational examples only. `.atlas-private/` is local-only, never commit.
- Sources: prefer official docs, RFCs, papers, project repos. Record new research in
  `docs/SOURCES.md` before relying on it; do not re-research after compaction.

## Diagrams

Every important lesson needs a diagram that teaches one exact idea. Use the right
form (architecture / sequence / timeline / state machine / plan tree / partition map /
pipeline geometry). Meaningless box-arrow decoration is a defect. Complex diagrams get
"HOW TO READ THIS" steps and "WHAT AN INTERVIEWER SHOULD NOTICE". Show failure paths
for major systems (symptom → propagation → metric → recovery).

## Verification

- After edits: `bash tests/run-all.sh` must stay green.
- Educational correctness ≠ tests green: execute marked Python/JS snippets, parse
  JSON/YAML, verify arithmetic in tests where practical.
- Browser-check affected screens at mobile (320–412px) and desktop widths when UI
  or diagrams change.
- Before pushing publicly: scan diff for secrets/internal identifiers.

## Workflow

Work in waves (see docs/ENRICHMENT_STATUS.md for current wave and NEXT_EXACT_TASK).
After each wave: focused tests → status update → logical commit. Keep commits small
and descriptive (`feat:`/`fix:`/`docs:`/`test:` style, matching git history).
