"use client";

import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";

export default function PurchaseButton({ bookId, title, price, isAvailable, isOwned, isOwnBook }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
  };

  return (
    <form action="/api/checkout_sessions" method="POST" onSubmit={handleSubmit}>
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="price" value={price} />
      <input type="hidden" name="bookId" value={bookId} />

      <section>
        <button
          type="submit"
          role="link"
          disabled={!isAvailable || loading}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black transition-all duration-200 ${
            isAvailable
              ? "bg-sky-400 text-slate-950 hover:bg-sky-300"
              : isOwned
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-not-allowed"
                : isOwnBook
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/30 cursor-not-allowed"
                  : "cursor-not-allowed bg-slate-800 text-slate-500"
          }`}
        >
          {loading && <ImSpinner2 className="animate-spin text-sm" />}
          {isOwned
            ? "Owned"
            : isOwnBook
              ? "Your Publication"
              : isAvailable
                ? "Purchase Now"
                : "Unavailable for Purchase"}
        </button>
      </section>
    </form>
  );
}
