const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function checkEligibilityFromText(text, language = "en") {
  const res = await fetch(`${API_BASE}/api/eligibility/parse-and-check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to check eligibility");
  }
  return res.json();
}

export async function checkEligibilityStructured(data) {
  const res = await fetch(`${API_BASE}/api/eligibility/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to check eligibility");
  }
  return res.json();
}
