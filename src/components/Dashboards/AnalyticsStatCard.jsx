export default function AnalyticsStatCard({
  title,
  value,
  description,
  icon: Icon,
  colorClass = "text-violet-400",
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        {Icon && <Icon className={`text-xl ${colorClass}`} />}
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
      {description && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}
