"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MdMenuBook, MdCreate, MdErrorOutline } from "react-icons/md";
import { authClient } from "@/lib/auth-client";

export default function PendingDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/auth/signin");
      } else if (session.user.role !== "pending") {
        const role = session.user.role;
        router.replace(
          role === "writer" ? "/dashboard/writer" : "/dashboard/reader"
        );
      }
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user || session.user.role !== "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  const handleRoleSelect = async (selectedRole) => {
    setLoading(true);
    setError("");

    try {
      const userId = session.user.id;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const url = `${apiBase}/users/${userId}/role`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save role choice.");
      }

      window.location.href =
        selectedRole === "writer" ? "/dashboard/writer" : "/dashboard/reader";
    } catch (err) {
      console.error("Failed to assign role:", err);
      setError(err.message || "Failed to assign role. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50 p-8 backdrop-blur-xl shadow-2xl shadow-sky-400/5"
      >
        <div className="text-center">
          <div className="inline-block text-3xl font-black tracking-wider text-slate-900 dark:text-white hover:opacity-90">
            <span className="text-sky-400">Aurora</span>Lib
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-200">
            Choose your identity
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Tell us how you want to experience AuroraLib
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleRoleSelect("reader")}
            className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 text-center transition-all duration-200 hover:border-sky-400/40 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-50"
          >
            <div className="mb-3 rounded-full bg-sky-400/10 p-3 text-sky-400 group-hover:scale-110 transition-transform">
              <MdMenuBook className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Reader</h3>
            <p className="mt-1 text-xs text-slate-500">
              Discover, purchase, and read premium ebooks.
            </p>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleRoleSelect("writer")}
            className="group flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 text-center transition-all duration-200 hover:border-sky-400/40 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-50"
          >
            <div className="mb-3 rounded-full bg-sky-400/10 p-3 text-sky-400 group-hover:scale-110 transition-transform">
              <MdCreate className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Writer</h3>
            <p className="mt-1 text-xs text-slate-500">
              Publish creations and track your sales analytics.
            </p>
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3"
            >
              <MdErrorOutline className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-xs font-medium leading-relaxed text-red-300">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-center py-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
