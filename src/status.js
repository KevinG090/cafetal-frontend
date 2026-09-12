export const METRICS = {
  humedad_suelo: { label: "Humedad de suelo", unit: "%", min: 40, max: 100 },
  temperatura: { label: "Temperatura", unit: "°C", min: 16, max: 28 },
  humedad_ambiente: { label: "Humedad ambiente", unit: "%", min: 45, max: 100 },
  luminosidad: { label: "Luminosidad", unit: " lux", min: 200, max: 1200 },
};

export function isMetricCritical(key, value) {
  if (value === undefined || value === null) return false;
  const range = METRICS[key];
  if (!range) return false;
  return value < range.min || value > range.max;
}

export function zoneStatus(reading) {
  if (!reading || !Object.keys(METRICS).every((key) => Number.isFinite(reading[key]))) return "unknown";
  const critical = Object.keys(METRICS).some((key) => isMetricCritical(key, reading[key]));
  return critical ? "critical" : "good";
}
