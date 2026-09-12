import { METRICS, isMetricCritical } from "../status";

export default function AlertsPanel({ zones, readings }) {
  const alerts = [];
  zones.forEach((zone) => {
    const reading = readings[zone.id];
    if (!reading) return;
    Object.keys(METRICS).forEach((key) => {
      if (isMetricCritical(key, reading[key])) {
        alerts.push({
          zone: zone.name,
          label: METRICS[key].label,
          value: `${reading[key]}${METRICS[key].unit}`,
        });
      }
    });
  });

  return (
    <div className="card">
      <p className="section-title">Alertas recientes</p>
      {alerts.length === 0 ? (
        <p className="empty-alerts">Sin alertas — todas las zonas en rango óptimo.</p>
      ) : (
        <ul className="alerts-list">
          {alerts.map((alert, i) => (
            <li className="alert-item" key={i}>
              <span className="alert-icon">⚠</span>
              <span>
                <span className="alert-zone">{alert.zone}:</span> {alert.label}{" "}
                fuera de rango ({alert.value})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
