import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookById } from "@/lib/data";
import { FaChevronLeft } from "react-icons/fa";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getStatusStyles = (status) => {
  switch (status) {
    case "Available": return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "Unavailable": return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    default: return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }
};

export default async function BookDetailsPage({ params }) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const isAvailable = book.status === "Available";
  const statusStyles = getStatusStyles(book.status);

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 px-4 py-6">
      <div className="mx-auto flex h-full min-h-0 max-w-7xl flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-200 transition-colors hover:border-sky-400/40 hover:text-sky-300"
          >
            <FaChevronLeft />
            Back to Books
          </Link>
        </div>
        <div className="grid flex-1 min-h-0 grid-cols-3 gap-2 overflow-hidden rounded-xl border-2 border-slate-700 bg-slate-800 md:flex-row">
          {/* Left side content */}
          <Image
            src={book.coverImage || "/placeholder-cover.png"}
            alt={"Book Image"}
            width={800}
            height={1000}
            className="h-full min-h-0 w-full object-cover"
            priority
          />
          {/* Middle content */}
          <div className="min-h-0 overflow-hidden bg-slate-900 p-6 shadow-lg shadow-black/20 overflow-y-auto scrollbar-none">
            <h1 className="mb-2 text-4xl font-black text-white lg:text-5xl">
              {book.title}
            </h1>
            <p className=" text-lg leading-8 text-slate-300 text-justify">
              {book.description}
            </p>
          </div>
          {/* Right side content */}
          <div className="flex min-h-0 flex-col justify-between overflow-hidden">
            <div className="bg-slate-900 p-4 py-3">
              <p className="text-sm text-slate-500 mb-2">Genre</p>
              <p className="mb-2 inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
                {book.genre}
              </p>
            </div>
            <div className="bg-slate-900 p-4">
              <p className="text-sm text-slate-500">Author</p>
              <p className="mt-1 text-base font-bold text-white">
                {book.writerName}
              </p>
            </div>
            <div className="bg-slate-900 p-4">
              <p className="text-sm text-slate-500">Author Email</p>
              <p className="mt-1 text-base font-bold text-white">{book.writerEmail}</p>
            </div>
            <div className="bg-slate-900 p-4">
              <p className="text-sm text-slate-500">Published on</p>
              <p className="mt-1 text-base font-bold text-white">
                {formatDate(book.createdAt)}
              </p>
            </div>
            <div className="bg-slate-900 p-4">
              <p className="text-sm text-slate-500">Availability</p>
              <span
                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${statusStyles}`}
              >
                {book.status}
              </span>
            </div>
            <div className="bg-slate-900 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Purchase</p>
                  <p className="mt-1 text-2xl font-black text-white">
                    {/* Use Number() to ensure it's a number, and provide a fallback */}
                    $ {typeof book?.price === 'number' ? book.price.toFixed(2) : "0.00"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!isAvailable}
                  className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-black transition-all duration-200 ${isAvailable
                    ? "bg-sky-400 text-slate-950 hover:bg-sky-300"
                    : "cursor-not-allowed bg-slate-800 text-slate-500"
                    }`}
                >
                  {isAvailable ? "Purchase Now" : "Unavailable for Purchase"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}