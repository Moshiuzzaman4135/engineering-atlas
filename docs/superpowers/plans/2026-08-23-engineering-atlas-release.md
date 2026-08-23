# Engineering Atlas Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand, improve, verify, publish, and package Engineering Atlas as a durable offline-first systems and AI learning platform.

**Architecture:** Preserve the dependency-free static SPA and direct-file loading path. Make surgical changes to data, storage, simulations, rendering, styles, and release tooling, protected by Node tests and browser checks.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Node built-in test runner, GitHub Actions/Pages, in-app browser automation.

**Spec:** `docs/superpowers/specs/2026-08-23-engineering-atlas-release-design.md`

## Global Constraints

- Public product name: `Engineering Atlas`.
- Tagline: `Interactive Systems & AI Knowledge Platform`.
- Repository: `Moshiuzzaman4135/engineering-atlas`, public, default branch `main`.
- Preserve direct `file://` core behavior and optional GitHub Pages PWA behavior.
- Add no runtime framework, package manager, CDN, or build dependency.
- Do not publish secrets, proprietary source, private URLs/IPs, customer data, or unsupported experience claims.
- Required responsive widths: 320, 360, 390, 412, 768, 1024, 1280, 1440.

---

### Task 1: Product identity and release contracts

**Files:** Modify `tests/expansion.test.js`, `tests/offline.test.js`, `index.html`, `START_HERE.html`, `manifest.webmanifest`, `sw.js`, `.github/workflows/pages.yml`; create `assets/atlas-mark.svg`.

**Interfaces:** Produces the public name, tagline, metadata, icon contract, and cache namespace consumed by every screen and release check.

- [ ] Add tests asserting Engineering Atlas metadata/manifest/workflow behavior and rejecting former public branding.
- [ ] Run the focused tests and confirm they fail because the old identity remains.
- [ ] Replace shell, start page, manifest, service-worker cache, workflow name, and metadata; add the EA layered-system SVG mark.
- [ ] Run focused tests and the full suite.
- [ ] Commit `refactor: rebrand platform as Engineering Atlas`.

### Task 2: Progress semantics and safe portable state

**Files:** Modify `tests/store.test.js`, `tests/scheduler.test.js`, `js/store.js`, `js/scheduler.js`, `js/app.js`.

**Interfaces:** Produces `Store.load/save/exportState/importState`, legacy-key migration, `Scheduler.isDue(card, now)`, and fresh-user due semantics used by dashboard/review.

- [ ] Add tests showing unseen cards are new rather than due, legacy progress migrates, valid backups round-trip, and malformed nested state is rejected.
- [ ] Run focused tests and verify each fails for the intended missing behavior.
- [ ] Implement schema-aware state normalization, migration, import validation, and scheduled-only due filtering.
- [ ] Run focused and full suites; refactor only while green.
- [ ] Commit `feat: make review progress portable and trustworthy`.

### Task 3: Durable learning dashboard and curriculum flow

**Files:** Modify `tests/app.test.js`, `tests/data.test.js`, `js/app.js`, `js/expanded-data.js`, `css/styles.css`.

**Interfaces:** Produces dashboard sections Continue Learning, Priority Interview Path, Master Curriculum, Review Due, Weak Areas, Recent Topics, Projects, Labs, and Mock Interview; consumes existing `priorityPath`, `curriculumPhases`, and mastery state.

- [ ] Add rendering tests for the durable learning loop, clear fresh-user review state, curriculum phase access, and recent/continue behavior.
- [ ] Run tests and confirm failure against the countdown/interview-first dashboard.
- [ ] Implement the dashboard hierarchy, phase summary, recent-topic derivation, next-topic selection, and concise mobile first viewport.
- [ ] Run focused/full tests and inspect desktop/mobile screenshots; iterate on hierarchy and spacing.
- [ ] Commit `feat: center the experience on progressive active learning`.

### Task 4: Labs and interactive application practice

**Files:** Modify `tests/simulations.test.js`, `tests/app.test.js`, `js/simulations.js`, `js/app.js`, `js/diagrams.js`, `css/styles.css`.

**Interfaces:** Produces deterministic `BackpressureSim`, `LoadBalancerSim`, and `PlannerSim` outputs plus 14 named lab render paths.

