# Priority Interview Coverage

This document is a generic senior production-AI checklist. The app places these topics at the top without tying the repository to a specific employer.

## Production AI runtime
Agent/runtime architecture, harness optimization, tool calling, routing, memory/state, RAG/context, retries/repair, guardrails, evals, tracing and cost/latency trade-offs.

## Local / open model infrastructure
GPU capacity, Triton batching, vLLM concepts, quantization, model instances, queue/concurrency limits, readiness, Kubernetes autoscaling and fallback/routing.

## Python backend
Event loop, coroutine/Task/Future, GIL, thread/process/async choice, TaskGroup, cancellation, semaphores, bounded queues, FastAPI lifespan, DB pools and profiling.

## Data and distributed systems
PostgreSQL query plans/indexing/MVCC/locks, DB load reduction, Redis data structures, Kafka, RabbitMQ, MQTT, Celery, idempotency, backpressure, load balancing, capacity and reliability patterns.

## AI/ML foundations
Evaluation, bias/variance, metrics, embeddings/cosine, vector search, drift, RAG retrieval metrics and model-serving measurements.

## Computer vision transfer
YOLO/detection, IoU/NMS, tracking, ANPR/OCR, face recognition/ArcFace/FAISS, MMC, motion, scene sampling, VLM/video intelligence.

## Senior communication
Requirements first, quantify scale, draw the high-level flow, identify bottleneck, discuss failure recovery, security, observability, cost and explicit trade-offs. Anchor the answer to a real project when supported.
