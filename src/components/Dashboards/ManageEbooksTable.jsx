"use client";

import Image from "next/image";
import { ImSpinner2 } from "react-icons/im";
import { MdEdit, MdDelete } from "react-icons/md";
import DataTable from "./DataTable";

export default function ManageEbooksTable({
  books,
  isLoading,
  emptyMessage = "No ebooks found.",
  actionLoading = {},
  toggleBookPublish,
  handleEditClick,
  deleteBook,
  showWriter = false,
}) {
  const headers = showWriter
    ? ["#", "Book Details", "Writer", "Genre", "Price", "Status", "Actions"]
    : ["#", "Book Details", "Genre", "Price", "Status", "Actions"];

  return (
    <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <DataTable
        headers={headers}
        data={books}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        renderRow={(book, index) => {
          const isPublished = book.status === "Available" || book.status === "published";
          const btnColorClass = isPublished
            ? "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
            : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white";

          return (
            <tr
              key={book._id || book.id || book.slug}
              className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">
                {index + 1}
              </td>
              <td className="px-4 py-3 flex items-center gap-2">
                <div className="relative h-12 w-9 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0">
                  <Image
                    src={book.coverImage || book.cover || "/not-found-image.png"}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium text-slate-900 dark:text-white max-w-37 truncate">
                  {book.title}
                </span>
              </td>
              {showWriter && (
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {book.writerName || "Unknown"}
                </td>
              )}
              <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                {book.genre || "N/A"}
              </td>
              <td className="px-4 py-3 text-violet-600 dark:text-violet-400 font-semibold">
                ${book.price}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium border w-24 ${
                    isPublished
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : book.status === "Coming Soon"
                        ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {book.status || "Available"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookPublish(book)}
                    disabled={
                      actionLoading[book._id || book.id] === "publishing" ||
                      actionLoading[book._id || book.id] === "deleting"
                    }
                    className={`inline-flex items-center justify-center gap-1 text-xs px-2.5 py-1 rounded transition-all disabled:opacity-50 min-w-24 ${btnColorClass}`}
                  >
                    {actionLoading[book._id || book.id] === "publishing" && (
                      <ImSpinner2 className="animate-spin text-xs" />
                    )}
                    {isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleEditClick(book)}
                    className="p-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded hover:bg-violet-500 hover:text-white transition-all"
                  >
                    <MdEdit />
                  </button>
                  <button
                    onClick={() => deleteBook(book.id || book._id)}
                    disabled={
                      actionLoading[book._id || book.id] === "publishing" ||
                      actionLoading[book._id || book.id] === "deleting"
                    }
                    className="p-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    {actionLoading[book._id || book.id] === "deleting" ? (
                      <ImSpinner2 className="animate-spin text-sm" />
                    ) : (
                      <MdDelete />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          );
        }}
        renderMobileCard={(book) => {
          const isPublished = book.status === "Available" || book.status === "published";
          const btnColorClass = isPublished
            ? "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white"
            : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white";

          return (
            <div
              key={book._id || book.id || book.slug}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
                  <Image
                    src={book.coverImage || book.cover || "/not-found-image.png"}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                    {book.title}
                  </p>
                  {showWriter && book.writerName && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {book.writerName}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {book.genre || "N/A"}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${
                        isPublished
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : book.status === "Coming Soon"
                            ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {book.status || "Available"}
                    </span>
                  </div>
                </div>
                <span className="text-violet-600 dark:text-violet-400 font-semibold text-sm whitespace-nowrap">
                  ${book.price}
                </span>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => toggleBookPublish(book)}
                  disabled={
                    actionLoading[book._id || book.id] === "publishing" ||
                    actionLoading[book._id || book.id] === "deleting"
                  }
                  className={`flex-1 text-xs py-2 rounded-lg transition-colors disabled:opacity-50 ${btnColorClass}`}
                >
                  {isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => handleEditClick(book)}
                  className="text-xs py-2 px-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500 hover:text-white transition-all"
                >
                  <MdEdit className="inline" />
                </button>
                <button
                  onClick={() => deleteBook(book.id || book._id)}
                  disabled={
                    actionLoading[book._id || book.id] === "publishing" ||
                    actionLoading[book._id || book.id] === "deleting"
                  }
                  className="text-xs py-2 px-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                >
                  <MdDelete className="inline" />
                </button>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
