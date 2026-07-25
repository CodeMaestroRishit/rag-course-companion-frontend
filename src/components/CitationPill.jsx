import { Clock, FileText } from "lucide-react";

export default function CitationPill({ lessonName, locator }) {
  const isPage = locator.startsWith("p.");
  const Icon = isPage ? FileText : Clock;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-soft px-3 py-1 text-xs font-semibold text-accent shadow-sm">
      <Icon size={12} />
      {lessonName} · {locator}
    </span>
  );
}
