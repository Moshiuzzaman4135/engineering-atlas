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

(none yet — add as researched)

## Pending research queue

- Python docs: asyncio event loop / Tasks / TaskGroup / primitives
- PostgreSQL: MVCC, EXPLAIN, index types
- vLLM PagedAttention paper; Triton dynamic batching (in-app source exists)
- FAISS wiki (IndexFlatIP/IndexIDMap2)
- ArcFace (in-app), DSFD, MTCNN papers
- MQTT OASIS spec QoS semantics
