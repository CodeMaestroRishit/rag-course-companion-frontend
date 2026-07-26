import { Clock, FileText, Hash } from "lucide-react";

export default function CitationPill({ lessonName, locator }) {
  const isPage = locator.startsWith("p.");
  const isSection = locator.startsWith("§");
  const Icon = isPage ? FileText : isSection ? Hash : Clock;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-soft px-3 py-1 text-xs font-semibold text-accent shadow-sm">
      <Icon size={12} />
      {lessonName} · {locator}
    </span>
  );
}
