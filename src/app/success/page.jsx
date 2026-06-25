import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaCheckCircle,
  FaBookOpen,
  FaCompass,
  FaChevronRight,
} from "react-icons/fa";
import { stripe } from "../../lib/stripe";
import { handleSuccessfulPurchase } from "@/lib/user-actions";
import { getBookById } from "@/lib/data";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const { status, customer_details, metadata } = session;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const appUserEmail = metadata?.userEmail || customer_details?.email;
    let book = null;
    if (metadata?.bookId) {
      await handleSuccessfulPurchase(metadata.bookId, appUserEmail);
      book = await getBookById(metadata.bookId);
    }

    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
        <div className="relative max-w-2xl w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-8 md:p-10 border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 mb-4">
              <FaCheckCircle className="text-5xl" />
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-850 dark:text-white tracking-tight">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Thank you for supporting authors. Your payment was processed
              successfully.
            </p>
          </div>

          {book && (
            <div className="mb-8 p-5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-150 dark:border-slate-850 flex flex-col sm:flex-row gap-5 items-center sm:items-start text-left">
              <div className="relative w-28 h-36 rounded-md overflow-hidden shadow-md bg-slate-200 dark:bg-slate-800 shrink-0">
                <Image
                  src={book.coverImage || "/placeholder-cover.png"}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between h-full py-1 text-center sm:text-left">
                <div>
                  <h2 className="mt-1 text-xl font-bold text-slate-800 dark:text-white line-clamp-1">
                    {book.title}
                  </h2>
                  <span className="inline-block rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-2">
                    {book.genre}
                  </span>
                  <p className="text-sm text-slate-550 dark:text-slate-400">
                    By {book.writerName}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <p>
                    Format:{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-350">
                      PDF
                    </span>
                  </p>
                  <p>
                    Access:{" "}
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Lifetime
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mb-8 border-t border-b border-slate-100 dark:border-slate-800 py-5 text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                Account Email
              </span>
              <span className="font-semibold text-slate-800 dark:text-white">
                {appUserEmail}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                Transaction ID
              </span>
              <span
                className="font-mono text-xs text-slate-600 dark:text-slate-350 truncate max-w-45 sm:max-w-none"
                title={session_id}
              >
                {session_id.substring(0, 24)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                Total Charged
              </span>
              <span className="font-bold text-sky-500 dark:text-sky-400">
                ${(session.amount_total / 100).toFixed(2)} USD
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-98"
            >
              <FaBookOpen className="text-sm" />
              Go to Dashboard
            </Link>
            <Link
              href="/books"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold transition-all active:scale-98"
            >
              <FaCompass className="text-sm" />
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
