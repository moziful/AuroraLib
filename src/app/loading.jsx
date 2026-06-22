export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 px-8 py-10 shadow-2xl shadow-sky-500/5 backdrop-blur">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
        </div>
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-sky-300">
            AuroraLib
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Loading your reading space...
          </p>
        </div>
      </div>
    </div>
  );
}
