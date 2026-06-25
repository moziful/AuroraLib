import Image from "next/image";
import Link from "next/link";

export default function BookCard({ book }) {
  return (
    <Link href={`/books/id/${book._id}`}>
      <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-md overflow-hidden flex flex-col items-center relative transition-all duration-300 hover:-translate-y-1">
        <span
          className={`absolute top-0 right-0 uppercase leading-loose text-xs font-semibold px-2 rounded-bl-xl ${
            book.status === "Available"
              ? "text-green-600 bg-green-100"
              : book.status === "Unavailable"
                ? "text-red-600 bg-red-200"
                : "text-orange-500 bg-orange-100"
          }`}
        >
          {book.status}
        </span>
        <Image
          src={book.coverImage || "/placeholder-cover.png"}
          alt={book.title}
          width={300}
          height={200}
          className="w-full h-60 border-b-2 border-slate-300 dark:border-none object-cover mb-4"
        />
        <div className="p-4 pt-0 w-full flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-sky-500 dark:text-sky-400 truncate mr-4">
              {book.title || "Untitled Book"}
            </h2>
            <p className="text-lg font-bold text-slate-800 dark:text-white whitespace-nowrap shrink-0 text-right">
              $ {Number(book?.price ?? 0).toFixed(2)}
            </p>
          </div>
          <span className="text-slate-500 dark:text-white flex flex-col gap-2">
            <p>Author: {book.writerName || "Unknown Author"}</p>
            <p>
              {book.genre || "Unknown Genre"} •{" "}
              <span>
                {new Date(book?.createdAt || Date.now()).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>
            </p>
          </span>
          <div className="w-full px-3 py-2 bg-sky-400 cursor-pointer text-black rounded-lg font-semibold hover:bg-sky-500 transition-opacity duration-300 text-center">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-md">
      <div className="h-60 w-full animate-pulse bg-slate-800" />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="h-7 w-2/3 animate-pulse rounded-md bg-slate-800" />
          <div className="h-6 w-16 animate-pulse rounded-md bg-slate-800" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-slate-800" />
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-slate-800" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-800" />
      </div>
    </div>
  );
}
