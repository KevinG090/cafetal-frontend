import { useNavigate } from "react-router-dom";
import { zoneStatus } from "../status";

const TILE_W = 90;
const TILE_H = 45;
const DEPTH = 22;
const ORIGIN = { x: 200, y: 55 };

// Diamond grid: screen position of a (col, row) isometric tile.
function tileCenter(col, row) {
  return {
    x: ORIGIN.x + (col - row) * TILE_W,
    y: ORIGIN.y + (col + row) * TILE_H,
  };
}

function diamondPoints(cx, cy) {
  const w = TILE_W;
  const h = TILE_H;
  return [
    [cx, cy - h],
    [cx + w, cy],
    [cx, cy + h],
    [cx - w, cy],
  ];
}

function toPointsAttr(points) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

function IsoTile({ col, row, fillVar, onClick, faded }) {
  const { x: cx, y: cy } = tileCenter(col, row);
  const [top, right, bottom, left] = diamondPoints(cx, cy);

  return (
    <g
      className="iso-plot"
      onClick={onClick}
      style={{ opacity: faded ? 0.5 : 1 }}
    >
      {/* left face (extruded down) */}
      <polygon
        className="iso-face"
        points={toPointsAttr([left, bottom, [bottom[0], bottom[1] + DEPTH], [left[0], left[1] + DEPTH]])}
        style={{ fill: fillVar, filter: "brightness(0.75)" }}
      />
      {/* right face (extruded down) */}
      <polygon
        className="iso-face"
        points={toPointsAttr([right, bottom, [bottom[0], bottom[1] + DEPTH], [right[0], right[1] + DEPTH]])}
        style={{ fill: fillVar, filter: "brightness(0.88)" }}
      />
      {/* top face */}
      <polygon
        className="iso-top"
        points={toPointsAttr([top, right, bottom, left])}
        style={{ fill: fillVar }}
      />
    </g>
  );
}

function Deco({ col, row, size = 5 }) {
  const { x, y } = tileCenter(col, row);
  return <circle className="iso-deco" cx={x} cy={y} r={size} />;
}

const ZONE_TILES = [
  { col: 0, row: 0 },
  { col: 1, row: 0 },
  { col: 0, row: 1 },
  { col: 1, row: 1 },
];

export default function FarmMap({ zones, readings }) {
  const navigate = useNavigate();

  return (
    <div className="card">
      <p className="section-title">Distribución del cafetal</p>
      <svg
        className="farm-map"
        viewBox="0 0 400 260"
        role="img"
        aria-label="Mapa isométrico del cafetal con sus zonas"
      >
        <Deco col={-0.6} row={-0.6} size={7} />
        <Deco col={1.9} row={-0.5} size={6} />
        <Deco col={-0.6} row={1.9} size={6} />
        <Deco col={1.9} row={1.9} size={7} />
        <Deco col={0.5} row={-0.9} size={5} />

        {zones.map((zone, i) => {
          const reading = readings[zone.id];
          const status = zoneStatus(reading);
          const isCritical = status === "critical";
          const tile = ZONE_TILES[i];
          const { x, y } = tileCenter(tile.col, tile.row);

          return (
            <g key={zone.id}>
              <IsoTile
                col={tile.col}
                row={tile.row}
                fillVar={isCritical ? "var(--status-critical-bg)" : "var(--status-good-bg)"}
                onClick={() => navigate(`/zone/${zone.id}`)}
                faded={!reading}
              />
              <foreignObject x={x - 60} y={y - 16} width="120" height="40" style={{ pointerEvents: "none" }}>
                <div style={{ textAlign: "center" }}>
                  <div className="plot-label">{zone.name}</div>
                  <div className="plot-value">
                    {reading ? `${reading.humedad_suelo}% · ${reading.temperatura}°C` : "sin datos"}
                  </div>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
