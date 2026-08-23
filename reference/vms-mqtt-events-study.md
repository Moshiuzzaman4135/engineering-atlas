# Sanitized Event Service Reference

MQTT ingest → topic/task routing → handlers → Redis progress → PostgreSQL persistence → Centrifugo realtime fan-out → optional external APIs / webhook stream.

Study concepts: transport/business separation, fast progress state vs durable system of record, event fan-out, idempotency, at-least-once handling, outbox and backpressure.
