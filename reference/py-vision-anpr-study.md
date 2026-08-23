# Sanitized ANPR Architecture Reference

OpenCV capture → Redis ZSET/frame state → Triton plate detector → ROI filtering → SORT/DeepSORT → Triton recognition → temporal aggregation → Redis TTL dedup/rate limiting → MQTT/MinIO/Postgres.

Key study point: detector and recognizer are separate performance stages. Recognition crop calls can become the bottleneck; batching plate crops through Triton can raise throughput if batch-wait latency remains acceptable.
