import { MessageSquare, Film } from "lucide-react";

const TABS = [
  { id: "answers", label: "Answers", icon: MessageSquare },
  { id: "clips", label: "Clips", icon: Film },
];

export default function BottomTabs({ activeTab, onChange }) {
  return (
    <nav className="flex h-16 shrink-0 items-center justify-center gap-3 border-t border-border bg-surface-raised px-4">
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
              active
                ? "bg-accent text-on-accent shadow-[0_8px_20px_-4px_var(--color-accent)] scale-105"
                : "border-2 border-border bg-surface text-ink-muted hover:border-accent-border hover:text-accent"
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
