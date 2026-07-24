# RAG course companion — frontend

React + Vite + Tailwind CSS UI for the backend at `../server.js`. Talks to it
over plain `fetch` (no axios).

## What it does

- **Answers tab** — ask a question, get a cited answer rendered as a chat
  thread. Citations extracted from the answer text render as clickable pill
  badges (`lessonName · mm:ss`). A toggleable right-side panel shows the full
  `state.trace` from the backend as a colored, expandable step timeline —
  including a retry summary (per-attempt scores + feedback) if the backend
  looped through CRAG retries.
- **Clips tab** — **Browse** mode filters ingested clips by category and a
  min-confidence slider (pure metadata query, no LLM call on the backend).
  **Search** mode sends a natural-language request and gets back a single
  best-match clip pick, with its own trace viewable the same way.
- **History sidebar** — every query (from either tab) is logged with a
  relative timestamp and persisted to `localStorage`. Clicking a past entry
  switches to the right tab and re-runs it against the backend. Quick filters
  narrow the list to clip-searches only, or to queries where the backend
  actually retried (CRAG kicked in).
- **Add Source modal** — **PDF, YouTube Link, and VTT/SRT are live**: each
  opens a small form that uploads/submits directly to the backend's
  `/sources/*` endpoints and shows a loading state, then a success ("Ingested
  N chunks") or error banner. Web Link and Text are still "coming soon" stubs
  — the backend has no ingestion path for either yet.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL - see below
npm run dev
```

Requires the backend, Chroma, and ingested data to already be running — see
[rag-course-companion](https://github.com/CodeMaestroRishit/rag-course-companion).
Without a reachable backend, the layout renders fine but every request shows
an inline error state.

## Deploying to Vercel

This is a static Vite build, which is exactly what Vercel is for (unlike the
backend, which lives in its own repo and deploys to Render instead — see
[rag-course-companion](https://github.com/CodeMaestroRishit/rag-course-companion)):

1. This repo ([rag-course-companion-frontend](https://github.com/CodeMaestroRishit/rag-course-companion-frontend))
   is already on GitHub.
2. In Vercel: **Add New** → **Project**, import the repo (Vercel
   auto-detects the Vite framework preset — no `vercel.json` needed for a
   single-page app like this one; no Root Directory override needed either,
   since this repo *is* the frontend now rather than a subfolder of it).
3. Add an environment variable: `VITE_API_URL` = your deployed Render backend
   URL (e.g. `https://rag-course-companion.onrender.com`). It must be set
   *before* the build, since Vite inlines `import.meta.env.VITE_API_URL` at
   build time — changing it later requires a redeploy, not just a restart.
4. Deploy. If the Render backend is on a free-tier equivalent that spins down
   when idle, the first request after a lull can take 30-60s to wake it up —
   not a frontend bug if a query seems to hang on first try after a while.

## Known limitations

- **Citation extraction is regex-based**, not structured. The backend's QA
  prompt asks for `(Lesson Name, mm:ss)` citations but doesn't enforce that
  shape via structured output, so the frontend's `extractCitations()` in
  `src/lib/format.js` tolerates some variation (extra quotes, a "Lesson:"
  prefix, two timestamps joined by "and") but isn't bulletproof against every
  phrasing the LLM might produce.
- **No routing library** — tab switching is plain React state, not URL-backed.
  Refreshing the page always lands on the Answers tab (history persists via
  `localStorage`, but the active tab doesn't).
- **History "re-run" always calls the backend again** rather than replaying
  the cached result, so retried/graded results can differ between the
  original run and a re-run from history — this is intentional (it's actually
  a decent way to see the CRAG loop's non-determinism) but worth knowing.
- **No pagination** on Browse mode - `limit` caps results (default 20) with no
  "load more."
- **Mobile/responsive is not implemented** - this was explicitly low priority
  in the spec. The three-column layout (sidebar / main / trace panel) will
  overflow on narrow viewports.
- **Add Source ingestion is synchronous** - the form's loading state can sit
  there for a while on a long video/PDF, since every chunk gets its own
  classification LLM call server-side. Web Link and Text remain UI-only stubs.
- **No source list/management UI** - there's no way to see what's already
  been ingested or delete a source from the frontend; that's Chroma-CLI-only
  for now.
