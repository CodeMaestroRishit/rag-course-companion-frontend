import { useState } from "react";
import { Check, Copy, Clock, FileText } from "lucide-react";
import { formatTimestamp, CATEGORY_COLORS } from "../lib/format";

/** Normalized clip shape: { lessonName, startTime, endTime, category, confidence?, reason, sourceType? } */
export default function ClipCard({ clip }) {
  const [copied, setCopied] = useState(false);
  const color = CATEGORY_COLORS[clip.category] || CATEGORY_COLORS.none;
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
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-ink">{clip.lessonName}</p>
        <span
          className="shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase"
          style={{ color, backgroundColor: `${color}22` }}
        >
          {clip.category}
          {clip.confidence !== undefined ? ` · ${clip.confidence}/10` : ""}
        </span>
      </div>

      <p className="line-clamp-3 text-sm text-ink-muted">{clip.reason}</p>

      <div className="mt-1 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-ink-faint">
          {isPdf ? <FileText size={12} /> : <Clock size={12} />}
          {range}
        </span>
        <button
          onClick={copyRange}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-ink-muted transition-colors hover:border-accent-border hover:text-accent"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : copyLabel}
        </button>
      </div>
    </div>
  );
}
