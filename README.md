# Engineering Atlas

**Interactive Systems & AI Knowledge Platform**

Engineering Atlas is an offline-capable personal knowledge platform for senior Python, backend, systems, and AI engineering. It combines a prerequisite-based curriculum with active recall, architecture walkthroughs, interactive simulations, project evidence, and interview practice. The application is deliberately static and dependency-free at runtime, so it remains easy to inspect, extend, download, and publish.

## Why it exists

Reading can create familiarity without durable recall. Engineering Atlas turns study into a repeatable practice loop and keeps weak material visible over time. It is a long-lived engineering reference, not a one-interview cheat sheet.

## Learning approach

The core loop is **learn → explain → visualize → recall → apply → interview → review**.

- Lessons begin with a retrieval prompt before showing the explanation.
- Simple intuition is followed by technical language, concrete terms, code, failure modes, and trade-offs.
- Feynman notes ask the learner to explain an idea in their own words.
- Flashcards use Again / Hard / Good / Easy ratings and separate sprint and long-term schedules.
- Simulations turn architecture choices into observable latency, throughput, load, reliability, or quality effects.
- Mock prompts require structured answers and include follow-up questions.

The study design is summarized in [docs/STUDY_METHOD.md](docs/STUDY_METHOD.md).

## Curriculum

The current source contains 167 lessons, 51 priority lessons, and 10 progressive phases. The Master Curriculum moves from Python foundations through concurrency, databases, backend engineering, distributed systems, ML/CV, LLM and agent systems, infrastructure, and senior architecture. The shorter Priority Interview Path remains prominent without defining the identity of the product.

See [docs/CURRICULUM_MAP.md](docs/CURRICULUM_MAP.md) and [docs/PRIORITY_INTERVIEW_COVERAGE.md](docs/PRIORITY_INTERVIEW_COVERAGE.md).

## Interactive labs

Fourteen browser-native labs cover:

- Python event-loop behavior and backpressure
- cache versus database load, PostgreSQL planning, and load balancing
- broker selection, system capacity, and failure injection
- cosine similarity and RAG retrieval
- agent-harness critical paths
- GPU batching, YOLO/NMS, and ANPR capacity

Every displayed number is synthetic and educational. Each lab explains what to observe instead of presenting estimates as benchmark results.

## Project architecture

Eleven sanitized case studies connect concepts to systems the owner has built, operated, or studied. They include video intelligence, ANPR, face recognition, event processing, RAG, local AI infrastructure, football intelligence, and OCR runtime patterns. Personal claims are separated from general learning material and public GitHub evidence.

No proprietary source code, credentials, internal endpoints, or customer data belongs in this repository. See [docs/PROJECT_ARCHITECTURES.md](docs/PROJECT_ARCHITECTURES.md) and [docs/SOURCE_NOTES.md](docs/SOURCE_NOTES.md).

## Progress and review

Progress is stored locally in the browser. Completion, quiz attempts, explanations, confidence, review scheduling, weak topics, and recent study history remain available without an account. Sources / Settings can export a portable JSON backup and validate an imported backup. A legacy storage key is migrated automatically.

## Offline use

For the simplest downloadable experience, unzip the package and open `START_HERE.html`. The core application works through `file://`, including lessons, navigation, labs, review state, search, and local progress.

For service-worker installation and the most consistent PWA behavior, serve the directory:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. GitHub Pages provides the same HTTPS mode. Direct-file mode does not install the service worker, because browsers reserve that capability for secure HTTP origins.

## GitHub Pages

The production site is designed for [https://moshiuzzaman4135.github.io/engineering-atlas/](https://moshiuzzaman4135.github.io/engineering-atlas/). The workflow in `.github/workflows/pages.yml` publishes the static repository root with official GitHub Pages actions and no build step. Deployment details are in [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md).

## Development

The runtime is plain HTML, CSS, and classic JavaScript. `js/data.js` contains the compact original catalog; `js/expanded-data.js` adds the progressive curriculum and expanded content; `js/app.js` renders routes and interactions; `js/simulations.js` contains pure lab models; and `js/store.js` owns local persistence. This layout preserves direct-file use.

Read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) before changing content or behavior.

## Adding a lesson

Add a unique topic object to `js/expanded-data.js`, assign it to one curriculum phase, and link only valid prerequisite or next-topic IDs. Include intuition, technical language, recall/interview transfer, and concrete terms. Run the complete test suite; integrity tests reject duplicate IDs, broken links, and orphan lessons.

## Adding a lab

Keep calculations as a pure function in `js/simulations.js`, add a renderer and tab registration in `js/app.js`, and add tests for both the model behavior and the rendered controls. Label every control and describe synthetic outputs clearly.

## Testing

Node 20 or newer is recommended. No package installation is required.

```bash
./tests/run-all.sh
```

On Windows PowerShell, run the equivalent commands documented in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md). The suite checks JavaScript syntax, content integrity, routes, storage migration and import validation, all simulations, responsive CSS contracts, PWA resources, public branding, and privacy heuristics. Release verification additionally uses a real browser across representative routes and viewports.

## Privacy

Project descriptions are sanitized educational summaries. Public repository evidence is identified as evidence; private repositories are excluded. General engineering material is not presented as personal production ownership. Before publication, run the release suite and review the source notes manually; heuristic scans complement, but do not replace, human review.

## Roadmap

- Keep lessons prerequisite-linked as the catalog grows toward hundreds of topics.
- Add richer decision records and scenario-based architecture exercises.
- Expand automated accessibility checks without adding a runtime dependency.
- Split data by domain only when direct-file loading can remain deterministic and maintainable.
- Preserve portable progress exports as the storage schema evolves.

