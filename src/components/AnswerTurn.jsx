import { useState } from "react";
import { Zap, Loader2, AlertCircle, Library, ChevronDown, Clock, FileText } from "lucide-react";
import CitationPill from "./CitationPill";
import { extractCitations } from "../lib/format";

export default function AnswerTurn({ turn, onViewTrace, isActiveTrace }) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const citations = turn.response ? extractCitations(turn.response) : [];
  const sources = turn.sources?.filter((s) => s.text) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-surface-raised px-4 py-2.5 text-[15px] text-ink shadow-sm">
          {turn.query}
        </div>
      </div>

      <div className="flex justify-start">
        <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-border bg-surface px-5 py-4 shadow-md">
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
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-ink">{turn.response}</p>
              {citations.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {citations.map((c, i) => (
                    <CitationPill key={i} lessonName={c.lessonName} locator={c.locator} />
                  ))}
                </div>
              )}
              <div className="mt-3 flex items-center gap-3">
                {turn.trace && (
                  <button
                    onClick={() => onViewTrace(turn)}
                    className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                      isActiveTrace ? "text-accent" : "text-ink-faint hover:text-accent"
                    }`}
                  >
                    <Zap size={12} />
                    {isActiveTrace ? "Viewing this trace" : "View reasoning trace"}
                  </button>
                )}
                {sources.length > 0 && (
                  <button
                    onClick={() => setSourcesOpen((o) => !o)}
                    className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                      sourcesOpen ? "text-accent" : "text-ink-faint hover:text-accent"
                    }`}
                  >
                    <Library size={12} />
                    {sourcesOpen ? "Hide sources" : `Show sources (${sources.length})`}
                    <ChevronDown size={12} className={`transition-transform ${sourcesOpen ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>

              {sourcesOpen && sources.length > 0 && (
                <div className="mt-2 flex flex-col gap-2">
                  {sources.map((s, i) => {
                    const Icon = s.sourceType === "pdf" ? FileText : Clock;
                    return (
                      <div key={i} className="rounded-md border border-border-soft bg-surface-raised p-2.5">
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-accent">
                          <Icon size={11} />
                          {s.lessonName} · {s.locator}
                        </div>
                        <blockquote className="line-clamp-4 border-l-2 border-border pl-2 text-xs text-ink-muted">
                          {s.text}
                        </blockquote>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
