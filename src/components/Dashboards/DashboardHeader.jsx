import { MdDashboard } from "react-icons/md";

export default function DashboardHeader({
  roleTitle,
  subtitle,
  icon: Icon = MdDashboard,
  iconColorClass = "text-sky-400",
  bgColorClass = "bg-sky-500/10",
  borderColorClass = "border-sky-500/20",
}) {
  return (
    <div className="mb-4 lg:mb-10">
      <div className="flex items-center gap-3">
        <div
          className={`flex shrink-0 h-12 w-12 sm:h-10 sm:w-10 items-center justify-center rounded-xl border ${bgColorClass} ${borderColorClass}`}
        >
          <Icon className={`text-xl sm:text-lg ${iconColorClass}`} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            {roleTitle.split(" ")[0]}{" "}
            <span className={iconColorClass}>
              {roleTitle.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          {subtitle && (
            <p
              className="text-sm text-slate-600 dark:text-slate-500"
              suppressHydrationWarning
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
