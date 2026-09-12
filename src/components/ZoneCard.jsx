import { Link } from "react-router-dom";
import { zoneStatus } from "../status";

export default function ZoneCard({ id, name, reading }) {
  if (!reading) {
    return (
      <div className="card zone-card">
        <div className="zone-name">{name}</div>
        <div className="loading-text">sin datos aún</div>
      </div>
    );
  }

  const status = zoneStatus(reading);
  const isCritical = status === "critical";

  return (
    <Link to={`/zone/${id}`} className="zone-card-link">
      <div className="card zone-card">
        <div className="zone-name">{name} — Humedad de suelo</div>
        <div className="zone-value">{reading.humedad_suelo}%</div>
        <span className={`status-pill ${isCritical ? "critical" : "good"}`}>
          {isCritical ? "⚠ Crítico" : "✓ Óptimo"}
        </span>
        <div className="mini-metrics">
          <span className="mini-metric">🌡 {reading.temperatura}°C</span>
          <span className="mini-metric">💧 {reading.humedad_ambiente}%</span>
          <span className="mini-metric">☀ {reading.luminosidad} lux</span>
        </div>
      </div>
    </Link>
  );
}
