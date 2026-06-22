export default function DashboardTabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-800 pb-px">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
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
