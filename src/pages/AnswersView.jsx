import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import AnswerTurn from "../components/AnswerTurn";
import QueryInput from "../components/QueryInput";
import TraceViewer from "../components/TraceViewer";
import Logo from "../components/Logo";
import { postQuery } from "../lib/api";

let turnIdCounter = 0;

const EXAMPLE_QUESTIONS = [
  "What is the difference between React Native and Expo?",
  "Summarize the key ideas from my sources",
  "What's something insightful I've saved?",
];

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
  const traceReadyUnseen = !traceOpen && activeTrace && activeTrace.length > 0;

  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-2">
          <p className="text-sm text-ink-faint">Ask a question about the ingested lessons.</p>
          <button
            onClick={() => setTraceOpen((o) => !o)}
            title="See how this answer was generated: query transform, retrieval, reranking, grading, and any retries"
            className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all ${
              traceOpen
                ? "border-accent bg-accent text-on-accent shadow-md"
                : traceReadyUnseen
                  ? "border-accent bg-accent-soft text-accent shine"
                  : "border-accent-border bg-accent-soft text-accent hover:shadow-md"
            }`}
          >
            <Zap size={14} />
            {traceOpen ? "Hide trace" : "Show trace"}
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {turns.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft">
                <Logo size={36} className="text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink">Welcome to SeekPoint</h2>
                <p className="mt-1 text-ink-faint">Find the exact moment. Ask anything about your sources.</p>
              </div>
              <div className="mt-2 flex max-w-lg flex-wrap justify-center gap-2">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => runQuery(q)}
                    className="rounded-full border border-border-soft bg-surface-raised px-3.5 py-2 text-sm text-ink-muted transition-colors hover:border-accent-border hover:text-accent"
                  >
                    {q}
                  </button>
                ))}
              </div>
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
