import { Link, useParams } from "react-router-dom";
import { ZONES } from "../api";
import { zoneStatus } from "../status";
import MetricChart from "../components/MetricChart";
import StatTile from "../components/StatTile";

const METRIC_CHARTS = [
  { key: "humedad_suelo", label: "Humedad de suelo", unit: "%", color: "var(--series-1)" },
  { key: "temperatura", label: "Temperatura", unit: "°C", color: "var(--series-2)" },
  { key: "humedad_ambiente", label: "Humedad ambiente", unit: "%", color: "var(--series-3)" },
  { key: "luminosidad", label: "Luminosidad", unit: " lux", color: "var(--series-4)" },
];

export default function ZoneDetail({ readings, histories }) {
  const { zoneId } = useParams();
  const zone = ZONES.find((z) => z.id === zoneId);
  const reading = readings[zoneId];
  const history = histories[zoneId] || [];
  const status = zoneStatus(reading);

  if (!zone) {
    return (
      <div>
        <Link className="back-link" to="/">← Volver al dashboard</Link>
        <p>Zona no encontrada.</p>
      </div>
    );
  }

  return (
    <div>
      <Link className="back-link" to="/">← Volver al dashboard</Link>
      <div className="zone-detail-header">
        <h1>{zone.name}</h1>
        <span className={`status-pill ${status === "critical" ? "critical" : "good"}`}>
          {status === "critical" ? "⚠ Crítico" : "✓ Óptimo"}
        </span>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        {METRIC_CHARTS.map((m) => (
          <StatTile
            key={m.key}
            label={m.label}
            value={reading ? `${reading[m.key]}${m.unit}` : "—"}
          />
        ))}
      </div>

      <div className="grid grid-2">
        {METRIC_CHARTS.map((m) => (
          <MetricChart
            key={m.key}
            title={m.label}
            metricKey={m.key}
            unit={m.unit}
            color={m.color}
            readings={history}
          />
        ))}
      </div>
    </div>
  );
}
