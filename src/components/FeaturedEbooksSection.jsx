import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { getAllBooks, booksdata } from "@/lib/data";
import BookCard from "@/components/BookCard";



const pickFeaturedBooks = (books) => {
  const source = Array.isArray(books) ? books : [];
  const featured = source.filter((book) => book?.isFeatured);
  const pool = featured.length ? featured : source;

  return [...pool]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
};

async function getFeaturedBooks() {
  const books = await getAllBooks();
  return pickFeaturedBooks(books.length ? books : booksdata);
}

export default async function FeaturedEbooksSection() {
  const books = await getFeaturedBooks();

  return (
    <section className="bg-slate-950 px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
              Featured Ebooks
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Latest picks from the library
            </h2>
          </div>

          <Link
            href="/books"
            className="hidden items-center gap-2 text-sm font-bold text-sky-300 transition-colors hover:text-sky-200 sm:inline-flex"
          >
            View all
            <FaArrowRight />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book.slug || `${book.title}-${book.createdAt}`}
              book={book}
            />
          ))}
        </div>

        {!books.length && (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center text-slate-300">
            No ebooks are available yet.
          </div>
        )}

        <div className="mt-6 sm:hidden">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition-colors hover:text-sky-200"
          >
            View all ebooks
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
