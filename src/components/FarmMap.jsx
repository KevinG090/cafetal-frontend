import { useState } from "react";
import { Link } from "react-router-dom";
import { METRICS, zoneStatus } from "../status";
import terrain from "../assets/cafetal-terrain.png";

const PLOTS = {
  "lote-1": { x: 7, y: 8, name: "Zona Norte" },
  "lote-2": { x: 53, y: 8, name: "Zona Este" },
  "lote-3": { x: 7, y: 51, name: "Zona Sur" },
  "lote-4": { x: 53, y: 51, name: "Zona Oeste" },
};
const LABELS = { good: "En rango", critical: "Fuera de rango", unknown: "Sin datos" };
const valueText = (value, unit) => Number.isFinite(value) ? `${value}${unit}` : "—";

export default function FarmMap({ zones, readings }) {
  const [selectedId, setSelectedId] = useState(zones[0]?.id);
  const selected = zones.find((zone) => zone.id === selectedId) || zones[0];
  const reading = readings[selected?.id];
  const status = zoneStatus(reading);
  return (
    <section className="card farm-section" aria-label="Distribución del cafetal">
      <div className="farm-heading">
        <div><p className="section-title">Distribución del cafetal</p>
          <p className="farm-subtitle">Selecciona una parcela para consultar sus sensores.</p></div>
        <span className="farm-caption">Vista ilustrativa · 4 lotes</span>
      </div>
      <div className="farm-layout">
        <div className="farm-scene">
          <img src={terrain} alt="Cafetal con hileras de plantas y cuatro parcelas separadas por caminos" />
          {zones.map((zone) => {
            const plot = PLOTS[zone.id];
            if (!plot) return null;
            const data = readings[zone.id];
            const state = zoneStatus(data);
            return <button key={zone.id} type="button"
              className={`farm-plot ${state} ${selected?.id === zone.id ? "is-selected" : ""}`}
              style={{ left: `${plot.x}%`, top: `${plot.y}%` }}
              aria-pressed={selected?.id === zone.id}
              aria-label={`${plot.name}, ${LABELS[state]}, humedad de suelo ${valueText(data?.humedad_suelo, "%")}`}
              onClick={() => setSelectedId(zone.id)}>
              <span className="farm-marker"><span className="farm-dot" />{plot.name}
                <strong>{valueText(data?.humedad_suelo, "%")}</strong><small>Humedad de suelo</small>
              </span>
            </button>;
          })}
          <span className="farm-scene-note">Terreno ilustrativo, no georreferenciado</span>
        </div>
        {selected && <aside className="farm-inspector" aria-label="Datos de la zona seleccionada">
          <span className="farm-eyebrow">ZONA SELECCIONADA · {selected.id}</span>
          <h2>{PLOTS[selected.id]?.name || selected.name}</h2>
          <p className="farm-subtitle">{selected.name}</p>
          <span className={`farm-state ${status}`}><span className="farm-dot" />{LABELS[status]}</span>
          <dl className="farm-metrics">
            {Object.entries(METRICS).map(([key, metric]) => <div key={key}>
              <dt>{metric.label}</dt><dd>{valueText(reading?.[key], metric.unit)}</dd>
            </div>)}
          </dl>
          <p className="farm-reading-time">{reading?.timestamp
            ? `Lectura: ${new Date(reading.timestamp * 1000).toLocaleString("es-CO")}`
            : "Sin lectura disponible. Comprueba el simulador o la conexión."}</p>
          <Link className="farm-detail-link" to={`/zone/${selected.id}`}>Ver historial de la zona →</Link>
        </aside>}
      </div>
      <div className="farm-footer"><div className="farm-legend">
        {Object.entries(LABELS).map(([key, label]) => <span className={key} key={key}><i className="farm-dot" />{label}</span>)}
      </div><span>Datos de la API · se actualiza solo, y solo mientras la EC2 esté encendida</span></div>
    </section>
  );
}
