import Image from "next/image";
import Link from "next/link";

export default function EbookGallery({
  books,
  emptyMessage = "No ebooks found.",
  actionLabel = "View Details",
  hoverBorderClass = "hover:border-sky-500/30",
  btnHoverClass = "hover:bg-sky-500 dark:hover:bg-sky-400",
}) {
  if (!books || books.length === 0) {
    return (
      <p className="text-slate-600 dark:text-slate-500 text-sm">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {books.map((book, index) => (
        <Link
          key={`${book._id || book.id || book.slug || "book"}-${index}`}
          href={`/books/id/${book._id || book.id}`}
          className={`group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-4 transition-all ${hoverBorderClass}`}
        >
          <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 mb-3">
            <Image
              src={book.coverImage || book.cover || "/placeholder-cover.png"}
              alt={book.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h3 className="line-clamp-1 font-bold text-sm text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
            {book.title}
          </h3>
          {book.writer && (
            <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5">
              {book.writer}
            </p>
          )}
          <div
            className="mt-3 block text-center rounded-lg bg-slate-200 dark:bg-slate-800 py-1.5 text-xs font-semibold text-slate-900 dark:text-slate-300 transition-colors group-hover:bg-sky-400 group-hover:text-slate-950"
          >
            {actionLabel}
          </div>
        </Link>
      ))}
    </div>
  );
}
