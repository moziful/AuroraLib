import { getAllBooks } from "@/lib/data";

export default async function EbooksPage() {
  const books = await getAllBooks();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-4xl font-bold text-sky-400 mb-4">
        <h1>Books: {books.length}</h1>
      </div>
    </div>
  );
}
