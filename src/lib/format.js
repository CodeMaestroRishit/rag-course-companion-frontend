export function formatTimestamp(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

export const CATEGORIES = ["funny", "insightful", "controversial", "emotional", "informative", "none"];

export const CATEGORY_COLORS = {
  funny: "var(--color-cat-funny)",
  insightful: "var(--color-cat-insightful)",
  controversial: "var(--color-cat-controversial)",
  emotional: "var(--color-cat-emotional)",
  informative: "var(--color-cat-informative)",
  none: "var(--color-cat-none)",
};

export const CATEGORY_EMOJI = {
  funny: "😂",
  insightful: "💡",
  controversial: "🔥",
  emotional: "❤️",
  informative: "📘",
  none: "⚪",
};

export const NODE_COLORS = {
  transform: "var(--color-node-transform)",
  retrieve: "var(--color-node-retrieve)",
  merge: "var(--color-node-merge)",
  rerank: "var(--color-node-rerank)",
  generate: "var(--color-node-generate)",
  grade: "var(--color-node-grade)",
  retry: "var(--color-node-retry)",
  guardrail: "var(--color-node-guardrail)",
};

/**
 * Pull `(Lesson Name, mm:ss)` or `(Doc Name, p. 4)`-style citations out of
 * free-form answer text. The backend's prompt asks for one of these two
 * exact shapes but doesn't enforce it via structured output, so this is
 * deliberately tolerant of minor variations (extra quotes, "Lesson:"
 * prefixes, two timestamps joined by "and").
 */
export function extractCitations(text) {
  if (!text) return [];
  const citations = [];
  const parenRe = /\(([^)]+)\)/g;
  let match;
  while ((match = parenRe.exec(text))) {
    const inner = match[1];
    const timestamps = [...inner.matchAll(/\d{1,2}:\d{2}/g)].map((m) => m[0]);
    const pages = [...inner.matchAll(/\bp(?:age|g)?\.?\s?(\d+)\b/gi)].map((m) => `p. ${m[1]}`);
    const locators = [...timestamps, ...pages];
    if (locators.length === 0) continue;
    const lessonName = inner
      .replace(/\d{1,2}:\d{2}(-\d{1,2}:\d{2})?/g, "")
      .replace(/\bp(?:age|g)?\.?\s?\d+\b/gi, "")
      .replace(/\band\b/gi, "")
      .replace(/^lesson:?\s*/i, "")
      .replace(/["“”]/g, "")
      .replace(/,\s*$/, "")
      .replace(/,/g, "")
      .trim();
    for (const locator of locators) {
      citations.push({ lessonName: lessonName || "Source", locator });
    }
  }
  const seen = new Set();
  return citations.filter((c) => {
    const key = `${c.lessonName}|${c.locator}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
