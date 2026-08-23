# System Design Field Guide

## Start with requirements

Clarify users/clients, core operations, read/write mix, latency target, consistency requirement, durability, ordering, retention, peak traffic, object sizes, security and multi-tenancy.

## Estimate before drawing boxes

Useful rough formulas:

- daily requests = RPS × 86,400
- average in-flight work ≈ RPS × average latency seconds (Little's Law)
- storage = objects/day × object size × retention × replication factor
- network = RPS × payload size

## Draw the high-level path

Client → load balancer/API → stateless service → cache/DB/object storage → async broker/workers → external/model services → events/notifications.

Then identify the **shared bottleneck**. More app replicas do not fix a saturated DB or one GPU model instance.

## Reliability patterns to know

- timeout + bounded retry with backoff/jitter,
- idempotency key,
- circuit breaker,
- bulkhead/concurrency limit,
- bounded queue/backpressure,
- dead-letter path,
- transactional outbox,
- saga/compensation,
- health/readiness and graceful shutdown,
- SLOs, logs, metrics and traces.

## Broker decision shortcut

- **Kafka:** replayable high-throughput event log; partition ordering and consumer groups.
- **RabbitMQ:** work queues/routing, explicit acknowledgements, publisher confirms, prefetch, quorum queues.
- **Redis Streams:** simpler append-only stream with consumer groups/pending entries inside Redis ecosystem.
- **Redis ZSET:** very useful custom ordered/priority/time-scored work structure, but acknowledgements/reclaim/replay semantics are application-built.
- **MQTT:** lightweight topic pub/sub for realtime/device-style event distribution.
- **Celery:** Python task-execution framework that uses a broker; not itself a broker category equivalent to Kafka.

## Senior-level finish

End every design with: bottleneck, failure recovery, observability, security boundary, cost driver and the first thing you would benchmark before scaling.
