"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { authClient } from "@/lib/auth-client";
import { toggleBookmarkAction } from "@/lib/user-actions";
import { toast } from "react-toastify";

export default function BookmarkBookCard({
  book,
  hoverBorderClass = "hover:border-sky-500/30",
  actionLabel = "View Details",
  onUnbookmark,
}) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);

  const handleUnbookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.warning("Please sign in to manage bookmarks.");
      return;
    }

    setLoading(true);
    try {
      const res = await toggleBookmarkAction(book._id || book.id, user.email);
      if (res && res.success) {
        toast.success("Removed from bookmarks.");
        if (onUnbookmark) {
          onUnbookmark(book._id || book.id);
        }
      } else {
        toast.error("Failed to remove bookmark.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      href={`/books/id/${book._id || book.id}`}
      className={`group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-4 transition-all relative ${hoverBorderClass}`}
    >
      <button
        onClick={handleUnbookmark}
        disabled={loading}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all backdrop-blur-sm"
        title="Remove from bookmarks"
      >
        {loading ? (
          <ImSpinner2 className="animate-spin text-sm text-sky-400" />
        ) : (
          <FaHeart className="text-sm text-sky-400" />
        )}
      </button>
      <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 mb-3">
        <Image
          src={book.coverImage || book.cover || "/placeholder-cover.png"}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="line-clamp-1 font-bold text-sm text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
        {book.title}
      </h3>
      {(book.writer || book.writerName) && (
        <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5">
          {book.writer || book.writerName}
        </p>
      )}
      <div className="mt-3 block text-center rounded-lg bg-slate-200 dark:bg-slate-800 py-1.5 text-xs font-semibold text-slate-900 dark:text-slate-300 transition-colors group-hover:bg-sky-400 group-hover:text-slate-950">
        {actionLabel}
      </div>
    </Link>
  );
}
