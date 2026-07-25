// Thin fetch wrappers around the backend (server.js). No axios, per spec.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function parseErrorOr(res) {
  if (res.ok) return res.json();
  const body = await res.json().catch(() => ({}));
  throw new Error(body.error || `Request failed (${res.status})`);
}

/** POST /query -> { response, trace } */
export async function postQuery(query) {
  const res = await fetch(`${BASE_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return parseErrorOr(res);
}

/** GET /sources -> { sourceId, lessonName, sourceType, chunkCount }[] */
export async function getSources() {
  const res = await fetch(`${BASE_URL}/sources`);
  return parseErrorOr(res);
}

/** DELETE /sources/:sourceId -> { success } */
export async function deleteSource(sourceId) {
  const res = await fetch(`${BASE_URL}/sources/${encodeURIComponent(sourceId)}`, { method: "DELETE" });
  return parseErrorOr(res);
}

/** GET /clips?category=&minConfidence=&limit= -> ChunkMetadata[] */
export async function getClips({ category, minConfidence, limit } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (minConfidence !== undefined) params.set("minConfidence", String(minConfidence));
  if (limit !== undefined) params.set("limit", String(limit));
  const res = await fetch(`${BASE_URL}/clips?${params.toString()}`);
  return parseErrorOr(res);
}

/** POST /clips/search { query } -> { category, startTime, endTime, pitch, lessonName, videoId, trace } */
export async function searchClips(query) {
  const res = await fetch(`${BASE_URL}/clips/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return parseErrorOr(res);
}

/** POST /sources/vtt (multipart) -> { success, sourceId, chunksIngested } */
export async function uploadVttSource(file, lessonName) {
  const form = new FormData();
  form.append("file", file);
  form.append("lessonName", lessonName);
  const res = await fetch(`${BASE_URL}/sources/vtt`, { method: "POST", body: form });
  return parseErrorOr(res);
}

/** POST /sources/pdf (multipart) -> { success, sourceId, chunksIngested, pageCount } */
export async function uploadPdfSource(file, lessonName) {
  const form = new FormData();
  form.append("file", file);
  form.append("lessonName", lessonName);
  const res = await fetch(`${BASE_URL}/sources/pdf`, { method: "POST", body: form });
  return parseErrorOr(res);
}

/** POST /sources/youtube { url, lessonName } -> { success, sourceId, chunksIngested, lessonName } */
export async function ingestYoutubeSource(url, lessonName) {
  const res = await fetch(`${BASE_URL}/sources/youtube`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, lessonName }),
  });
  return parseErrorOr(res);
}
