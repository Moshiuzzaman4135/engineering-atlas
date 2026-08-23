# Engineering Atlas Release Design

## Outcome

Turn the existing offline-first learning application into **Engineering Atlas — Interactive Systems & AI Knowledge Platform**, then publish it at the requested GitHub Pages URL and deliver a clean, independently verified ZIP.

## Evidence and constraints

- Baseline: 38/38 Node tests pass.
- Source counts: 167 lessons, 51 priority lessons, 10 phases, 11 project cases, 112 glossary terms, 22 mock questions, 12 cheat sheets, and 11 labs.
- Runtime: dependency-free vanilla HTML/CSS/JavaScript, hash routing, localStorage, optional service worker, direct `file://` support.
- GitHub: authenticated connector account is `Moshiuzzaman4135`; `Moshiuzzaman4135/engineering-atlas` does not yet exist.
- Public repository evidence supports Python utilities, Flask/API experiments, MQTT, RTSP/ROI/image tooling, Docker study, ML/CV notebooks, Siamese face-recognition work, and a public football-intelligence system. Private repositories will not be described publicly.
- Public branding must contain no former product, interview-target, or employer branding. Sanitized project names such as iVip/Vision Relay may remain only as architecture case-study identifiers supported by supplied notes.

## Architecture

Keep the static architecture. The existing `InterviewOSData` global remains as a compatibility boundary, but public product identity becomes `Engineering Atlas`. Data stays in classic scripts so direct-file mode continues to work. Application behavior remains hash-routed and progressively enhanced; the service worker is optional.

Avoid a framework/build pipeline. Add focused runtime helpers only where behavior needs a testable boundary. Keep all release verification in Node scripts plus browser automation.

## Learning experience

The primary loop is **Learn → Explain → Visualize → Recall → Apply → Interview → Review**. The dashboard prioritizes:

1. Continue learning from the most recent or next prerequisite-aware lesson.
2. Priority Interview Path as a durable configurable path, without countdown language.
3. Master Curriculum and phase progress.
4. Review due, weak areas, recent topics, project architectures, labs, and mock interview.

Unseen flashcards are “new,” not “overdue.” The due count includes scheduled cards only, preventing a fresh install from showing hundreds overdue.

Lesson pages retain recall-before-reveal and add clearer progress/next-step context. Phase ordering remains fundamentals through senior architecture. Project evidence labels distinguish supplied sanitized experience from general examples.

## Labs and interview practice

Expand to at least 14 focused labs: Python Event Loop, Backpressure, Cache vs Database Load, Message Broker Selector, Load Balancer, PostgreSQL Planner/Index, Cosine Similarity, RAG Retrieval, Agent Harness Critical Path, GPU Batching, YOLO IoU/NMS, ANPR Capacity, System Capacity Estimator, and Failure Injection. Reuse existing simulation primitives where they accurately model the concept; add small deterministic functions for missing labs.

Expand mock interviewing beyond 22 questions with follow-ups across Python, backend, data, messaging, infrastructure, distributed systems, ML/CV, RAG/LLMs/agents, GPU inference, incidents, and leadership.

## Visual design

Retain the restrained technical dark interface but replace the purple “learning OS” identity with an atlas/layered-system motif, an EA monogram, denser but calmer cards, and a clearer first viewport. Desktop remains documentation-like; mobile prioritizes one primary action before metrics. Add professional light theme support while preserving system preference and reduced motion.

## Offline, storage, and security

- Preserve `START_HERE.html → index.html` under `file://`.
- Rename the storage key while migrating the legacy key once so existing progress is not lost.
- Export schema includes a product/version marker; import validates object shape, supported fields, topic/card records, and bounded settings before saving.
- Service worker cache becomes `engineering-atlas-*` and caches every required runtime asset.
- Release scan rejects secret-like credentials, private hosts/IPs, former branding, and target-company terms outside clearly excluded private reference inputs.

## Verification and release

Run syntax, Node tests, data-integrity checks, HTML/manifest/service-worker checks, localStorage/export/import, all labs, representative routes, console/resource checks, and responsive widths 320, 360, 390, 412, 768, 1024, 1280, and 1440. Capture and inspect the required representative screenshots, iterate on visible defects, then initialize Git, create/push the public repository, wait for Pages, and browser-test production.

Create `Engineering_Atlas.zip` without development artifacts, extract it to a newly created clean directory, run the same integrity tests there, serve the extracted copy, and verify direct-file and browser flows before reporting success.

## Success criteria

- Engineering Atlas branding and metadata are consistent.
- No page-level horizontal overflow at required widths.
- Fresh users have zero overdue reviews and a clear first lesson.
- At least 14 useful labs and materially expanded mock interviewing.
- 100% automated tests pass; browser console has no errors; no broken local or production resources.
- Public GitHub Pages deployment is reachable and functional.
- Clean ZIP extraction passes offline and browser verification independently.

