# Engineering Atlas development guide

## Architecture

Engineering Atlas intentionally uses static HTML, CSS, and classic scripts. There is no runtime package manager, bundler, framework, API, or remote font dependency. Scripts load in a deterministic order from `index.html`, which is why the same application can run from GitHub Pages and directly from an extracted folder.

Key files:

- `index.html`: application shell, metadata, navigation containers, and script order
- `START_HERE.html`: direct-file entry point
- `css/styles.css`: themes, layout, components, lab presentation, and breakpoints
- `js/data.js`: base lessons, projects, questions, sources, and cheats
- `js/expanded-data.js`: expanded lessons, phases, priority mapping, glossary, project evidence, and interview bank
- `js/app.js`: hash routes, render functions, event delegation, and screen state
- `js/simulations.js`: pure calculation models used by labs
- `js/store.js`: schema defaults, migration, validation, export, and import
- `js/scheduler.js`: review intervals, mastery, and queue ordering
- `js/diagrams.js`: dependency-free SVG architecture helpers
- `tests/`: Node built-in tests; no installed dependencies required

## Content model

Lesson IDs are permanent storage keys. Never reuse an ID for a different concept. Every lesson must belong to exactly one educational phase, although it may appear in the priority path and in cross-links. Prerequisites and next-topic links must resolve to real lesson IDs.

Personal project statements require a sanitized source note. Use three evidence levels consistently:

- project experience: supported by supplied work/project context
- public repository evidence: visible in a linked public repository
- general learning material: useful knowledge without a claim of personal production ownership

## Add or edit a lesson

1. Add the topic object in `js/expanded-data.js` near its domain peers.
2. Provide a unique `id`, title, domain, intuition, technical explanation, recall points, interview framing, terms, and useful functions/code.
3. Add valid prerequisites and next topics where they improve progression.
4. Add the ID to exactly one `curriculumPhases[].topics` list.
5. Add it to `priorityPath` only when it is currently high priority.
6. Run the syntax and full integrity suite.

## Add or edit a lab

1. Model the behavior with a deterministic pure function in `js/simulations.js`.
2. Add model tests that express the expected direction or invariant, not brittle incidental markup.
3. Add its controls and explanation renderer in `js/app.js`.
4. Register the visible lab tab once.
5. Associate each label with its input and mark estimates as synthetic.
6. Test narrow and wide layouts in a real browser.

## Other extension points

- Phase: `curriculumPhases` in `js/expanded-data.js`
- Glossary entry: `glossary` in `js/expanded-data.js`
- Project case: base/expanded project arrays plus a sanitized note in `reference/`
- Interview question: `mockQuestions`; include a stable ID, category, rubric, and at least two follow-ups
- Cheat sheet: `cheatsheets`
- Source: `sources`; use a public or repository-local URL and describe exactly what it supports

## Verification

Linux/macOS/Git Bash:

```bash
./tests/run-all.sh
```

PowerShell:

```powershell
./tests/run-all.ps1
```

Before a public release, also inspect representative routes at every documented viewport, check for page-level overflow and console errors, validate production resource responses, scan for confidential material, and test a newly extracted ZIP rather than the working directory.

## Performance guardrails

The catalog is held in memory, but routes render only the current screen. Prefer derived maps and delegated events over attaching handlers to every card. Keep lab math pure and small. Before introducing a framework or build system, demonstrate a measured problem that cannot be handled while preserving deterministic direct-file use.
