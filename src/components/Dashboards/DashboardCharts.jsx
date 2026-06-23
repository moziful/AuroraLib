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

const COLORS = ["#8b5cf6", "#38bdf8", "#34d399", "#fbbf24", "#f43f5e", "#a78bfa", "#7dd3fc"];

export default function DashboardCharts({
  title1 = "Monthly Sales Volume",
  title2 = "Ebooks by Genre",
  barData = [], // { name: "Jan", value: 100 }
  pieData = [], // { name: "Fiction", value: 50 }
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-400">
          {title1}
        </h3>
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-950/50 p-6 border border-slate-800/50">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }} 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <span className="text-sm text-slate-500">No data available</span>
          )}
        </div>
      </div>
      
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-400">
          {title2}
        </h3>
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-950/50 p-6 border border-slate-800/50">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                />
                <Legend 
                  verticalAlign="middle" 
                  align="right" 
                  layout="vertical"
                  wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <span className="text-sm text-slate-500">No data available</span>
          )}
        </div>
      </div>
    </div>
  );
}
