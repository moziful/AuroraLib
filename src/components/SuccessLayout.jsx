"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCheckCircle, FaBookOpen, FaCompass } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function SuccessLayout({ book, appUserEmail, session_id, amount_total }) {
  const { data: session } = authClient.useSession();
  const role = session?.user?.role || "reader";
  const dashboardHref = `/dashboard/${role}?tab=purchased`;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 md:p-10 border border-slate-100 dark:border-slate-800 overflow-hidden"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 mb-4"
          >
            <FaCheckCircle className="text-5xl" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-black text-slate-850 dark:text-white tracking-tight"
          >
            Order Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-2 text-sm text-slate-500 dark:text-slate-400"
          >
            Thank you for supporting authors. Your payment was processed successfully.
          </motion.p>
        </div>

        {book && (
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-8 p-5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-150 dark:border-slate-850 flex flex-col sm:flex-row gap-5 items-center sm:items-start text-left"
          >
            <div className="relative w-28 h-36 rounded-md overflow-hidden shadow-md bg-slate-200 dark:bg-slate-800 shrink-0">
              <Image
                src={book.coverImage || "/placeholder-cover.png"}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between h-full py-1 text-center sm:text-left">
              <div>
                <h2 className="mt-1 text-xl font-bold text-slate-800 dark:text-white line-clamp-1">
                  {book.title}
                </h2>
                <span className="inline-block rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">
                  {book.genre}
                </span>
                <p className="text-sm text-slate-550 dark:text-slate-400">
                  By {book.writerName}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <p>
                  Format:{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-350">
                    PDF
                  </span>
                </p>
                <p>
                  Access:{" "}
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Lifetime
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mb-8 border-t border-b border-slate-100 dark:border-slate-800 py-5 text-sm space-y-3"
        >
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              Account Email
            </span>
            <span className="font-semibold text-slate-800 dark:text-white">
              {appUserEmail}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              Transaction ID
            </span>
            <span
              className="font-mono text-xs text-slate-600 dark:text-slate-350 truncate max-w-45 sm:max-w-none"
              title={session_id}
            >
              {session_id.substring(0, 24)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">
              Total Charged
            </span>
            <span className="font-bold text-sky-500 dark:text-sky-400">
              ${(amount_total / 100).toFixed(2)} USD
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Link
            href={dashboardHref}
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-98"
          >
            <FaBookOpen className="text-sm" />
            Go to Dashboard
          </Link>
          <Link
            href="/books"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold transition-all active:scale-98"
          >
            <FaCompass className="text-sm" />
            Continue Browsing
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
