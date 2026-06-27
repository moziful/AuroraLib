export default function BookDetailsLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] sm:h-[calc(100vh-4rem)] bg-white dark:bg-slate-950 px-4 py-6 overflow-y-auto sm:overflow-hidden">
      <div className="mx-auto flex h-full min-h-0 max-w-7xl flex-col gap-4">
        {/* Back button skeleton */}
        <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

        {/* Layout Skeleton */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 flex-1 sm:min-h-0 gap-4 sm:gap-2 overflow-visible sm:overflow-hidden rounded-xl border-0 sm:border-2 border-slate-200 dark:border-slate-800 bg-transparent sm:bg-slate-100 dark:sm:bg-slate-800">
          
          {/* Cover Image Skeleton */}
          <div className="relative h-80 sm:h-full min-h-0 w-full animate-pulse bg-slate-200 dark:bg-slate-800 rounded-t-xl sm:rounded-none" />

          {/* Middle Content Skeleton (Title & Description) */}
          <div className="sm:min-h-0 bg-white dark:bg-slate-900 p-6 space-y-4 rounded-xl sm:rounded-none">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-1.5 w-12 bg-sky-500/50 rounded" />
            <div className="space-y-2.5 pt-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          {/* Right Content Skeleton (Sidebar & Purchase) */}
          <div className="flex sm:min-h-0 flex-col justify-between bg-slate-100 dark:bg-slate-800 rounded-xl sm:rounded-none overflow-hidden space-y-0.5">
            <div className="space-y-0.5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="bg-white dark:bg-slate-900 p-4 py-3 space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-5 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-3 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-7 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="h-11 w-32 animate-pulse rounded-xl bg-sky-400/30" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
