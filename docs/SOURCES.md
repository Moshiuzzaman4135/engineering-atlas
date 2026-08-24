# Sources — research memory

Record sources here BEFORE relying on them. Do not re-research entries already
recorded. Validate links when first added; note if a link was only read partially.

Format: `topic | title | org/author | URL | type (official/standard/paper/project/
engineering-reference) | notes`

## Already curated in-app

The app itself carries 34 curated sources in `js/data.js` / `js/expanded-data.js`
(`window.InterviewOSData.sources`) covering: Kafka, Redis Streams, RabbitMQ
(confirms/quorum/reliability), PostgreSQL indexes/partial indexes, Kubernetes HPA,
Triton batching/analyzer/metrics, vLLM, YOLO, ArcFace/MTCNN papers, learning science
(Roediger & Karpicke 2006, Cepeda 2006, Dunlosky). Check there before web-fetching.

## Repo-local evidence (sanitized)

- `reference/vision-relay-study.md` — iVip/Vision Relay architecture study
- `reference/py-vision-anpr-study.md` — ANPR pipeline study
- `reference/face-recognition-dnn-study.md` — face recognition study
- `reference/vms-mqtt-events-study.md` — VMS MQTT event service study
- `reference/govms-study.md` — GoVMS study
- `reference/personal-experience.md`, `reference/priority-role-brief.md`
- `docs/SOURCE_NOTES.md` — provenance rules + public GitHub evidence map

## External sources verified this session

- asyncio Task/coroutine semantics | Python docs — Coroutines and Tasks | Python Software Foundation | https://docs.python.org/3/library/asyncio-task.html | official | READ 2026-08-24 (v3.14 page). Extracted: calling async def creates object, runs nothing; create_task wraps+schedules, RuntimeError without running loop; loop keeps WEAK refs to tasks (save references / TaskGroup); Task = Future-like, inherits all Future APIs EXCEPT set_result/set_exception; cooperative scheduling; cancel() semantics incl. uncancel()/cancelling(); gather vs TaskGroup failure semantics; shield; wait_for cancels then raises TimeoutError; to_thread GIL note; eager task factory (3.12+).
- asyncio Future semantics | Python docs — Futures | Python Software Foundation | https://docs.python.org/3/library/asyncio-future.html | official | READ 2026-08-24. Extracted: Future = eventual result holder bridging callback-based code; rule of thumb: never expose Futures in user APIs, create via loop.create_future(); awaitable multiple times, same result; asyncio.Future vs concurrent.futures.Future differences (awaitability, InvalidStateError, call_soon callbacks, cancel msg).

## Pending research queue

- Python docs: asyncio event loop / Tasks / TaskGroup / primitives
- PostgreSQL: MVCC, EXPLAIN, index types
- vLLM PagedAttention paper; Triton dynamic batching (in-app source exists)
- FAISS wiki (IndexFlatIP/IndexIDMap2)
- ArcFace (in-app), DSFD, MTCNN papers
- MQTT OASIS spec QoS semantics
