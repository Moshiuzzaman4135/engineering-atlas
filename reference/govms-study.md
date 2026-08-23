# Sanitized Video Management Reference

Go layered monolith: handlers → services → PostgreSQL/MinIO plus external ML/RTSP/Centrifugo integrations. FFmpeg/HLS handles media conversion/playback. RBAC/ACL is centralized. Heavy ML/media compute is delegated so the web server remains responsive.

No Redis/Kafka/task queue is assumed in this service itself; those belong to adjacent services where applicable.
