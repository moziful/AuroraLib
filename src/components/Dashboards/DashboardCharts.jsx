export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-400">
          Monthly Sales Volume
        </h3>
        <div className="flex aspect-video w-full items-end justify-between rounded-xl bg-slate-950/50 p-6 border border-slate-800/50">
          <div className="w-[8%] bg-slate-800 rounded-t h-[30%]" />
          <div className="w-[8%] bg-slate-800 rounded-t h-[45%]" />
          <div className="w-[8%] bg-slate-800 rounded-t h-[35%]" />
          <div className="w-[8%] bg-sky-500/20 border-t-2 border-sky-400 rounded-t h-[65%]" />
          <div className="w-[8%] bg-slate-800 rounded-t h-[50%]" />
          <div className="w-[8%] bg-slate-800 rounded-t h-[75%]" />
          <div className="w-[8%] bg-rose-500/20 border-t-2 border-rose-400 rounded-t h-[40%]" />
          <div className="w-[8%] bg-violet-500/30 border-t-2 border-violet-400 rounded-t h-[90%]" />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-400">
          Ebooks by Genre
        </h3>
        <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-950/50 p-6 border border-slate-800/50">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-violet-500 border-r-sky-400 border-b-emerald-400 animate-pulse">
            <span className="text-xs font-bold text-slate-400">Data View</span>
          </div>
          <div className="ml-6 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-violet-500" /> Technology
              (50%)
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-sky-400" /> Fiction (30%)
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Other
              (20%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
