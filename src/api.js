const API_URL = import.meta.env.VITE_API_URL;

export const ZONES = [
  { id: "lote-1", name: "North Field" },
  { id: "lote-2", name: "East Slope" },
  { id: "lote-3", name: "South Ridge" },
  { id: "lote-4", name: "West Hollow" },
];

export const HUMIDITY_CRITICAL_BELOW = 40;

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`${path} -> HTTP ${response.status}`);
  }
  return response.json();
}

export function getStatus() {
  return request("/status");
}

export function setControl(action) {
  return request("/control", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
}

export function getLatest(sensorId) {
  return request(`/data/latest?sensor_id=${encodeURIComponent(sensorId)}`);
}

export function getHistory(sensorId, fromTs, toTs) {
  return request(
    `/data/history?sensor_id=${encodeURIComponent(sensorId)}&from_ts=${fromTs}&to_ts=${toTs}`
  );
}
