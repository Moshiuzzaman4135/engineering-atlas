# Python Async Field Guide

## Mental model

`asyncio` is cooperative concurrency. One event loop runs ready tasks. A coroutine keeps running until it reaches an await point that yields. While it waits on non-blocking I/O, the loop can run another task.

### `async def`
Defines a coroutine function. Calling it returns a coroutine object; it does not execute the body to completion immediately.

### `await`
Suspends the current coroutine until the awaited operation can progress/finish. It only helps concurrency when the awaited operation actually yields control.

### Task
`asyncio.create_task(coro())` schedules a coroutine for concurrent progress on the event loop.

### Future
A lower-level awaitable representing a result that will become available later.

## The interview traps

- `async` does **not** make CPU-heavy Python parallel.
- Calling blocking `requests`, filesystem work or long CPU loops inside `async def` can block every request using that event loop.
- Unlimited `create_task` is not scalability. Downstream DB/GPU/HTTP capacity must still be bounded.
- A huge DB pool does not create more Postgres capacity.
- Fire-and-forget tasks need ownership, error handling and shutdown behavior.

## GIL

In CPython, the Global Interpreter Lock generally prevents multiple threads in one process from executing Python bytecode simultaneously. Threads still help I/O because many blocking operations release the GIL. NumPy/OpenCV/native/GPU kernels may execute outside Python bytecode. For true CPU-heavy Python parallelism, use processes/native code/distributed workers.

## Structured concurrency

`asyncio.TaskGroup` scopes child tasks under a parent operation. If one child fails, the group coordinates sibling cancellation and surfaces errors. This is safer than orphaned background tasks.

## Bounded concurrency

Use a semaphore or worker/queue boundary around scarce resources:

```python
sem = asyncio.Semaphore(20)

async def call_model(item):
    async with sem:
        return await client.infer(item)
```

The number 20 must come from measured downstream capacity, not superstition.

## Debugging a slow async API

Separate:

1. request queue / load balancer wait,
2. event-loop lag,
3. DB-pool acquisition wait,
4. SQL execution time,
5. HTTP/model dependency wait,
6. CPU work,
7. serialization/network time.

A p95 endpoint number alone cannot tell you which one is slow.
