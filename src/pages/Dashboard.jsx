import { ZONES } from "../api";
import ZoneCard from "../components/ZoneCard";
import StatTile from "../components/StatTile";
import TrendChart from "../components/TrendChart";
import AlertsPanel from "../components/AlertsPanel";
import FarmMap from "../components/FarmMap";

export default function Dashboard({
  readings,
  histories,
  dataLoading,
  lastUpdated,
  onRefresh,
  autoRefreshActive = true,
}) {
  const soilValues = ZONES.map((z) => readings[z.id]?.humedad_suelo).filter(
    (v) => v !== undefined && v !== null
  );
  const tempValues = ZONES.map((z) => readings[z.id]?.temperatura).filter(
    (v) => v !== undefined && v !== null
  );
  const avgTemp = tempValues.length
    ? (tempValues.reduce((a, b) => a + b, 0) / tempValues.length).toFixed(1)
    : "—";
  const sensorsOnline = soilValues.length;

  return (
    <div>
      {!autoRefreshActive && (
        <div
          className="card"
          style={{ marginBottom: 16, padding: "10px 16px", fontSize: 13.5 }}
        >
          ⏸ Actualización automática pausada tras 5 minutos — usa "Refrescar datos" para
          traer lecturas nuevas.
        </div>
      )}

      <div className="grid grid-4" style={{ marginBottom: 16 }}>
        {ZONES.map((zone) => (
          <ZoneCard key={zone.id} id={zone.id} name={zone.name} reading={readings[zone.id]} />
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <FarmMap zones={ZONES} readings={readings} />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 16 }}>
        <TrendChart zones={ZONES} histories={histories} />
        <AlertsPanel zones={ZONES} readings={readings} />
      </div>

      <div className="grid grid-4">
        <StatTile label="Temperatura promedio" value={avgTemp !== "—" ? `${avgTemp}°C` : "—"} />
        <StatTile label="Sensores en línea" value={`${sensorsOnline} / ${ZONES.length}`} />
        <StatTile
          label="Última actualización"
          value={lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
        />
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <button className="control-btn" onClick={onRefresh} disabled={dataLoading}>
            {dataLoading ? "Actualizando..." : "Refrescar datos"}
          </button>
        </div>
      </div>
    </div>
  );
}
