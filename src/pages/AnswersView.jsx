import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import AnswerTurn from "../components/AnswerTurn";
import QueryInput from "../components/QueryInput";
import TraceViewer from "../components/TraceViewer";
import { postQuery } from "../lib/api";

let turnIdCounter = 0;

export default function AnswersView({ command, onHistoryEntry }) {
  const [turns, setTurns] = useState([]);
  const [traceOpen, setTraceOpen] = useState(false);
  const [activeTraceTurnId, setActiveTraceTurnId] = useState(null);
  const scrollRef = useRef(null);

  async function runQuery(query) {
    const id = ++turnIdCounter;
    setTurns((prev) => [...prev, { id, query, loading: true }]);

    try {
      const { response, trace, sources } = await postQuery(query);
      setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, loading: false, response, trace, sources } : t)));
      setActiveTraceTurnId(id);
      onHistoryEntry({ id, type: "answer", query, timestamp: Date.now(), response, trace });
    } catch (err) {
      setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, loading: false, error: err.message } : t)));
    }
  }

  useEffect(() => {
    if (command) runQuery(command.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command?.nonce]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const isLoading = turns.some((t) => t.loading);
  const activeTrace = turns.find((t) => t.id === activeTraceTurnId)?.trace ?? null;

  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-2">
          <p className="text-sm text-ink-faint">Ask a question about the ingested lessons.</p>
          <button
            onClick={() => setTraceOpen((o) => !o)}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
              traceOpen
                ? "border-accent-border bg-accent-soft text-accent"
                : "border-border text-ink-muted hover:text-ink"
            }`}
          >
            <Zap size={13} />
            {traceOpen ? "Hide trace" : "Show trace"}
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {turns.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-ink-faint">
              <p className="text-sm">No questions yet.</p>
              <p className="text-xs">
                Try: "What is the difference between React Native and Expo?"
              </p>
            </div>
          )}
          {turns.map((turn) => (
            <AnswerTurn
              key={turn.id}
              turn={turn}
              isActiveTrace={traceOpen && activeTraceTurnId === turn.id}
              onViewTrace={(t) => {
                setActiveTraceTurnId(t.id);
                setTraceOpen(true);
              }}
            />
          ))}
        </div>

        <QueryInput placeholder="Type a query here..." onSubmit={runQuery} disabled={isLoading} />
      </div>

      {traceOpen && <TraceViewer trace={activeTrace} onClose={() => setTraceOpen(false)} />}
    </div>
  );
}
