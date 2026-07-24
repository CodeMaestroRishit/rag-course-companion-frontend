import { useState } from "react";
import { X, FileText, SquarePlay, Globe, Type, Captions, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadVttSource, uploadPdfSource, ingestYoutubeSource } from "../lib/api";

const SOURCE_TYPES = [
  { id: "pdf", label: "PDF", icon: FileText, live: true },
  { id: "yt", label: "YouTube Link", icon: SquarePlay, live: true },
  { id: "web", label: "Web Link", icon: Globe, live: false },
  { id: "text", label: "Text", icon: Type, live: false },
  { id: "vtt", label: "VTT / SRT", icon: Captions, live: true },
];

function StatusBanner({ status }) {
  if (!status) return null;
  if (status.state === "loading") {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border-soft bg-canvas p-3 text-sm text-ink-muted">
        <Loader2 size={14} className="animate-spin" />
        Ingesting - this classifies every chunk with an LLM call, so it can take a while for longer sources…
      </div>
    );
  }
  if (status.state === "success") {
    return (
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-cat-informative/40 bg-cat-informative/10 p-3 text-sm text-ink">
        <CheckCircle2 size={14} className="shrink-0 text-cat-informative" />
        Ingested {status.chunksIngested} chunk{status.chunksIngested === 1 ? "" : "s"}. Ask about it on the Answers tab.
      </div>
    );
  }
  return (
    <div className="mt-4 flex items-start gap-2 rounded-lg border border-cat-controversial/40 bg-cat-controversial/10 p-3 text-sm text-ink">
      <AlertCircle size={14} className="mt-0.5 shrink-0 text-cat-controversial" />
      {status.message}
    </div>
  );
}

function VttForm() {
  const [file, setFile] = useState(null);
  const [lessonName, setLessonName] = useState("");
  const [status, setStatus] = useState(null);

  async function submit() {
    if (!file || !lessonName.trim()) return;
    setStatus({ state: "loading" });
    try {
      const result = await uploadVttSource(file, lessonName.trim());
      setStatus({ state: "success", chunksIngested: result.chunksIngested });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <input
        type="file"
        accept=".vtt,.srt"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-ink file:mr-3 file:rounded file:border-0 file:bg-accent-soft file:px-2 file:py-1 file:text-accent"
      />
      <input
        type="text"
        placeholder="Lesson name"
        value={lessonName}
        onChange={(e) => setLessonName(e.target.value)}
        className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-ink placeholder-ink-faint outline-none focus:border-accent-border"
      />
      <button
        onClick={submit}
        disabled={!file || !lessonName.trim() || status?.state === "loading"}
        className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-canvas transition-opacity disabled:opacity-40"
      >
        Ingest subtitle file
      </button>
      <StatusBanner status={status} />
    </div>
  );
}

function PdfForm() {
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [status, setStatus] = useState(null);

  async function submit() {
    if (!file || !docName.trim()) return;
    setStatus({ state: "loading" });
    try {
      const result = await uploadPdfSource(file, docName.trim());
      setStatus({ state: "success", chunksIngested: result.chunksIngested });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-ink file:mr-3 file:rounded file:border-0 file:bg-accent-soft file:px-2 file:py-1 file:text-accent"
      />
      <input
        type="text"
        placeholder="Document name"
        value={docName}
        onChange={(e) => setDocName(e.target.value)}
        className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-ink placeholder-ink-faint outline-none focus:border-accent-border"
      />
      <button
        onClick={submit}
        disabled={!file || !docName.trim() || status?.state === "loading"}
        className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-canvas transition-opacity disabled:opacity-40"
      >
        Ingest PDF
      </button>
      <p className="text-xs text-ink-faint">
        Each page becomes one chunk, cited by page number instead of a timestamp.
      </p>
      <StatusBanner status={status} />
    </div>
  );
}

function YoutubeForm() {
  const [url, setUrl] = useState("");
  const [lessonName, setLessonName] = useState("");
  const [status, setStatus] = useState(null);

  async function submit() {
    if (!url.trim()) return;
    setStatus({ state: "loading" });
    try {
      const result = await ingestYoutubeSource(url.trim(), lessonName.trim() || undefined);
      setStatus({ state: "success", chunksIngested: result.chunksIngested });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <input
        type="text"
        placeholder="https://www.youtube.com/watch?v=..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-ink placeholder-ink-faint outline-none focus:border-accent-border"
      />
      <input
        type="text"
        placeholder="Lesson name (optional)"
        value={lessonName}
        onChange={(e) => setLessonName(e.target.value)}
        className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-ink placeholder-ink-faint outline-none focus:border-accent-border"
      />
      <button
        onClick={submit}
        disabled={!url.trim() || status?.state === "loading"}
        className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-canvas transition-opacity disabled:opacity-40"
      >
        Ingest YouTube video
      </button>
      <p className="text-xs text-ink-faint">
        Only works for videos with existing captions (auto-generated or manual) - no audio transcription.
      </p>
      <StatusBanner status={status} />
    </div>
  );
}

export default function AddSourceModal({ onClose }) {
  const [selected, setSelected] = useState(null);
  const selectedType = SOURCE_TYPES.find((s) => s.id === selected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Add a source</h2>
          <button onClick={onClose} className="rounded p-1 text-ink-faint hover:bg-surface-raised hover:text-ink">
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SOURCE_TYPES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`flex flex-col items-center gap-2 rounded-lg border px-3 py-4 text-xs font-medium transition-colors ${
                selected === id
                  ? "border-accent-border bg-accent-soft text-accent"
                  : "border-border bg-surface-raised text-ink-muted hover:text-ink"
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        {selectedType && !selectedType.live && (
          <div className="mt-4 rounded-lg border border-border-soft bg-canvas p-3 text-sm text-ink-muted">
            <span className="font-medium text-ink">{selectedType.label}</span> ingestion is coming soon. For now, add
            lessons via the CLI: <code className="rounded bg-surface-raised px-1 py-0.5 text-xs">node ingest.js</code>.
          </div>
        )}
        {selected === "vtt" && <VttForm />}
        {selected === "pdf" && <PdfForm />}
        {selected === "yt" && <YoutubeForm />}
      </div>
    </div>
  );
}
