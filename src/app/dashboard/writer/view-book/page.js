"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getBooksByEmail } from "@/lib/data";

export default function ViewBookPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const loadBooks = async () => {
      if (!user?.email) {
        setBooks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const writerBooks = await getBooksByEmail(user.email);

      if (!alive) return;
      setBooks(writerBooks);
      setLoading(false);
    };

    loadBooks();

    return () => {
      alive = false;
    };
  }, [user?.email]);

  if (isPending || loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white">Loading your books...</h1>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white">Sign in first</h1>
        <p className="mt-2 text-slate-400">You need to be signed in to view your books.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-white sm:text-4xl">
          Your Books: <span className="text-sky-400">{books.length}</span>
        </h1>
      </div>

      {books.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-bold text-white">No books found</h2>
          <p className="mt-2 text-sm text-slate-400">
            We could not find any books for this email address.
          </p>
          <Link
            href="/dashboard/writer/add-book"
            className="mt-5 inline-flex rounded-xl bg-sky-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-sky-300"
          >
            Add your first book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <div
              key={book._id}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg shadow-black/20"
            >
              <div className="relative aspect-3/2 w-full bg-slate-950">
                <Image
                  src={book.coverImage || "/placeholder-cover.png"}
                  alt={book.title || "Book cover"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <h2 className="text-xl font-bold text-white">{book.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{book.genre}</p>
                  <p className={`mt-1 text-xs border rounded-full w-fit px-2 py-1 ${book.status === "Available" ? "bg-green-500 text-black" : book.status === "Coming Soon" ? "bg-yellow-500 text-black" : "bg-red-500 text-white"} text-slate-900`}>
                    {book.status}
                  </p>
                </div>
                <p className="line-clamp-3 text-sm text-slate-300">
                  {book.description || "No description provided."}
                </p>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Writer: {book.writerName || user.name}</span>
                  <span>${Number(book.price || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
