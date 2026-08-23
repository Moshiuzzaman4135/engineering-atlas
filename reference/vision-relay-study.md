# Sanitized Video Intelligence Architecture Reference

High-level study summary derived from supplied project notes. No credentials, private endpoints or source code are included.

FastAPI job control → Celery extraction → MinIO media → Redis ZSET/Hash work/progress → analytics services → PostgreSQL durable events → MQTT realtime publish. Scene detection emits representative frames for VLM analytics. Chroma stores multimodal embeddings + metadata; FAISS supports normalized-vector face watchlist search.

Interview concepts: producer-consumer, pipeline, pub/sub, CQRS-like transient/durable separation, backpressure, object storage, vector retrieval, retries/circuit breakers, lifecycle cleanup, observability and embedding versioning.
