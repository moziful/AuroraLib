import BookmarkBookCard from "./BookmarkBookCard";

export default function EbookGallery({
  books,
  isLoading,
  emptyMessage = "No ebooks found.",
  actionLabel = "View Details",
  hoverBorderClass = "hover:border-sky-500/30",
  btnHoverClass = "hover:bg-sky-400 dark:hover:bg-sky-400",
  onUnbookmark,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-4"
          >
            <div className="relative aspect-3/4 rounded-xl bg-slate-200 dark:bg-slate-800 mb-3" />
            <div className="h-4 bg-slate-250 dark:bg-slate-805 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-250 dark:bg-slate-805 rounded w-1/2" />
            <div className="mt-3 h-7 bg-slate-250 dark:bg-slate-805 rounded-lg w-full" />
          </div>
        ))}
      </div>
    );
  }

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
        <BookmarkBookCard
          key={`${book._id || book.id || book.slug || "book"}-${index}`}
          book={book}
          hoverBorderClass={hoverBorderClass}
          actionLabel={actionLabel}
          onUnbookmark={onUnbookmark}
        />
      ))}
    </div>
  );
}
