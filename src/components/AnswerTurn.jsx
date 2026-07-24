import { Zap, Loader2, AlertCircle } from "lucide-react";
import CitationPill from "./CitationPill";
import { extractCitations } from "../lib/format";

export default function AnswerTurn({ turn, onViewTrace, isActiveTrace }) {
  const citations = turn.response ? extractCitations(turn.response) : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-surface-raised px-4 py-2 text-sm text-ink">
          {turn.query}
        </div>
      </div>

      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-surface px-4 py-3">
          {turn.loading && (
            <div className="flex items-center gap-2 text-sm text-ink-faint">
              <Loader2 size={14} className="animate-spin" />
              Thinking through transform → retrieve → rerank → generate…
            </div>
          )}

          {turn.error && (
            <div className="flex items-start gap-2 text-sm text-cat-controversial">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {turn.error}
            </div>
          )}

          {turn.response && (
            <>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink">{turn.response}</p>
              {citations.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {citations.map((c, i) => (
                    <CitationPill key={i} lessonName={c.lessonName} locator={c.locator} />
                  ))}
                </div>
              )}
              {turn.trace && (
                <button
                  onClick={() => onViewTrace(turn)}
                  className={`mt-3 flex items-center gap-1 text-xs font-medium transition-colors ${
                    isActiveTrace ? "text-accent" : "text-ink-faint hover:text-accent"
                  }`}
                >
                  <Zap size={12} />
                  {isActiveTrace ? "Viewing this trace" : "View reasoning trace"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
