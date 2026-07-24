import { X, Zap } from "lucide-react";
import TraceStepCard from "./TraceStepCard";

/** Pull a per-attempt score/feedback summary out of the trace's grade+retry steps. */
function buildRetrySummary(trace) {
  const grades = trace.filter((s) => s.node === "grade");
  if (grades.length <= 1) return null;
  return grades.map((g, i) => ({
    attempt: i + 1,
    score: g.data?.score,
    feedback: g.data?.feedback,
  }));
}

export default function TraceViewer({ trace, onClose }) {
  const retrySummary = trace ? buildRetrySummary(trace) : null;

  return (
    <aside className="flex h-full w-96 shrink-0 flex-col border-l border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Zap size={15} className="text-node-grade" />
          Reasoning trace
        </div>
        <button onClick={onClose} className="rounded p-1 text-ink-faint hover:bg-surface-raised hover:text-ink">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!trace || trace.length === 0 ? (
          <p className="text-sm text-ink-faint">No trace yet - run a query to see step-by-step reasoning here.</p>
        ) : (
          <>
            {retrySummary && (
              <div className="mb-4 rounded-md border border-node-retry/40 bg-node-retry/10 p-3">
                <p className="mb-2 text-xs font-semibold tracking-wide text-node-retry uppercase">
                  Retried {retrySummary.length - 1} time{retrySummary.length - 1 === 1 ? "" : "s"}
                </p>
                <ul className="flex flex-col gap-1.5">
                  {retrySummary.map((r) => (
                    <li key={r.attempt} className="text-xs text-ink-muted">
                      <span className="font-medium text-ink">Attempt {r.attempt}:</span> score {r.score}/10
                      {r.feedback ? ` — ${r.feedback}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {trace.map((step, i) => (
                <TraceStepCard key={i} step={step} />
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
