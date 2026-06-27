"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaBookOpen, FaDollarSign, FaTrophy } from "react-icons/fa";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const rankConfig = [
  {
    place: "1st",
    emoji: "🥇",
    banner: "from-red-500/30 via-red-400/20 to-transparent",
    bannerLine: "from-red-400 to-red-600",
    ring: "ring-red-400/60",
    glow: "hover:shadow-red-500/20",
    genrePill: "bg-red-400/10 text-red-300 border-red-400/20",
    statIcon: "text-red-400",
    divider: "via-red-400/30",
  },
  {
    place: "2nd",
    emoji: "🥈",
    banner: "from-orange-500/30 via-orange-400/20 to-transparent",
    bannerLine: "from-orange-400 to-orange-600",
    ring: "ring-orange-400/60",
    glow: "hover:shadow-orange-500/20",
    genrePill: "bg-orange-400/10 text-orange-300 border-orange-400/20",
    statIcon: "text-orange-400",
    divider: "via-orange-400/30",
  },
  {
    place: "3rd",
    emoji: "🥉",
    banner: "from-yellow-500/30 via-yellow-400/20 to-transparent",
    bannerLine: "from-yellow-400 to-yellow-600",
    ring: "ring-yellow-400/60",
    glow: "hover:shadow-yellow-500/20",
    genrePill: "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
    statIcon: "text-yellow-400",
    divider: "via-yellow-400/30",
  },
];

export default function WritersGrid({ writers }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="grid gap-6 sm:grid-cols-3"
    >
      {writers.map((writer, idx) => {
        const rank = rankConfig[idx];
        const isFirst = idx === 0;

        return (
          <motion.div
            key={writer.email || writer.name}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { type: "spring", stiffness: 100, damping: 15 } 
              },
            }}
            whileHover={{ y: -6, scale: 1.02 }}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-shadow duration-305 hover:shadow-2xl ${rank.glow} ${isFirst ? "sm:-mt-4" : ""}`}
          >
            <div className={`relative h-24 bg-linear-to-b ${rank.banner}`}>
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${rank.bannerLine}`}
              />
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <FaTrophy className={`text-sm ${rank.statIcon}`} />
                <span
                  className={`text-xs font-black uppercase tracking-widest ${rank.statIcon}`}
                >
                  {rank.place} Place
                </span>
              </div>
              <span className="absolute right-4 top-3 text-3xl leading-none">
                {rank.emoji}
              </span>
            </div>

            <div className="relative -mt-10 flex justify-center">
              <div
                className={`h-20 w-20 overflow-hidden rounded-full ring-4 ${rank.ring} bg-white dark:bg-slate-900 shadow-lg transition-transform duration-300 group-hover:scale-105 flex items-center justify-center`}
              >
                {writer.avatar ? (
                  <Image
                    src={writer.avatar}
                    alt={writer.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800 text-2xl font-black text-sky-400">
                    {getInitials(writer.name)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center gap-3 px-5 pb-6 pt-3 text-center">
              <div>
                <h3 className="text-lg font-black leading-tight text-slate-800 dark:text-white">
                  {writer.name}
                </h3>
                <span
                  className={`mt-2 inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${rank.genrePill}`}
                >
                  {writer.topGenre}
                </span>
              </div>
              <div
                className={`h-px w-full bg-linear-to-r from-transparent ${rank.divider} to-transparent`}
              />
              <div className="flex w-full items-center justify-around">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <FaBookOpen className={`text-xs ${rank.statIcon}`} />
                    <span className="text-xl font-black text-slate-800 dark:text-white">
                      {writer.bookCount}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Books
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1">
                    <FaDollarSign className={`text-xs ${rank.statIcon}`} />
                    <span className="text-xl font-black text-slate-800 dark:text-white">
                      {writer.totalSales.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">
                    Total Sales
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
