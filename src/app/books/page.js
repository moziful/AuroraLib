import { getAllBooks } from "@/lib/data";
import Image from "next/image";

export default async function EbooksPage() {
  const books = await getAllBooks();
  return (
    <div className="flex flex-col max-w-7xl w-full mx-auto min-h-[calc(100vh-4rem)]">
      <div className="text-4xl font-bold text-sky-400 mb-4">
        <h1>Books: {books.length}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book._id} className="bg-slate-800 p-4 rounded-xl shadow-md">
            <Image
              src={book.coverImage || "/placeholder-cover.png"}
              alt={book.title}
              width={300}
              height={200}
              className="w-full h-50 object-cover mb-4 rounded-xl"
            />
            <h2 className="text-xl font-semibold text-white mb-2">{book.title}</h2>
            <p className="text-gray-400 mb-2">Author: {book.author}</p>
            <p className="text-gray-400 mb-2">Genre: {book.genre}</p>
            <p className="text-gray-400 mb-2">
              Published:{" "}
              {new Date(book.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
