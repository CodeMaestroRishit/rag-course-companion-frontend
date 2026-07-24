import { Clock, FileText } from "lucide-react";

export default function CitationPill({ lessonName, locator }) {
  const isPage = locator.startsWith("p.");
  const Icon = isPage ? FileText : Clock;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-accent-border bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
      <Icon size={11} />
      {lessonName} · {locator}
    </span>
  );
}
