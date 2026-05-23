const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `API error ${res.status}`);
  }
  return res.json();
}

// ── Resume ────────────────────────────────────────────────────────────────────

export async function parseResume(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/resume/analyze`, {
    method: "POST",
    body: form,
  });
  return handleResponse(res);
}

export async function uploadResume(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/resume/upload`, {
    method: "POST",
    body: form,
  });
  return handleResponse(res);
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export async function searchJobs(role) {
  const res = await fetch(
    `${BASE_URL}/jobs/search?role=${encodeURIComponent(role)}`
  );
  return handleResponse(res);
}

// ── Cover Letter ──────────────────────────────────────────────────────────────


export async function generateCoverLetter({ resume_text, job_description, tone = "professional" }) {
  const res = await fetch(`${BASE_URL}/coverletter/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume_text, job_description, tone }),
  });
  return handleResponse(res);
}

