export default function BookDetailsLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 px-4 py-6 overflow-y-auto">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 sm:gap-2 overflow-visible rounded-xl border-0 sm:border-2 border-slate-300 dark:border-slate-700 bg-transparent sm:bg-slate-100 dark:sm:bg-slate-800">

          <div className="relative h-80 sm:h-full w-full animate-pulse bg-slate-200 dark:bg-slate-800 rounded-t-xl sm:rounded-none" />
          <div className="bg-white dark:bg-slate-900 p-6 space-y-4 rounded-xl sm:rounded-none">
            <div className="h-12 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-1 w-12 bg-sky-500/50 rounded mb-4 animate-pulse" />
            <div className="space-y-3 pt-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="flex flex-col justify-start bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-none overflow-hidden">
            <div className="space-y-0.5">
              {[
                { labelWidth: "w-10", type: "pill-genre" },
                { labelWidth: "w-12", type: "line-medium" },
                { labelWidth: "w-20", type: "line-long" },
                { labelWidth: "w-24", type: "line-short" },
                { labelWidth: "w-20", type: "pill-availability" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-4 py-3">
                  <div className={`h-4 ${item.labelWidth} animate-pulse rounded bg-slate-200 dark:bg-slate-800 mb-2.5`} />
                  {item.type === "pill-genre" && (
                    <div className="h-6 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                  )}
                  {item.type === "pill-availability" && (
                    <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                  )}
                  {item.type.startsWith("line-") && (
                    <div className={`h-6 ${item.type === "line-long" ? "w-48" : item.type === "line-medium" ? "w-36" : "w-28"} animate-pulse rounded bg-slate-200 dark:bg-slate-800`} />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-10 w-32 animate-pulse rounded-xl bg-sky-500/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
