const API_URL = "/api";

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

export async function fetchSignalsPage(page = 1, limit = 25) {
  const res = await fetch(`${API_URL}/signals/?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error("Failed to fetch signals page");
  }
  return res.json();
}

export async function fetchClusters(page = 1, limit = 25) {
  const res = await fetch(`${API_URL}/clusters/?page=${page}&limit=${limit}`);
  if (!res.ok) {
    throw new Error("Failed to fetch clusters");
  }
  return res.json();
}

export async function fetchClusterSignals(clusterId: string) {
  const res = await fetch(`${API_URL}/clusters/${clusterId}/signals`);
  if (!res.ok) {
    throw new Error("Failed to fetch cluster signals");
  }
  return res.json();
}
