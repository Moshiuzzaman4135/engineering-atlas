# Engineering Learning OS

An offline-first, dependency-free learning application for **production AI, Python, machine learning, computer vision, databases, distributed systems, and senior system design interviews**.

This is intentionally not a textbook dump. It is a progressive learning system: **recall → understand → simulate → explain → revisit**. The priority interview path is shown first, while the full curriculum remains reusable for future interviews.

## What is inside

- **167 interactive lessons** across production AI/runtime architecture, Python, async/concurrency, SQL/PostgreSQL, messaging, scalability, ML fundamentals, YOLO/computer vision, RAG/vector search, GPU inference, DSA/OOP, reliability and senior architecture.
- **51-topic Priority Interview Path** that front-loads agent/runtime architecture, local model serving, Python async, DB/messaging and scalability.
- **10 long-term curriculum phases** so you can progress from engineering foundations to senior/lead system design instead of reading randomly.
- **11 interactive labs**: AI harness, Python event loop, database load, messaging, capacity planning, GPU/Triton, RAG, cosine similarity, YOLO/NMS, horizontal scaling and failure recovery.
- **112-term searchable glossary**, cheat sheets, flashcards, self-explanation prompts and mock interviews.
- **11 project architecture anchors** based on systems you have worked on or built: video intelligence, ANPR, face recognition, VMS events, GoVMS, RAG, local AI, function calling, speech/translation, football intelligence and OCR runtime.
- Local progress tracking with export/import. No account or server is required.

## Start locally

Unzip and open **`START_HERE.html`**. It links directly into the app and works from `file://` in modern browsers.

For the most browser-compatible/PWA experience, run any tiny static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## How to study without forgetting

Do not read all lessons once. Use this loop:

1. **Recall first:** answer before the lesson is revealed.
2. **Learn one connected concept:** simple intuition first, technical language second.
3. **Simulate:** change a parameter and predict the effect before observing it.
4. **Transfer:** explain where the same idea appears in a real project.
5. **Review later:** rate the flashcard Again / Hard / Good / Easy so weak material returns sooner.
6. **Mock aloud:** structure answers around requirements, components, data flow, bottlenecks, failure handling, scalability and trade-offs.

The learning design is grounded in retrieval practice and distributed practice rather than repeated rereading. See `docs/STUDY_METHOD.md`.

## Recommended order

Use the in-app **Roadmap → Priority Interview Path** first. After the immediate interview, continue through **Long-term mastery path**. The phases deliberately put Python/CS/database fundamentals before advanced distributed and AI architecture so later topics have something solid to attach to.

## Project architecture learning

The app does not merely say “you used Redis” or “you used YOLO.” Project pages connect technologies into flows and upgrade questions. Examples include:

- Video intelligence: FastAPI → Celery → Redis ZSET/Hash → MinIO → analytics → PostgreSQL/MQTT → Chroma/FAISS.
- ANPR: OpenCV capture → Redis → Triton detector → ROI → SORT/DeepSORT → Triton recognition → temporal aggregation/TTL dedup → MQTT/MinIO/Postgres.
- Face recognition: DSFD → MTCNN alignment → ArcFace embedding → cosine similarity → FAISS/ANN scaling discussion.
- Event systems: MQTT ingest → routing → progress/state → Postgres → Centrifugo → optional Kafka/webhook integrations.
- Long-video intelligence: resumable multipart upload → object storage → restartable stages → detection/tracking → OCR consensus → evidence fusion → event clips.

See `docs/PROJECT_ARCHITECTURES.md` for a compact printable walkthrough.

## GitHub Pages

A ready-to-use workflow is included at `.github/workflows/pages.yml`.

1. Create a new GitHub repository.
2. Push this folder to the repository root on branch `main`.
3. In GitHub **Settings → Pages**, set the source to **GitHub Actions**.
4. Push again or run the workflow manually.

Detailed commands are in `docs/GITHUB_PAGES.md`.

## Privacy / source note

The public package contains **sanitized study summaries**, not source code, credentials, private endpoints or raw proprietary codebase notes. Statements marked as project experience are based on the supplied study notes/work context; topics such as RabbitMQ, consensus or advanced agent patterns may be learning material rather than claims of production ownership.

## Development and verification

The runtime has no npm/CDN dependency. Tests use Node's built-in test runner:

```bash
./tests/run-all.sh
```

The PWA/service worker is optional: plain `index.html` remains usable without it.
