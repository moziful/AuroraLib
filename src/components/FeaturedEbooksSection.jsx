import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { getAllBooks } from "@/lib/data";
import BookCard, { BookCardSkeleton } from "@/components/BookCard";
import SectionHeader from "@/components/SectionHeader";

const pickFeaturedBooks = (books) => {
  const source = Array.isArray(books) ? books : [];
  return [...source]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);
};

async function getFeaturedBooks() {
  const books = await getAllBooks();
  return pickFeaturedBooks(books);
}

export default async function FeaturedEbooksSection() {
  const books = await getFeaturedBooks();

  return (
    <section className="bg-white dark:bg-slate-950 px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-2 lg:flex-row lg:justify-between">
          <SectionHeader
            eyebrow="Featured Ebooks"
            heading="Latest picks from the library"
          />
          <Link
            href="/books"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition-colors hover:text-sky-200 shrink-0"
          >
            View all
            <FaArrowRight />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.length
            ? books.map((book) => (
                <BookCard
                  key={book.slug || `${book.title}-${book.createdAt}`}
                  book={book}
                />
              ))
            : Array.from({ length: 6 }).map((_, index) => (
                <BookCardSkeleton key={index} />
              ))}
        </div>
        {!books.length && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/30 p-8 text-center text-slate-800 dark:text-slate-300">
            No ebooks are available yet.
          </div>
        )}
      </div>
    </section>
  );
}
