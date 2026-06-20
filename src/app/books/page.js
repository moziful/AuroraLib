import Image from "next/image";
import Link from "next/link";
import { booksdata } from "@/lib/data"; // Importing the static books array for fallback or testing purposes

export default async function EbooksPage() {
  // const books = await getAllBooks();
  const books = booksdata;
  return (
    <div className="flex flex-col max-w-7xl w-full mx-auto min-h-[calc(100vh-4rem)]">
      <div className="text-4xl font-bold text-sky-400 mb-4">
        <h1>Books: {books.length}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {books.map((book) => (
          // Change the key to _id for production -----------------------------------------------------------
          <div key={book.slug || book.price} className="bg-slate-800 rounded-xl shadow-md overflow-hidden flex flex-col items-center relative">
            <span className={`absolute top-0 right-0 uppercase leading-loose text-xs font-semibold px-2 rounded-bl-xl ${book.status === "Available" ? "text-green-600 bg-green-100" :
              book.status === "Unavailable" ? "text-red-600 bg-red-200" :
                "text-orange-500 bg-orange-100"
              }`}>
              {book.status}
            </span>
            <Image
              src={book.coverImage || "/placeholder-cover.png"}
              alt={book.title}
              width={300}
              height={200}
              className="w-full h-60 object-cover mb-4"
            />
            <div className="p-4 pt-0 w-full flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-sky-400 truncate mr-4">
                  {book.title}
                </h2>
                <p className="text-lg font-bold text-white whitespace-nowrap shrink-0 text-right">
                  $ {book.price.toFixed(2)}
                </p>
              </div>
              <span className="text-white flex flex-col gap-2">
                <p>Author: {book.writerName}</p>
                <p>{book.genre} • <span>
                  {new Date(book.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span></p>

              </span>
              <Link
                href={`/books/${book.slug}`}
                className="w-full px-3 py-2 bg-sky-400 cursor-pointer text-black rounded-lg font-semibold hover:bg-sky-500 transition-opacity duration-300 text-center"
              >
                View Details
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
