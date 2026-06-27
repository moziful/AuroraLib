"use client";

import { motion } from "framer-motion";

export default function AnalyticsStatCard({
  title,
  value,
  description,
  icon: Icon,
  colorClass = "text-violet-400",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-6"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </span>
        {Icon && <Icon className={`text-xl ${colorClass}`} />}
      </div>
      <div className="text-3xl font-black text-slate-900 dark:text-white">
        {value}
      </div>
      {description && (
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-500">
          {description}
        </p>
      )}
    </motion.div>
  );
}
