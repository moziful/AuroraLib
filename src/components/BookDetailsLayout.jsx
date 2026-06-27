"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PurchaseButton from "./PurchaseButton";

export default function BookDetailsLayout({
  book,
  isAvailable,
  isOwned,
  isOwnBook,
  isLoggedIn,
  statusStyles,
  formatDate,
}) {
  const sidebarItems = [
    {
      label: "Genre",
      content: (
        <p className="mb-2 inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-sky-500 dark:text-sky-300">
          {book.genre}
        </p>
      ),
    },
    {
      label: "Author",
      content: (
        <p className="mt-1 text-base font-bold text-slate-800 dark:text-white">
          {book.writerName}
        </p>
      ),
    },
    {
      label: "Author Email",
      content: (
        <p className="mt-1 text-base font-bold text-slate-800 dark:text-white truncate" title={book.writerEmail}>
          {book.writerEmail}
        </p>
      ),
    },
    {
      label: "Published on",
      content: (
        <p className="mt-1 text-base font-bold text-slate-800 dark:text-white">
          {formatDate}
        </p>
      ),
    },
    {
      label: "Availability",
      content: (
        <span
          className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${statusStyles}`}
        >
          {book.status}
        </span>
      ),
    },
  ];

  return (
    <div className="grid flex-1 min-h-0 grid-cols-1 sm:grid-cols-3 gap-2 overflow-hidden rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 md:flex-row">
      {/* Left side content (Image) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 20 }}
        className="relative h-full min-h-0 w-full overflow-hidden shrink-0"
      >
        <Image
          src={book.coverImage || "/placeholder-cover.png"}
          alt={"Book Image"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="h-full min-h-0 w-full object-cover transition-transform duration-500 hover:scale-105"
          priority
        />
      </motion.div>

      {/* Middle content (Title & Description) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="min-h-0 overflow-hidden bg-white dark:bg-slate-900 p-6 shadow-lg shadow-black/20 overflow-y-auto scrollbar-none"
      >
        <h1 className="mb-2 text-4xl font-black text-slate-800 dark:text-white lg:text-5xl tracking-tight leading-tight">
          {book.title}
        </h1>
        <div className="h-1 w-12 bg-sky-500 rounded mb-4" />
        <p className="text-base leading-8 text-slate-600 dark:text-slate-300 text-justify">
          {book.description}
        </p>
      </motion.div>

      {/* Right side content (Sidebar & Buy details) */}
      <div className="flex min-h-0 flex-col justify-between bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="space-y-0.5">
          {sidebarItems.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.05, type: "spring", stiffness: 100, damping: 15 }}
              className="bg-white dark:bg-slate-900 p-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                {item.label}
              </p>
              {item.content}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + sidebarItems.length * 0.05, type: "spring", stiffness: 100, damping: 15 }}
          className="bg-white dark:bg-slate-900 p-6 border-t border-slate-100 dark:border-slate-800"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Purchase</p>
              <p className="mt-1 text-2xl font-black text-slate-800 dark:text-white">
                $ {typeof book?.price === 'number' ? book.price.toFixed(2) : "0.00"}
              </p>
            </div>
            <PurchaseButton
              bookId={book._id.toString()}
              title={book.title}
              price={book.price}
              isAvailable={isAvailable}
              isOwned={isOwned}
              isOwnBook={isOwnBook}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
