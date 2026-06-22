"use client";

import { useState, useEffect } from "react";
import { getAllBooks } from "@/lib/data";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BookCard, { BookCardSkeleton } from "@/components/BookCard";

const itemsPerPage = 6;

export default function EbooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Correct asynchronous data fetching
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getAllBooks();
        setBooks(data);
      } catch (error) {
        console.error("Failed to load books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Pagination Calculation
  const totalItems = books.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-4 xl:p-0 flex flex-col max-w-7xl w-full mx-auto min-h-[calc(100vh-4rem)]">
      <div className="text-4xl font-bold text-sky-400 mb-4">
        <h1>
          Books: {books.length}
          <span className="text-base font-normal text-slate-400 ml-3">
            (Page {activePage} of {totalPages})
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {loading ? (
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))
        ) : currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <BookCard key={book._id || book.slug} book={book} />
          ))
        ) : (
          <p className="text-slate-400">No books found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pb-10 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:border-sky-400 hover:text-sky-400 transition-colors"
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${activePage === pageNum
                  ? "bg-sky-400 text-black font-black shadow-lg shadow-sky-400/20"
                  : "bg-slate-800 border border-slate-700 text-slate-400 hover:text-sky-400 hover:border-sky-400"
                }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:border-sky-400 hover:text-sky-400 transition-colors"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}