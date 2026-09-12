import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatTime(ts) {
  return new Date(ts * 1000).toLocaleString([], {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MetricChart({ title, metricKey, unit, color, readings }) {
  const data = readings.map((r) => ({
    timestamp: r.timestamp,
    time: formatTime(r.timestamp),
    value: r[metricKey],
  }));

  return (
    <div className="card metric-section">
      <p className="section-title">{title}</p>
      {data.length === 0 ? (
        <p className="loading-text">Sin datos suficientes todavía.</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatTime}
                tick={{ fontSize: 11, fill: "var(--chart-axis-text)" }}
                axisLine={{ stroke: "var(--chart-axis-line)" }}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--chart-axis-text)" }}
                axisLine={false}
                tickLine={false}
                unit={unit}
                width={48}
              />
              <Tooltip
                labelFormatter={formatTime}
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid var(--coffee-border)",
                  background: "var(--chart-tooltip-bg)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name={title}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                dot={{ r: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
          <details className="table-toggle">
            <summary>Ver tabla de datos</summary>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>
                      {title} ({unit.trim()})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...data]
                    .slice(-15)
                    .reverse()
                    .map((d, i) => (
                      <tr key={i}>
                        <td>{d.time}</td>
                        <td>{d.value}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
