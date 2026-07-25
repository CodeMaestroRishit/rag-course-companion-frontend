import { useEffect, useState } from "react";
import { Plus, Library, FileText, SquarePlay, Loader2 } from "lucide-react";
import { getSources } from "../lib/api";

export default function SourcesSidebar({ onAddSource, refreshKey }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSources()
      .then((result) => {
        if (!cancelled) setSources(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border-soft px-3 py-3 text-sm font-semibold text-ink-muted">
        <Library size={15} />
        Sources
        {sources.length > 0 && <span className="text-ink-faint">· {sources.length}</span>}
      </div>

      <div className="px-2 py-2">
        <button
          onClick={onAddSource}
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-accent-border hover:text-accent"
        >
          <Plus size={15} />
          Add source
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-1">
        {loading && (
          <div className="flex items-center gap-2 px-2 py-3 text-sm text-ink-faint">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        )}
        {error && <p className="px-2 py-3 text-sm text-cat-controversial">{error}</p>}
        {!loading && !error && sources.length === 0 && (
          <p className="px-2 py-4 text-sm text-ink-faint">No sources ingested yet.</p>
        )}
        <ul className="flex flex-col gap-0.5">
          {sources.map((s) => {
            const Icon = s.sourceType === "pdf" ? FileText : SquarePlay;
            return (
              <li key={s.sourceId} className="flex items-start gap-2 rounded-md px-2 py-2 hover:bg-surface-raised">
                <Icon size={14} className="mt-0.5 shrink-0 text-ink-faint" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm text-ink">{s.lessonName}</p>
                  <p className="text-xs text-ink-faint">
                    {s.chunkCount} chunk{s.chunkCount === 1 ? "" : "s"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