- [ ] Add literal-output simulation tests and a render-path test for all 14 required labs.
- [ ] Run tests and verify failures identify missing simulations/tabs.
- [ ] Implement the minimal simulation functions and focused lab controls/visual explanations.
- [ ] Run focused/full suites and browser-test every lab control for console errors and meaningful output changes.
- [ ] Commit `feat: expand hands-on architecture laboratories`.

### Task 5: Interview practice, content integrity, and evidence

**Files:** Modify `tests/data.test.js`, `tests/expansion.test.js`, `js/expanded-data.js`, `docs/SOURCE_NOTES.md`, `docs/CURRICULUM_MAP.md`.

**Interfaces:** Produces expanded `mockQuestions` entries with `followUps`, source-backed public GitHub evidence, unique IDs/references, and complete phase mapping.

- [ ] Add tests requiring broad category coverage, follow-ups, unique IDs, valid prerequisite/next-topic references, no orphan lessons, and accurate public evidence labels.
- [ ] Run tests and verify failures for missing depth/metadata.
- [ ] Add source-backed questions/follow-ups and evidence notes without private-repository claims; repair any curriculum or reference gaps.
- [ ] Run integrity/full suites.
- [ ] Commit `feat: deepen interview practice and curriculum evidence`.

### Task 6: Professional responsive themes and accessibility

**Files:** Modify `tests/responsive.test.js`, `tests/app.test.js`, `index.html`, `js/app.js`, `css/styles.css`.

**Interfaces:** Produces persisted `theme` setting (`system|dark|light`), semantic navigation/section headings, visible focus, and narrow-screen layouts without page overflow.

- [ ] Add tests for theme control, semantic labels, focus/reduced-motion rules, and intentional-only inner overflow.
- [ ] Run focused tests and confirm failures.
- [ ] Implement theme initialization/control, light tokens, EA visual system, keyboard/focus improvements, and mobile density fixes.
- [ ] Run full suite; browser-test all eight viewport sizes and representative routes; inspect screenshots and fix defects.
- [ ] Commit `feat: refine responsive and accessible product interface`.

### Task 7: Documentation and release verification tooling

**Files:** Rewrite `README.md`; modify `docs/GITHUB_PAGES.md`; create `docs/DEVELOPMENT.md`, `tests/integrity.test.js`, `tests/browser-smoke.mjs`, `tests/verify-release.ps1`, `.gitignore`.

**Interfaces:** Produces one command for syntax/data/security/static checks and documented extension points for lessons, phases, projects, questions, labs, and cheats.

- [ ] Add/extend tests for static references, service-worker assets, manifest JSON, branding/privacy patterns, and content uniqueness.
- [ ] Run them and record expected failures.
- [ ] Implement verification scripts and professional documentation with direct-file versus Pages behavior.
- [ ] Run all automated verification from the source tree.
- [ ] Commit `test: add comprehensive release verification` and `docs: document Engineering Atlas`.

### Task 8: GitHub publication and production verification

**Files:** Git metadata and GitHub repository/Pages state; no application behavior changes unless production verification finds a tested bug.

**Interfaces:** Produces `https://github.com/Moshiuzzaman4135/engineering-atlas` and `https://moshiuzzaman4135.github.io/engineering-atlas/`.

- [ ] Initialize Git/main if needed, review tracked files, and confirm no secret/privacy findings.
- [ ] Create the public repository through the authenticated GitHub surface, push the verified commits, and configure Pages with the workflow.
- [ ] Wait for the Actions deployment to complete; inspect logs on failure and fix via a test-first cycle.
- [ ] Browser-test production title, assets, routes, labs, localStorage, mobile, resource status, and console; capture/inspect required screenshots.
- [ ] Record repository SHA and deployment result.

### Task 9: Clean ZIP and independent extracted-copy verification

**Files:** Create `Engineering_Atlas.zip` outside tracked release contents and a newly created clean extraction directory.

**Interfaces:** Produces the final archive path and an extraction-test report derived from the archived bytes.

- [ ] Run source verification immediately before packaging.
- [ ] Archive only allowlisted release content, excluding `.git`, dependencies, coverage, screenshots, caches, and debug artifacts.
- [ ] Extract into a new empty directory and verify `START_HERE.html`, `index.html`, all runtime/data assets, syntax, integrity, and tests there.
- [ ] Serve the extracted directory; browser-test dashboard, navigation, a lesson, a lab, progress persistence/export-import, mobile overflow, resources, and console.
- [ ] Compare source/archive file manifests and report factual final counts, sizes, URLs, SHA, test results, and limitations.

