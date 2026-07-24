import { Plus, GraduationCap } from "lucide-react";

export default function TopBar({ onAddSource }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-2 text-ink">
        <GraduationCap size={20} className="text-accent" />
        <span className="font-semibold">Course Companion</span>
        <span className="hidden text-sm text-ink-faint sm:inline">RAG over your lesson transcripts</span>
      </div>
      <button
        onClick={onAddSource}
        className="flex items-center gap-1.5 rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent-border hover:text-accent"
      >
        <Plus size={16} />
        Add Source
      </button>
    </header>
  );
}
