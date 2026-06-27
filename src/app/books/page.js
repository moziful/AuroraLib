"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllBooks } from "@/lib/data";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import BookCard, { BookCardSkeleton } from "@/components/BookCard";

const itemsPerPage = 6;

const GENRES = [
  "Fiction",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Horror",
  "History",
  "Science",
  "Business",
  "Self-Help",
  "Travel",
  "Poetry"
];

const getPageNumbers = (currentPage, totalPages, maxButtons = 7) => {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  let startPage = currentPage - Math.floor((maxButtons - 1) / 2);
  if (startPage < 1) {
    startPage = 1;
  }

  let endPage = startPage + maxButtons - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = endPage - maxButtons + 1;
  }

  return Array.from({ length: maxButtons }, (_, i) => startPage + i);
};

export default function EbooksPageWrapper() {
  return (
    <Suspense fallback={
      <div className="p-4 xl:p-0 flex flex-col max-w-7xl w-full mx-auto min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-xl text-sky-400 font-medium">Loading catalog...</div>
      </div>
    }>
      <EbooksPage />
    </Suspense>
  );
}

function EbooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [genre, setGenre] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [restored, setRestored] = useState(false);

  const isFirstFetch = useRef(true);

  // Restore state on mount if navigating back from a details page or reading from searchParams
  useEffect(() => {
    const paramGenre = searchParams.get("genre");
    const paramSearch = searchParams.get("search");
    const paramStatus = searchParams.get("status");
    const paramSort = searchParams.get("sort");
    const paramMinPrice = searchParams.get("minPrice");
    const paramMaxPrice = searchParams.get("maxPrice");

    const prevPath = sessionStorage.getItem("prev_path") || "";
    const cameFromDetails = prevPath.startsWith("/books/id/");

    let initialPage = 1;
    let initialSearch = "";
    let initialStatus = "all";
    let initialSort = "newest";
    let initialGenre = "all";
    let initialMinPrice = "";
    let initialMaxPrice = "";

    // 1. Prioritize searchParams if they exist
    if (paramGenre || paramSearch || paramStatus || paramSort || paramMinPrice || paramMaxPrice) {
      if (paramGenre) initialGenre = paramGenre;
      if (paramSearch) initialSearch = paramSearch;
      if (paramStatus) initialStatus = paramStatus;
      if (paramSort) initialSort = paramSort;
      if (paramMinPrice) initialMinPrice = paramMinPrice;
      if (paramMaxPrice) initialMaxPrice = paramMaxPrice;
    } else if (cameFromDetails) {
      // 2. Fallback to sessionStorage if we came from details
      initialPage = Number(sessionStorage.getItem("books_page") || "1");
      initialSearch = sessionStorage.getItem("books_search") || "";
      initialStatus = sessionStorage.getItem("books_status") || "all";
      initialSort = sessionStorage.getItem("books_sort") || "newest";
      initialGenre = sessionStorage.getItem("books_genre") || "all";
      initialMinPrice = sessionStorage.getItem("books_minPrice") || "";
      initialMaxPrice = sessionStorage.getItem("books_maxPrice") || "";
    }

    setCurrentPage(initialPage);
    setSearchInput(initialSearch);
    setSearchQuery(initialSearch);
    setStatus(initialStatus);
    setSortBy(initialSort);
    setGenre(initialGenre);
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
    setRestored(true);
  }, [searchParams]);

  // Save changes to sessionStorage
  useEffect(() => {
    if (restored) {
      sessionStorage.setItem("books_page", currentPage);
      sessionStorage.setItem("books_search", searchInput);
      sessionStorage.setItem("books_status", status);
      sessionStorage.setItem("books_sort", sortBy);
      sessionStorage.setItem("books_genre", genre);
      sessionStorage.setItem("books_minPrice", minPrice);
      sessionStorage.setItem("books_maxPrice", maxPrice);
    }
  }, [currentPage, searchInput, status, sortBy, genre, minPrice, maxPrice, restored]);

  useEffect(() => {
    if (!restored) return;
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, restored]);

  useEffect(() => {
    if (!restored) return;
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const data = await getAllBooks({
          search: searchQuery,
          status,
          sort: sortBy,
          genre,
          minPrice,
          maxPrice,
        });
        setBooks(data);
        
        if (isFirstFetch.current) {
          isFirstFetch.current = false;
        } else {
          setCurrentPage(1);
        }
      } catch (error) {
        console.error("Failed to load books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [searchQuery, status, sortBy, genre, minPrice, maxPrice, restored]);

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchQuery("");
    setStatus("all");
    setSortBy("newest");
    setGenre("all");
    setMinPrice("");
    setMaxPrice("");
    router.replace("/books");
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

  const PaginationButton = ({ pageNum }) => {
    if (pageNum === "...") {
      return (
        <button
          disabled
          className="w-9 h-9 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-700 text-slate-700 dark:text-slate-400 cursor-default opacity-50"
        >
          ...
        </button>
      );
    }
    return (
      <button
        onClick={() => handlePageChange(pageNum)}
        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
          activePage === pageNum
            ? "bg-sky-400 text-black font-black shadow-lg shadow-sky-400/20"
            : "bg-white dark:bg-slate-800 border border-slate-700 text-slate-700 dark:text-slate-400 hover:text-sky-400 hover:border-sky-400"
        }`}
      >
        {pageNum}
      </button>
    );
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
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-4 mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end shadow-lg shadow-black/20">
        <div className="w-full sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2">
          <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1">Search (Title, Author, Genre)</label>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Type to search..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-200 focus:outline-none focus:border-sky-400 transition-colors placeholder:text-slate-500"
          />
        </div>
        <div className="w-full">
          <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-200 focus:outline-none focus:border-sky-400 transition-colors"
          >
            <option value="all">All Genres</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-200 focus:outline-none focus:border-sky-400 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
            <option value="Coming Soon">Coming Soon</option>
          </select>
        </div>
        <div className="w-full">
          <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1">Min Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-200 focus:outline-none focus:border-sky-400 transition-colors placeholder:text-slate-500"
          />
        </div>
        <div className="w-full">
          <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1">Max Price ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-600 dark:text-slate-200 focus:outline-none focus:border-sky-400 transition-colors placeholder:text-slate-500"
          />
        </div>
        <div className="w-full">
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
          className="w-full h-10 px-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2 transition-colors text-sm font-medium"
        >
          <FaTimes />
          <span>Clear Filters</span>
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
          <div className="col-span-full py-12 flex flex-col items-center justify-center border border-slate-300 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50">
            <p className="text-lg font-medium text-slate-800 dark:text-slate-200">No books found.</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your filters to find what you're looking for.</p>
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
          
          {/* Desktop Pagination (11 buttons) */}
          <div className="hidden md:flex items-center gap-2">
            {getPageNumbers(activePage, totalPages, 11).map((pageNum, idx) => (
              <PaginationButton key={`desktop-${pageNum}-${idx}`} pageNum={pageNum} />
            ))}
          </div>

          {/* Tablet Pagination (7 buttons) */}
          <div className="hidden sm:flex md:hidden items-center gap-2">
            {getPageNumbers(activePage, totalPages, 7).map((pageNum, idx) => (
              <PaginationButton key={`tablet-${pageNum}-${idx}`} pageNum={pageNum} />
            ))}
          </div>

          {/* Mobile Pagination (5 buttons) */}
          <div className="flex sm:hidden items-center gap-2">
            {getPageNumbers(activePage, totalPages, 5).map((pageNum, idx) => (
              <PaginationButton key={`mobile-${pageNum}-${idx}`} pageNum={pageNum} />
            ))}
          </div>

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