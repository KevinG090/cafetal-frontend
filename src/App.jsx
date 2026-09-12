import { useCallback, useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ZONES, getStatus, getLatest, getHistory } from "./api";
import ControlPanel from "./components/ControlPanel";
import ThemeToggle from "./components/ThemeToggle";
import Dashboard from "./pages/Dashboard";
import ZoneDetail from "./pages/ZoneDetail";

export default function App() {
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [readings, setReadings] = useState({});
  const [histories, setHistories] = useState({});
  const [dataLoading, setDataLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const refreshing = useRef(false);

  const refreshStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const result = await getStatus();
      setStatus(result);
    } catch {
      setStatus(null);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (refreshing.current) return;
    refreshing.current = true;
    setDataLoading(true);
    const now = Math.floor(Date.now() / 1000);
    const from = now - 24 * 60 * 60;

    const nextReadings = {};
    const nextHistories = {};

    await Promise.all(
      ZONES.map(async (zone) => {
        try {
          const latest = await getLatest(zone.id);
          nextReadings[zone.id] = latest.reading;
        } catch {
          nextReadings[zone.id] = null;
        }
        try {
          const history = await getHistory(zone.id, from, now);
          nextHistories[zone.id] = (history.readings || []).sort(
            (a, b) => a.timestamp - b.timestamp
          );
        } catch {
          nextHistories[zone.id] = [];
        }
      })
    );

    setReadings(nextReadings);
    setHistories(nextHistories);
    setDataLoading(false);
    refreshing.current = false;
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    refreshStatus();
    refreshData();
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        refreshData();
        refreshStatus();
      }
    }, 30000);
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
