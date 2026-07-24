import { MessageSquare, Film } from "lucide-react";

const TABS = [
  { id: "answers", label: "Answers", icon: MessageSquare },
  { id: "clips", label: "Clips", icon: Film },
];

export default function BottomTabs({ activeTab, onChange }) {
  return (
    <nav className="flex h-14 shrink-0 items-center justify-center gap-2 border-t border-border bg-surface px-4">
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-accent-soft text-accent"
                : "text-ink-muted hover:bg-surface-raised hover:text-ink"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
