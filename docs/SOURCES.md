# Sources — research memory

Record sources here BEFORE relying on them. Do not re-research entries already
recorded. Validate links when first added; note if a link was only read partially.

Format: `topic | title | org/author | URL | type (official/standard/paper/project/
engineering-reference) | notes`

## Already curated in-app

The app itself carries 34 curated sources in `js/data.js` / `js/expanded-data.js`
(`window.InterviewOSData.sources`) covering: Kafka, Redis Streams, RabbitMQ
(confirms/quorum/reliability), PostgreSQL indexes/partial indexes, Kubernetes HPA,
Triton batching/analyzer/metrics, vLLM, YOLO, ArcFace/MTCNN papers, learning science
(Roediger & Karpicke 2006, Cepeda 2006, Dunlosky). Check there before web-fetching.

## Repo-local evidence (sanitized)

- `reference/vision-relay-study.md` — iVip/Vision Relay architecture study
- `reference/py-vision-anpr-study.md` — ANPR pipeline study
- `reference/face-recognition-dnn-study.md` — face recognition study
- `reference/vms-mqtt-events-study.md` — VMS MQTT event service study
- `reference/govms-study.md` — GoVMS study
- `reference/personal-experience.md`, `reference/priority-role-brief.md`
- `docs/SOURCE_NOTES.md` — provenance rules + public GitHub evidence map

## External sources verified this session

