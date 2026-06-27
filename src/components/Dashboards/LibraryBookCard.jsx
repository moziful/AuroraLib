import Image from "next/image";
import Link from "next/link";
import { FaBookOpen, FaDownload, FaAward } from "react-icons/fa";

export default function LibraryBookCard({ book }) {
  const purchasedDate = book.purchasedAt
    ? new Date(book.purchasedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-4 transition-all relative hover:border-sky-500/30">
      <div className="absolute -inset-px -z-10 rounded-2xl bg-linear-to-r from-sky-500/0 via-sky-500/0 to-indigo-500/0 opacity-0 blur transition-all duration-500 group-hover:from-sky-500/10 group-hover:to-indigo-500/10 group-hover:opacity-100" />
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <FaAward className="text-xs" />
          Owned
        </span>
      </div>
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 shadow-inner">
        <Image
          src={book.coverImage || "/placeholder-cover.png"}
          alt={book.title || "Book Cover"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end justify-center p-3">
          <span className="text-[10px] text-white/90 font-medium tracking-wide">
            Lifetime Library Access
          </span>
        </div>
      </div>
      <div className="mt-3.5 flex flex-col flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            {book.genre || "General"}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            Bought: {purchasedDate}
          </span>
        </div>
        <h3 className="line-clamp-1 text-base font-bold text-slate-800 dark:text-white transition-colors group-hover:text-sky-500">
          {book.title || "Untitled Book"}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          By {book.writerName || "Unknown Writer"}
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/books/id/${book._id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-500 py-2 text-xs font-bold text-white transition-all hover:bg-sky-600 active:scale-95 shadow-sm shadow-sky-500/20"
          >
            <FaBookOpen className="text-xs" />
            Read Ebook
          </Link>
          <button
            onClick={() => alert("PDF download started! (Simulated)")}
            className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white"
            title="Download PDF"
          >
            <FaDownload className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
