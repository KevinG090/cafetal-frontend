import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SERIES_COLORS = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
];

function formatTime(ts) {
  return new Date(ts * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function TrendChart({ zones, histories }) {
  const maxLen = Math.max(0, ...zones.map((z) => (histories[z.id] || []).length));
  const data = [];
  for (let i = 0; i < maxLen; i++) {
    const point = { timestamp: null };
    zones.forEach((zone) => {
      const reading = (histories[zone.id] || [])[i];
      if (reading) {
        point.timestamp = point.timestamp ?? reading.timestamp;
        point[zone.id] = reading.humedad_suelo;
      }
    });
    data.push(point);
  }

  return (
    <div className="card">
      <p className="section-title">Tendencia de humedad de suelo (últimas lecturas)</p>
      {data.length === 0 ? (
        <p className="loading-text">Sin datos suficientes todavía — enciende el simulador.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatTime}
              tick={{ fontSize: 12, fill: "var(--chart-axis-text)" }}
              axisLine={{ stroke: "var(--chart-axis-line)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--chart-axis-text)" }}
              axisLine={false}
              tickLine={false}
              unit="%"
              width={40}
            />
            <Tooltip
              labelFormatter={formatTime}
              contentStyle={{
                fontSize: 13,
                borderRadius: 8,
                border: "1px solid var(--coffee-border)",
                background: "var(--chart-tooltip-bg)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {zones.map((zone, i) => (
              <Line
                key={zone.id}
                type="monotone"
                dataKey={zone.id}
                name={zone.name}
                stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
                strokeWidth={2}
                strokeLinecap="round"
                dot={{ r: 3 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
