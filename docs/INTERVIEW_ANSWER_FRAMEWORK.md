# Interview Answer Framework

## For a technology question

Use **WHAT → WHY → HOW → FAILURE → TRADE-OFF → MY EXAMPLE**.

Example for Kafka:

- **What:** distributed append-only event log partitioned for scale.
- **Why:** durable replayable event streams and independent consumers.
- **How:** producer key selects partition; consumers in a group divide partitions; offsets track progress.
- **Failure:** lag, poison messages, partition skew, rebalances, downstream saturation.
- **Trade-off:** more operational complexity than lightweight task queues/pub-sub.
- **My example:** connect to event/webhook architecture only where you actually used or evaluated Kafka.

## For a system-design question

Use **Requirements → Estimate → API → Data → Components → Critical path → Scale → Failure → Security → Observability → Trade-offs**.

Do not start by naming technologies. Start with what the system has to guarantee.

## For “why this vs that?”

State the decision axis first. Example: “Kafka vs RabbitMQ depends on replayable log semantics and partition scale versus queue routing/acknowledgement semantics.” This sounds much stronger than saying one is “faster.”

## For a project walkthrough

Use **Problem → Constraints → Architecture → Your decisions → One failure/bottleneck → Improvement → Result/learning**.

Avoid listing a stack. Explain why each component exists in the data flow.
