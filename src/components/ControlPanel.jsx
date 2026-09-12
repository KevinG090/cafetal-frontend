import { setControl } from "../api";

export default function ControlPanel({ status, loading, onChanging }) {
  const state = status?.state ?? "unknown";
  const isRunning = state === "running";
  const isTransitioning = state === "pending" || state === "stopping";

  async function handleClick() {
    onChanging(true);
    try {
      await setControl(isRunning ? "stop" : "start");
    } finally {
      onChanging(false);
    }
  }

  return (
    <div className="control-panel">
      <span className={`instance-pill ${isRunning ? "running" : "stopped"}`}>
        ● {loading ? "cargando..." : state}
      </span>
      <button
        className={`control-btn ${isRunning ? "stop" : ""}`}
        onClick={handleClick}
        disabled={loading || isTransitioning}
      >
        {isRunning ? "Apagar simulador" : "Encender simulador"}
      </button>
    </div>
  );
}
