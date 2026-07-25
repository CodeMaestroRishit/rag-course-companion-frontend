import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function QueryInput({ placeholder, onSubmit, disabled, value }) {
  const [text, setText] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) setText(value);
  }, [value]);

  function submit() {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setText("");
  }

  return (
    <div className="flex items-end gap-2 border-t border-border bg-surface p-3">
      <textarea
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder={placeholder}
        className="min-h-10 flex-1 resize-none rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-ink placeholder-ink-faint outline-none focus:border-accent-border"
      />
      <button
        onClick={submit}
        disabled={disabled || !text.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-on-accent transition-opacity disabled:opacity-40"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
