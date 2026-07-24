import { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import BottomTabs from "./components/BottomTabs";
import HistorySidebar from "./components/HistorySidebar";
import AddSourceModal from "./components/AddSourceModal";
import AnswersView from "./pages/AnswersView";
import ClipsView from "./pages/ClipsView";

const HISTORY_KEY = "rag-companion-history";

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState("answers");
  const [modalOpen, setModalOpen] = useState(false);
  const [history, setHistory] = useState(loadHistory);
  const [answerCommand, setAnswerCommand] = useState(null);
  const [clipCommand, setClipCommand] = useState(null);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  }, [history]);

  function addHistoryEntry(entry) {
    setHistory((prev) => [entry, ...prev]);
  }

  function handleSelectHistory(entry) {
    if (entry.type === "clip") {
      setActiveTab("clips");
      setClipCommand({ query: entry.query, nonce: Date.now() });
    } else {
      setActiveTab("answers");
      setAnswerCommand({ query: entry.query, nonce: Date.now() });
    }
  }

  return (
    <div className="flex h-screen flex-col bg-canvas text-ink">
      <TopBar onAddSource={() => setModalOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <HistorySidebar history={history} onSelect={handleSelectHistory} />

        <main className="min-w-0 flex-1 overflow-hidden">
          {activeTab === "answers" ? (
            <AnswersView command={answerCommand} onHistoryEntry={addHistoryEntry} />
          ) : (
            <ClipsView command={clipCommand} onHistoryEntry={addHistoryEntry} />
          )}
        </main>
      </div>

      <BottomTabs activeTab={activeTab} onChange={setActiveTab} />

      {modalOpen && <AddSourceModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
