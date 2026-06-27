import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#38bdf8",
  "#34d399",
  "#fbbf24",
  "#f43f5e",
  "#a78bfa",
  "#7dd3fc",
];

export default function DashboardCharts({
  title1 = "Monthly Sales Volume",
  title2 = "Ebooks by Genre",
  barData = [], // { name: "Jan", value: 100 }
  pieData = [], // { name: "Fiction", value: 50 }
}) {
  // Sort and limit pieData to top 5 categories, group the rest in "Other" to prevent agenda overflow
  const processedPieData = (() => {
    if (!pieData || pieData.length <= 6) return pieData;
    const sorted = [...pieData].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 5);
    const otherVal = sorted.slice(5).reduce((sum, item) => sum + item.value, 0);
    if (otherVal > 0) {
      top.push({ name: "Other", value: otherVal });
    }
    return top;
  })();

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-600 dark:text-slate-400">
          {title1}
        </h3>
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-200/50 dark:bg-slate-950/50 p-6 border border-slate-300 dark:border-slate-800/50">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#e2e8f0" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.5rem",
                    color: "#1e293b",
                  }}
                  itemStyle={{ color: "#0284c7" }}
                />
                <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <span className="text-sm text-slate-600 dark:text-slate-500">
              No data available
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-600 dark:text-slate-400">
          {title2}
        </h3>
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-200/50 dark:bg-slate-950/50 p-6 border border-slate-300 dark:border-slate-800/50">
          {processedPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {processedPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "0.5rem",
                    color: "#1e293b",
                  }}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  wrapperStyle={{ fontSize: "12px", color: "#64748b" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <span className="text-sm text-slate-600 dark:text-slate-500">
              No data available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
