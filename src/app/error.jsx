"use client";

import { useEffect } from "react";
import { MdRefresh, MdWarningAmber } from "react-icons/md";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-2xl bg-slate-900/80 p-8 border border-slate-800 shadow-xl backdrop-blur-sm">
        <div className="rounded-full bg-rose-500/10 p-4 text-rose-400 border border-rose-500/20">
          <MdWarningAmber className="text-4xl" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Something went wrong.</h2>
          <p className="mt-2 text-sm text-slate-400">
            An unexpected error occurred. Please try reloading the page.
          </p>
        </div>
        <button
          onClick={() => (reset ? reset() : window.location.reload())}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-rose-600 active:scale-95 shadow-lg shadow-rose-500/20"
        >
          <MdRefresh className="text-lg" />
          Reload
        </button>
      </div>
    </div>
  );
}
