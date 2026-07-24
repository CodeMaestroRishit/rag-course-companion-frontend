import { useMemo, useState } from "react";
import { History, MessageSquare, Film, RotateCcw } from "lucide-react";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "clips", label: "Clips only" },
  { id: "retried", label: "Trace-heavy" },
];

function relativeTime(ts) {
  const diffMs = Date.now() - ts;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function HistorySidebar({ history, onSelect }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "clips") return history.filter((h) => h.type === "clip");
    if (filter === "retried") return history.filter((h) => h.trace?.some((s) => s.node === "retry"));
    return history;
  }, [history, filter]);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border-soft px-3 py-3 text-sm font-semibold text-ink-muted">
        <History size={15} />
        History
      </div>

      <div className="flex gap-1 border-b border-border-soft px-2 py-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
              filter === f.id ? "bg-accent-soft text-accent" : "text-ink-faint hover:text-ink-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filtered.length === 0 && (
          <p className="px-2 py-4 text-sm text-ink-faint">
            {history.length === 0 ? "No queries yet." : "Nothing matches this filter."}
          </p>
        )}
        <ul className="flex flex-col gap-1">
          {filtered.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item)}
                className="group flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-surface-raised"
              >
                <div className="flex w-full items-center gap-1.5">
                  {item.type === "clip" ? (
                    <Film size={12} className="shrink-0 text-cat-insightful" />
                  ) : (
                    <MessageSquare size={12} className="shrink-0 text-node-retrieve" />
                  )}
                  <span className="line-clamp-1 flex-1 text-sm text-ink">{item.query}</span>
                  <RotateCcw size={12} className="shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <span className="pl-[18px] text-xs text-ink-faint">{relativeTime(item.timestamp)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
