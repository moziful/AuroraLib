export default function DashboardTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex h-full flex-col gap-2 p-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left text-sm font-medium transition-colors hover:cursor-pointer ${
              isActive
                ? "border-sky-500 bg-slate-100 dark:bg-slate-800/30 text-sky-500 dark:text-sky-400"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-950/30 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {Icon && <Icon className="text-lg" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
