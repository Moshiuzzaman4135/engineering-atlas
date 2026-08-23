# Project Architecture Walkthroughs

These are study-oriented summaries derived from the supplied architecture notes/work context. They intentionally omit credentials, private URLs and source-code details.

## 1. Video Intelligence / Vision Relay

**Flow:** API job control → Celery extraction → frames/artifacts in MinIO → frame IDs/progress in Redis ZSET/Hash → independent analytics → Postgres durable events → MQTT realtime events. Scene-based sampling emits representative VLM frames. Chroma stores multimodal embeddings/metadata; FAISS supports face-watchlist vector search.

**Architecture concepts:** producer-consumer, pipeline, async work, fast transient state vs durable state, pub/sub, object storage, vector retrieval, backpressure, lifecycle jobs.

**Senior follow-ups:** What if Redis loses state? When would Streams/Kafka help? How do you cap queue growth? How do you version embeddings? How do you retry RTSP/model failures? Where do traces/metrics go?

## 2. ANPR

**Flow:** OpenCV capture → compressed frame/ID in Redis → Triton `np-detection` → ROI filtering → SORT/DeepSORT → plate crop → Triton recognition for supported scripts → temporal/track aggregation → Redis TTL dedup/rate limiting → MQTT + MinIO + Postgres.

**Why separate stages:** detector and recognizer have different compute profiles and can scale independently. Tracking reduces repeated identity work and allows aggregation across frames. Temporal voting is more robust than trusting one OCR frame.

**Important optimization:** recognition may become the bottleneck when each plate crop is sent independently. Batch multiple crops through Triton when the throughput gain justifies the batching delay.

## 3. Face Recognition

**Flow:** Flask API → DSFD detection (ResNet-152) → MTCNN alignment → ArcFace embedding → cosine comparison / enrollment store.

**Scale discussion:** local file/pickle search is simple but not an enterprise-scale vector index. Normalize embeddings, use FAISS for vector search, calibrate threshold on target data, version embedding model/index and monitor false-accept/false-reject behavior.

## 4. VMS Event Service

**Flow:** MQTT subscription → topic/task mapping → event handlers → Redis progress counters → Postgres system-of-record updates → Centrifugo realtime fan-out → optional external APIs / Kafka webhook.

**Architecture lesson:** transport is separated from task logic. Redis progress avoids writing the DB on every high-volume event. A useful improvement is durable asynchronous execution plus an outbox/idempotency strategy for DB + publish consistency.

## 5. GoVMS

**Flow:** browser/server-rendered UI → Go handlers → services → Postgres/MinIO → external ML/RTSP services → HLS/FFmpeg media path → Centrifugo realtime subscriptions.

**Architecture lesson:** layered monolith can be a good choice when the domain is cohesive. Heavy ML/media processing is externalized. Postgres is system of record; MinIO stores media. RBAC/ACL is centralized rather than scattered through handlers.

## 6. RAG Document Intelligence

Upload → parse/chunk → Sentence-Transformers embeddings → persistent Chroma → similarity/MMR/Multi-Query/HyDE retrieval → LLM → source-grounded answer. Evaluation should separate retrieval quality from generation faithfulness.

## 7. Local AI Gateway / Speech

Client → OpenAI-compatible gateway → provider/model routing → local Ollama or speech inference service → audit/latency/token-cost data. Senior discussion: fallback policy, admission control, model health/readiness, privacy, observability and GPU capacity.

## 8. Function Calling

User intent/context → LLM → structured function call → schema validation/authorization → trusted application function → tool result → final response. Treat the model as planner; never let generated text bypass the application authorization boundary.

## 9. Long-video Football Intelligence

Browser multipart upload → MinIO → restartable chunk stages → detection/tracking → scoreboard OCR consensus → action spotting → evidence fusion → event timeline/clips. This is a strong system-design story for resumability, idempotency, durable checkpoints, artifact lifecycle and long-running AI jobs.
