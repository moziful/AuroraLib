"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { booksdata } from "@/lib/data";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const itemsPerPage = 6;

export default function EbooksPage() {
  const books = booksdata;
  const [currentPage, setCurrentPage] = useState(1);

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
        {currentBooks.map((book) => (
          // Change the key to _id for production -----------------------------------------------------------
          <div
            key={book.slug || book.price}
            className="bg-slate-800 rounded-xl shadow-md overflow-hidden flex flex-col items-center relative"
          >
            <span
              className={`absolute top-0 right-0 uppercase leading-loose text-xs font-semibold px-2 rounded-bl-xl ${book.status === "Available"
                ? "text-green-600 bg-green-100"
                : book.status === "Unavailable"
                  ? "text-red-600 bg-red-200"
                  : "text-orange-500 bg-orange-100"
                }`}
            >
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
                <p>
                  {book.genre} •{" "}
                  <span>
                    {new Date(book.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
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

      {totalPages > 1 && (
        <div className="pb-10 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:border-sky-400 hover:text-sky-400 transition-colors"
          >
            <FaChevronLeft />

          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
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
            )
          )}
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
