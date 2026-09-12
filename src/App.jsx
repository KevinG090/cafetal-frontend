import { useCallback, useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ZONES, getStatus, getHistory } from "./api";
import ControlPanel from "./components/ControlPanel";
import ThemeToggle from "./components/ThemeToggle";
import Dashboard from "./pages/Dashboard";
import ZoneDetail from "./pages/ZoneDetail";

const POLL_INTERVAL_MS = 60000; // solo revisa estado cada minuto
const HISTORY_WINDOW_SEC = 24 * 60 * 60;

export default function App() {
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [readings, setReadings] = useState({});
  const [histories, setHistories] = useState({});
  const [dataLoading, setDataLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const refreshing = useRef(false);
  // Cache en memoria: solo se pide lo nuevo desde la ultima lectura conocida,
  // en vez de volver a traer las 24h completas en cada ciclo.
  const cacheRef = useRef({});

  const refreshStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const result = await getStatus();
      setStatus(result);
      return result;
    } catch {
      setStatus(null);
      return null;
    } finally {
      setStatusLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (refreshing.current) return;
    refreshing.current = true;
    setDataLoading(true);
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - HISTORY_WINDOW_SEC;

    await Promise.all(
      ZONES.map(async (zone) => {
        const cached = cacheRef.current[zone.id] || [];
        const from = cached.length ? cached[cached.length - 1].timestamp + 1 : windowStart;
        try {
          const history = await getHistory(zone.id, from, now);
          const fresh = (history.readings || []).sort((a, b) => a.timestamp - b.timestamp);
          cacheRef.current[zone.id] = [...cached, ...fresh].filter(
            (r) => r.timestamp >= windowStart
          );
        } catch {
          // se conserva lo que ya estaba en cache si falla la peticion
        }
      })
    );

    const nextReadings = {};
    const nextHistories = {};
    ZONES.forEach((zone) => {
      const arr = cacheRef.current[zone.id] || [];
      nextHistories[zone.id] = arr;
      nextReadings[zone.id] = arr.length ? arr[arr.length - 1] : null;
    });

    setReadings(nextReadings);
    setHistories(nextHistories);
    setDataLoading(false);
    refreshing.current = false;
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    (async () => {
      await refreshStatus();
      await refreshData();
    })();

    const timer = window.setInterval(async () => {
      if (document.hidden) return;
      const current = await refreshStatus();
      // Si esta apagada no hay datos nuevos que traer - no vale la pena
      // seguir consultando data-api/DynamoDB cada minuto por nada.
      if (current?.state === "running") {
        await refreshData();
      }
    }, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [refreshStatus, refreshData]);

  async function handleControlChange(busy) {
    if (!busy) {
      await refreshStatus();
    }
  }

  return (
    <div>
      <header className="app-header">
        <div className="app-title">
          <span className="leaf">🌱</span> Cafetal IoT
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ControlPanel status={status} loading={statusLoading} onChanging={handleControlChange} />
          <ThemeToggle />
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              readings={readings}
              histories={histories}
              dataLoading={dataLoading}
              lastUpdated={lastUpdated}
              onRefresh={refreshData}
            />
          }
        />
        <Route
          path="/zone/:zoneId"
          element={<ZoneDetail readings={readings} histories={histories} />}
        />
      </Routes>
    </div>
  );
}
