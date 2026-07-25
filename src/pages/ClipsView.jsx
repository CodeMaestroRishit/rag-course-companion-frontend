import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Zap, ListFilter, Search, Info, X } from "lucide-react";
import ClipCard from "../components/ClipCard";
import QueryInput from "../components/QueryInput";
import TraceViewer from "../components/TraceViewer";
import { getClips, searchClips } from "../lib/api";
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_EMOJI } from "../lib/format";

function normalizeBrowseClip(c) {
  return {
    lessonName: c.lessonName,
    startTime: c.startTime,
    endTime: c.endTime,
    category: c.category,
    confidence: c.categoryConfidence,
    reason: c.categoryReason,
    sourceType: c.sourceType,
  };
}

function normalizeSearchClip(c) {
  return {
    lessonName: c.lessonName,
    startTime: c.startTime,
    endTime: c.endTime,
    category: c.category,
    confidence: undefined,
    reason: c.pitch,
    sourceType: c.sourceType,
    sourceText: c.sourceText,
  };
}

export default function ClipsView({ command, onHistoryEntry }) {
  const [mode, setMode] = useState("browse"); // "browse" | "search"
  const [infoOpen, setInfoOpen] = useState(true);

  // Browse mode state
  const [category, setCategory] = useState("all");
  const [minConfidence, setMinConfidence] = useState(0);
  const [browseResults, setBrowseResults] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [browseError, setBrowseError] = useState(null);

  // Search mode state
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [traceOpen, setTraceOpen] = useState(false);

  async function applyFilters() {
    setBrowseLoading(true);
    setBrowseError(null);
    try {
      const results = await getClips({ category, minConfidence, limit: 20 });
      setBrowseResults(results);
    } catch (err) {
      setBrowseError(err.message);
    } finally {
      setBrowseLoading(false);
    }
  }

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(query) {
    setMode("search");
    setSearchLoading(true);
    setSearchError(null);
    setSearchResult(null);
    try {
      const clip = await searchClips(query);
      setSearchResult(clip);
      onHistoryEntry({ id: Date.now(), type: "clip", query, timestamp: Date.now(), response: clip.pitch, trace: clip.trace });
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearchLoading(false);
    }
  }

  useEffect(() => {
    if (command) runSearch(command.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command?.nonce]);

  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="flex items-center gap-2 border-b border-border-soft px-4 py-3">
          <button
            onClick={() => setMode("browse")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
              mode === "browse" ? "bg-accent-soft text-accent shadow-sm" : "text-ink-muted hover:text-ink"
            }`}
          >
            <ListFilter size={15} />
            Browse
          </button>
          <button
            onClick={() => setMode("search")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
              mode === "search" ? "bg-accent-soft text-accent shadow-sm" : "text-ink-muted hover:text-ink"
            }`}
          >
            <Search size={15} />
            Search
          </button>
        </div>

        {infoOpen && (
          <div className="mx-4 mt-3 flex items-start gap-2.5 rounded-lg border border-accent-border bg-accent-soft px-3.5 py-3 text-sm text-ink">
            <Info size={16} className="mt-0.5 shrink-0 text-accent" />
            <p className="flex-1">
              <strong className="text-accent">Clip Finder:</strong> find clip-worthy moments in your ingested
              lessons. <strong>Browse</strong> filters everything already tagged funny, insightful, controversial,
              emotional, or informative by a confidence score. <strong>Search</strong> describes a moment in plain
              language (e.g. "something funny about job interviews") and returns the single best match with an
              exact timestamp - ready to clip and repurpose.
            </p>
            <button
              onClick={() => setInfoOpen(false)}
              className="shrink-0 rounded p-1 text-ink-faint transition-colors hover:bg-surface hover:text-ink"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {mode === "browse" ? (
          <>
            <div className="flex flex-wrap items-end gap-4 border-b border-border-soft px-4 py-3">
              <div className="flex flex-col gap-1.5 text-xs text-ink-muted">
                Category
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setCategory("all")}
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${
                      category === "all"
                        ? "border-accent-border bg-accent-soft text-accent"
                        : "border-border text-ink-muted hover:text-ink"
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((c) => {
                    const color = CATEGORY_COLORS[c];
                    const active = category === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide transition-opacity"
                        style={
                          active
                            ? { color, backgroundColor: `${color}22`, borderColor: `${color}66` }
                            : { color: "var(--color-ink-faint)", borderColor: "var(--color-border)" }
                        }
                      >
                        <span aria-hidden>{CATEGORY_EMOJI[c]}</span>
                        {c[0].toUpperCase() + c.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex flex-col gap-1 text-xs text-ink-muted">
                Min confidence: <span className="text-ink">{minConfidence}</span>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(Number(e.target.value))}
                  className="w-40 accent-accent"
                />
              </label>

              <button
                onClick={applyFilters}
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
              >
                Apply filters
              </button>
            </div>

            <div className="flex-1 p-4">
              {browseLoading && (
                <div className="flex items-center gap-2 text-sm text-ink-faint">
                  <Loader2 size={14} className="animate-spin" /> Loading clips…
                </div>
              )}
              {browseError && (
                <div className="flex items-center gap-2 text-sm text-cat-controversial">
                  <AlertCircle size={14} /> {browseError}
                </div>
              )}
              {!browseLoading && !browseError && browseResults.length === 0 && (
                <p className="text-sm text-ink-faint">No clips match these filters.</p>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {browseResults.map((c) => (
                  <ClipCard key={c.id} clip={normalizeBrowseClip(c)} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 p-4">
              {searchLoading && (
                <div className="flex items-center gap-2 text-sm text-ink-faint">
                  <Loader2 size={14} className="animate-spin" /> Finding the best clip…
                </div>
              )}
              {searchError && (
                <div className="flex items-center gap-2 text-sm text-cat-controversial">
                  <AlertCircle size={14} /> {searchError}
                </div>
              )}
              {!searchLoading && !searchError && !searchResult && (
                <p className="text-sm text-ink-faint">Describe the kind of moment you're looking for.</p>
              )}
              {searchResult && (
                <div className="max-w-lg">
                  <ClipCard clip={normalizeSearchClip(searchResult)} />
                  <button
                    onClick={() => setTraceOpen((o) => !o)}
                    title="See how this clip was picked: query transform, retrieval, reranking, grading, and any retries"
                    className={`mt-3 flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all ${
                      traceOpen
                        ? "border-accent bg-accent text-on-accent shadow-md"
                        : "border-accent-border bg-accent-soft text-accent hover:shadow-md"
                    }`}
                  >
                    <Zap size={13} />
                    {traceOpen ? "Hide trace" : "Show trace"}
                  </button>
                </div>
              )}
            </div>
            <QueryInput placeholder="Find a clip about..." onSubmit={runSearch} disabled={searchLoading} />
          </>
        )}
      </div>

      {mode === "search" && traceOpen && (
        <TraceViewer trace={searchResult?.trace ?? []} onClose={() => setTraceOpen(false)} />
      )}
    </div>
  );
}
