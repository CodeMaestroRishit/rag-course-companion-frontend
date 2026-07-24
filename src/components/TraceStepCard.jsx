import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { NODE_COLORS } from "../lib/format";

export default function TraceStepCard({ step }) {
  const [expanded, setExpanded] = useState(false);
  const hasData = step.data && Object.keys(step.data).length > 0;
  const color = NODE_COLORS[step.node] || "var(--color-ink-faint)";

  return (
    <div className="relative pl-5">
      <span
        className="absolute top-2 left-0 h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="rounded-md border border-border-soft bg-surface-raised px-3 py-2">
        <button
          onClick={() => hasData && setExpanded((e) => !e)}
          className="flex w-full items-start gap-2 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className="rounded px-1.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase"
                style={{ color, backgroundColor: `${color}22` }}
              >
                {step.node}
              </span>
              {step.timestamp && (
                <span className="text-[11px] text-ink-faint">
                  {new Date(step.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-ink">{step.summary}</p>
          </div>
          {hasData && (
            <ChevronRight
              size={14}
              className={`mt-1 shrink-0 text-ink-faint transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          )}
        </button>
        {expanded && hasData && (
          <pre className="mt-2 overflow-x-auto rounded bg-canvas p-2 text-[11px] text-ink-muted">
            {JSON.stringify(step.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
