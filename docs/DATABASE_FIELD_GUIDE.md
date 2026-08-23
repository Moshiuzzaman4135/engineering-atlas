# Database / SQL Field Guide

## Query optimization order

1. Find the slow/high-volume query from metrics/`pg_stat_statements`.
2. Run `EXPLAIN (ANALYZE, BUFFERS)` on a representative case.
3. Check query shape: unnecessary columns, joins, N+1, huge OFFSET, functions preventing index use.
4. Add or improve indexes only when the access pattern justifies them.
5. Re-run the plan and measure wall time/buffers/rows.
6. Cache genuinely hot/stable reads.
7. Bound connection pools across **all** service replicas.
8. Add read replicas for stale-tolerant read scale after query/index work.
9. Partition/shard only when the data/traffic shape requires it.

## Index intuition

A B-tree helps when the planner can use ordered/selective lookup. A composite index follows the query's filtering/order pattern; column order matters. A partial index stores only rows matching a predicate. A covering/index-only strategy can avoid heap access for suitable queries.

Indexes are not free: each write may update multiple indexes, increasing storage and write amplification.

## `EXPLAIN ANALYZE`

Look for estimated vs actual rows, scan type, loops, sort/hash spill, join strategy, buffers and expensive nodes. A plan that estimates 10 rows but receives 500k often indicates stale/insufficient statistics or correlated predicates.

## MVCC and transactions

PostgreSQL uses multi-version concurrency control. Readers operate against row versions/snapshots rather than blocking every writer. Old versions still need vacuum cleanup. Long-running transactions can delay cleanup and cause bloat.

Keep transactions short. Do not hold a DB transaction open while waiting on an LLM/model/API call.

## Connection pools

Total possible DB connections is roughly:

`service replicas × pool size + admin/jobs/other services`.

If 20 pods each have a pool of 50, that is 1000 potential connections before other clients. Pool wait time is a useful saturation signal.

## Reducing DB load

Use the ladder: **less work → fewer calls → better plan/index → cache → batch writes → replicas → partition/shard**. Scaling application pods first can make a database incident worse by creating more simultaneous queries.
