"use client";

import { useState, useEffect } from "react";
import { getAllBooks } from "@/lib/data";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import BookCard, { BookCardSkeleton } from "@/components/BookCard";

const itemsPerPage = 6;

export default function EbooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getAllBooks({
          search: searchQuery,
          status,
          sort: sortBy,
        });
        setBooks(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to load books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchQuery, status, sortBy]);

  const handleClearFilters = () => {
    setSearchInput("");
    setStatus("all");
    setSortBy("newest");
  };

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <h1 className="text-4xl font-bold text-sky-400">
          Books: {books.length}
          <span className="text-base font-normal text-slate-700 dark:text-slate-400 ml-3">
            (Page {activePage} of {totalPages})
          </span>
        </h1>
      </div>
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-4 mb-8 flex flex-col lg:flex-row items-end lg:items-center gap-4 shadow-lg shadow-black/20">
        <div className="w-full lg:flex-1">
          <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1">Search (Title, Author, Genre)</label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type to search..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-200 focus:outline-none focus:border-sky-400 transition-colors placeholder:text-slate-500"
          />
        </div>
        <div className="w-full lg:w-auto">
          <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-200 focus:outline-none focus:border-sky-400 transition-colors"
          >
            <option value="all">All</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
            <option value="Coming Soon">Coming Soon</option>
          </select>
        </div>
        <div className="w-full lg:w-auto">
          <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-200 focus:outline-none focus:border-sky-400 transition-colors"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
        <button
          onClick={handleClearFilters}
          title="Clear Filters"
          className="w-full lg:w-auto h-10 mt-auto px-4 bg-white dark:bg-slate-800 hover:bg-slate-700 border border-slate-300 dark:border-slate-700 hover:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
        >
          <FaTimes />
          <span className="lg:hidden">Clear Filters</span>
        </button>
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
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-700 dark:text-slate-400 border border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50">
            <p className="text-lg font-medium text-slate-300">No books found.</p>
            <p className="text-sm">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pb-10 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:border-sky-400 hover:text-sky-400 transition-colors"
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${activePage === pageNum
                ? "bg-sky-400 text-black font-black shadow-lg shadow-sky-400/20"
                : "bg-white dark:bg-slate-800 border border-slate-700 text-slate-700 dark:text-slate-400 hover:text-sky-400 hover:border-sky-400"
                }`}
            >
              {pageNum}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:border-sky-400 hover:text-sky-400 transition-colors"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}