import { useState } from "react";
import { Check, Copy, Clock, FileText, ChevronDown } from "lucide-react";
import { formatTimestamp, CATEGORY_COLORS, CATEGORY_EMOJI } from "../lib/format";

/** Normalized clip shape: { lessonName, startTime, endTime, category, confidence?, reason, sourceType?, sourceText? } */
export default function ClipCard({ clip }) {
  const [copied, setCopied] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const color = CATEGORY_COLORS[clip.category] || CATEGORY_COLORS.none;
  const emoji = CATEGORY_EMOJI[clip.category] || CATEGORY_EMOJI.none;
  const isPdf = clip.sourceType === "pdf";
  const range = isPdf ? `p. ${clip.startTime}` : `${formatTimestamp(clip.startTime)}-${formatTimestamp(clip.endTime)}`;
  const copyLabel = isPdf ? "Copy page" : "Copy timestamp";

  async function copyRange() {
    try {
      await navigator.clipboard.writeText(range);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable (e.g. insecure context) - fail silently, button just won't confirm
    }
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 shadow-md transition-shadow hover:shadow-lg"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-base font-semibold text-ink">{clip.lessonName}</p>
        <span
          className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide"
          style={{ color, backgroundColor: `${color}22` }}
        >
          <span aria-hidden className="text-sm">
            {emoji}
          </span>
          {clip.category.toUpperCase()}
          {clip.confidence !== undefined ? ` · ${clip.confidence}/10` : ""}
        </span>
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">{clip.reason}</p>

      <div className="mt-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-faint">
          {isPdf ? <FileText size={13} /> : <Clock size={13} />}
          {range}
        </span>
        <button
          onClick={copyRange}
          className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-accent-border hover:text-accent"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : copyLabel}
        </button>
      </div>

      {clip.sourceText && (
        <>
          <button
            onClick={() => setSourceOpen((o) => !o)}
            className={`flex items-center gap-1 text-xs font-medium transition-colors ${
              sourceOpen ? "text-accent" : "text-ink-faint hover:text-accent"
            }`}
          >
            {sourceOpen ? "Hide source passage" : "View source passage"}
            <ChevronDown size={12} className={`transition-transform ${sourceOpen ? "rotate-180" : ""}`} />
          </button>
          {sourceOpen && (
            <blockquote className="line-clamp-6 border-l-2 border-border bg-surface-raised p-2.5 text-xs text-ink-muted">
              {clip.sourceText}
            </blockquote>
          )}
        </>
      )}
    </div>
  );
}
