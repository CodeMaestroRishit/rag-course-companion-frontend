import { Plus, PanelLeft, History } from "lucide-react";
import Logo from "./Logo";

export default function TopBar({ onAddSource, sourcesOpen, onToggleSources, historyOpen, onToggleHistory }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
      <div className="flex items-center gap-3 text-ink">
        <button
          onClick={onToggleSources}
          title={sourcesOpen ? "Hide sources" : "Show sources"}
          className={`rounded-md p-1.5 transition-colors ${
            sourcesOpen ? "bg-accent-soft text-accent" : "text-ink-faint hover:bg-surface-raised hover:text-ink"
          }`}
        >
          <PanelLeft size={17} />
        </button>
        <div className="flex items-center gap-2">
          <Logo size={22} className="text-accent" />
          <span className="text-[17px] font-bold tracking-tight">SeekPoint</span>
          <span className="hidden text-sm text-ink-faint sm:inline">Find the exact moment.</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onAddSource}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-accent-border hover:text-accent"
        >
          <Plus size={16} />
          Add Source
        </button>
        <button
          onClick={onToggleHistory}
          title={historyOpen ? "Hide history" : "Show history"}
          className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
            historyOpen
              ? "border-accent-border bg-accent-soft text-accent"
              : "border-border text-ink-muted hover:text-ink"
          }`}
        >
          <History size={16} />
          History
        </button>
      </div>
    </header>
  );
}