- asyncio Task/coroutine semantics | Python docs — Coroutines and Tasks | Python Software Foundation | https://docs.python.org/3/library/asyncio-task.html | official | READ 2026-08-24 (v3.14 page). Extracted: calling async def creates object, runs nothing; create_task wraps+schedules, RuntimeError without running loop; loop keeps WEAK refs to tasks (save references / TaskGroup); Task = Future-like, inherits all Future APIs EXCEPT set_result/set_exception; cooperative scheduling; cancel() semantics incl. uncancel()/cancelling(); gather vs TaskGroup failure semantics; shield; wait_for cancels then raises TimeoutError; to_thread GIL note; eager task factory (3.12+).
- asyncio Future semantics | Python docs — Futures | Python Software Foundation | https://docs.python.org/3/library/asyncio-future.html | official | READ 2026-08-24. Extracted: Future = eventual result holder bridging callback-based code; rule of thumb: never expose Futures in user APIs, create via loop.create_future(); awaitable multiple times, same result; asyncio.Future vs concurrent.futures.Future differences (awaitability, InvalidStateError, call_soon callbacks, cancel msg).
- Python data model (objects/values/types, mutability, containers, hashing, functions/classes internals) | Python docs — Data model chapter 3 | PSF | https://docs.python.org/3/reference/datamodel.html | official | READ 2026-08-24 (v3.14 page). Extracted: every object = identity+type+value; identity never changes; is/id semantics (CPython id = address); type unchangeable; mutability determined by TYPE; immutable container holding mutable member: container still immutable but its VALUE can change via member; c=[];d=[] guaranteed distinct, a=1;b=1 may share (impl detail, don't rely); dict preserves insertion order (3.7+), delete+reinsert moves to end; dict keys must have constant hash → mutable-by-value types excluded; set elements: 1 and 1.0 equal → only one stored; bool subclass of int; function.__closure__ cells + __defaults__ writable (mutable-default trap); bound method = __self__+__func__, x.f(1)≡C.f(x,1); classmethod __self__=class; functions on instances not converted to bound methods; C3 MRO; __slots__; special method lookup on the TYPE not instance; refcounting GC not guaranteed prompt → close explicitly.
- contextlib | Python docs — contextlib | PSF | https://docs.python.org/3/library/contextlib.html | official | READ 2026-08-24 (v3.14). Extracted: @contextmanager generator must yield exactly once; body exception re-raised AT the yield; generator must re-raise unless intentionally suppressing; single-use ("RuntimeError: generator didn't yield" on 2nd use); @asynccontextmanager for async with (FastAPI lifespan pattern); closing()/aclosing() (aclosing = deterministic async-generator cleanup on early break, 3.10); nullcontext for optional CMs; suppress(*exc) removes suppressed members from ExceptionGroups (3.12), reentrant; redirect_stdout/stderr = GLOBAL side effect, not thread-safe, no effect on subprocesses; chdir (3.11) not parallel-safe; ContextDecorator (use as with OR decorator; decorator can't access __enter__ return); ExitStack LIFO callback stack, enter_context/push/callback (callbacks can't suppress)/pop_all() transfer for all-or-nothing acquisition; AsyncExitStack; single-use vs reusable (threading.Lock) vs reentrant (RLock, suppress, redirect_stdout, chdir); ExitStack reusable NOT reentrant (nesting same instance clears at inner exit).
- dataclasses | Python docs — dataclasses | PSF | https://docs.python.org/3/library/dataclasses.html | official | READ 2026-08-24 (v3.14). Extracted: fields = annotated class vars, order preserved; TypeError if non-default field follows default (incl. inheritance, kw reordering); eq+frozen → __hash__ generated; eq=True+frozen=False → __hash__=None (unhashable); eq=False → id-hash inherited; frozen=True → FrozenInstanceError(AttributeError), tiny perf penalty (object.__setattr__); slots=True (3.10+) returns NEW class, TypeError if __slots__ exists, 3.11 skips inherited slot names; kw_only/KW_ONLY (3.10+), kw params moved after positional in generated __init__; mutable default → ValueError (unhashable≈mutable heuristic 3.11+), use field(default_factory=list); __post_init__ called by generated __init__, InitVar pseudo-fields passed to it, replace() re-runs __init__/__post_init__, init=False fields NOT copied by replace; asdict/astuple recurse + deepcopy non-dataclass members; ClassVar excluded; generated __init__ does NOT call base __init__ (call in __post_init__); inheritance fields: reverse-MRO collection, derived overrides.
- The Python Profilers | Python docs — profile/cProfile/pstats | PSF | https://docs.python.org/3/library/profile.html | official | READ 2026-08-24 (v3.14). Extracted: cProfile = deterministic (every call/return/exception event), C ext, recommended; profile = pure Python high overhead; profilers NOT for benchmarking (timeit for that; overhead skews Python-vs-C); ncalls (recursion shown n/primitive), tottime = time in function EXCLUDING subcalls, cumtime = INCLUDING subfunctions (accurate for recursion), percall variants; pstats: sort_stats(SortKey.CUMULATIVE/TIME/NFL...), print_stats(n|fraction|regex), print_callers/print_callees, strip_dirs, add(); python -m cProfile -o out -s sort script; cProfile.Profile context manager (3.8+), enable/disable, dump_stats, runcall; deterministic vs statistical sampling trade-off (sampling = lower overhead, relative indications); accuracy limits: clock resolution + per-event lag accumulates for many-call functions.
- FastAPI Lifespan Events | FastAPI docs — Lifespan Events | tiangolo | https://fastapi.tiangolo.com/advanced/events/ | official | READ 2026-08-24. Extracted: lifespan = async context manager (@asynccontextmanager, async def with yield) passed to FastAPI(lifespan=...); code before yield runs ONCE before first request (startup), after yield once after last (shutdown); use cases: DB pools, ML model loading (module-level load would slow tests); replaces deprecated @app.on_event("startup"/"shutdown") — all-lifespan or all-events, not both; underlying ASGI Lifespan Protocol (startup/shutdown events); lifespan only runs for the MAIN app, not mounted sub-applications.
- asyncpg API | asyncpg docs — API Reference | MagicStack | https://magicstack.github.io/asyncpg/current/api/index.html | official | READ 2026-08-24 (pool + connection sections). Extracted: connect(timeout=60, statement_cache_size=100, command_timeout=None, ssl='prefer' default, server_settings, target_session_attrs any/primary/standby/read-write); Pool: create_pool(min_size,max_size), pool.acquire()/release(), async with pool.acquire() as conn, pool.close() graceful vs terminate(), get_idle_size/get_size, expire_connections(); Pool calls Connection.reset() before handing a connection to the next acquirer; Connection.transaction() async CM; executemany atomic since 0.22; prepared-statement LRU cache per connection.

## Pending research queue

- Python docs: asyncio event loop / Tasks / TaskGroup / primitives
- PostgreSQL: MVCC, EXPLAIN, index types
- vLLM PagedAttention paper; Triton dynamic batching (in-app source exists)
- FAISS wiki (IndexFlatIP/IndexIDMap2)
- ArcFace (in-app), DSFD, MTCNN papers
- MQTT OASIS spec QoS semantics
