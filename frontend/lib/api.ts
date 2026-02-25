const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchTrends() {
  const res = await fetch(`${API_URL}/trends/`);
  if (!res.ok) {
    throw new Error("Failed to fetch trends");
  }
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_URL}/health/`);
  if (!res.ok) {
    throw new Error("Failed to fetch health status");
  }
  return res.json();
}

export async function fetchSignals() {
  const res = await fetch(`${API_URL}/signals/`);
  if (!res.ok) {
    throw new Error("Failed to fetch signals");
  }
  return res.json();
}
