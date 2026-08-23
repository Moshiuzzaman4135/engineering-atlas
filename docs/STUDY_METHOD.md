# Study Method — Why This OS Makes You Work Before It Shows the Answer

## The problem it is designed to solve

Reading creates **familiarity**. Interviews require **retrieval**. A concept can look obvious on the page and still disappear when somebody asks, “Why Redis Streams instead of a ZSET?” or “What does `await` actually do?”

The learning loop therefore makes retrieval the default action.

## The loop

### 1. Attempt before reveal
Before opening a lesson, explain the topic aloud. Include: definition, why it exists, one failure mode, one trade-off, and one project connection. An incomplete attempt is useful because it exposes the exact missing edge.

### 2. Learn in two layers
Every topic starts with intuition, then technical interview language. This avoids memorizing terminology without a mental model.

### 3. Connect concepts
Use prerequisites and “next concepts” instead of reading random pages. Async connects to pools/backpressure; pools connect to Postgres capacity; Postgres connects to caching/replicas; those connect to system design.

### 4. Predict in labs
Move a slider only after predicting the direction of change. The useful part is not the synthetic number; it is building causal intuition: larger pool ≠ infinite DB capacity, higher confidence threshold usually trades recall for precision, batching trades wait time for throughput.

### 5. Explain from your own systems
Transfer is strongest when you can say, “I saw this shape in an ANPR pipeline,” rather than giving a dictionary definition. The app labels project-derived experience separately from study-only concepts.

### 6. Space the review
Flashcards return based on your rating. Weak cards return quickly. Strong cards spread out. This creates repeated retrieval over time instead of one huge reading session.

## Research basis

The testing/retrieval effect is supported by experimental work showing stronger delayed retention after retrieval practice than repeated study. Distributed-practice research supports spacing practice over time. The exact scheduler here is intentionally simple; the important behavior is repeated retrieval with expanding intervals.

Primary references are listed in the in-app Sources page.

## A good 90-minute session

- 10 min: due flashcards.
- 35 min: 2–3 connected lessons.
- 20 min: one lab; predict before changing parameters.
- 25 min: one system-design answer plus two rapid questions aloud.

Stop when recall quality collapses. More tired rereading is not automatically more learning.
