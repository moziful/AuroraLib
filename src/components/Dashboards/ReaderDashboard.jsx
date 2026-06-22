"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MdDashboard,
  MdHistory,
  MdMenuBook,
  MdBookmark,
  MdPerson,
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

// FAke data
async function getPurchaseHistory(email) {
  return [
    {
      id: "1",
      name: "The Pragmatic Coder",
      writer: "John Doe",
      price: "$19.99",
      date: "2026-05-12",
      status: "Completed",
    },
    {
      id: "2",
      name: "Designing Systems",
      writer: "Jane Smith",
      price: "$24.50",
      date: "2026-06-01",
      status: "Completed",
    },
  ];
}

async function getPurchasedEbooks(email) {
  return [
    {
      id: "b1",
      title: "The Pragmatic Coder",
      cover: "https://via.placeholder.com/150",
      slug: "the-pragmatic-coder",
    },
    {
      id: "b2",
      title: "Designing Systems",
      cover: "https://via.placeholder.com/150",
      slug: "designing-systems",
    },
  ];
}

async function getBookmarks(email) {
  return [
    {
      id: "b3",
      title: "Mastering Next.js",
      cover: "https://via.placeholder.com/150",
      slug: "mastering-nextjs",
    },
    {
      id: "b4",
      title: "Prisma Deep Dive",
      cover: "https://via.placeholder.com/150",
      slug: "prisma-deep-dive",
    },
  ];
}

export default function UserDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [activeTab, setActiveTab] = useState("purchased");
  const [history, setHistory] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    let alive = true;
    const loadUserData = async () => {
      if (!user?.email) return;
      const [historyData, booksData, bookmarksData] = await Promise.all([
        getPurchaseHistory(user.email),
        getPurchasedEbooks(user.email),
        getBookmarks(user.email),
      ]);
      if (alive) {
        setHistory(historyData);
        setBooks(booksData);
        setBookmarks(bookmarksData);
      }
    };
    loadUserData();
    return () => {
      alive = false;
    };
  }, [user?.email]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        {/* Header section */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20">
              <MdDashboard className="text-xl text-sky-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                User <span className="text-sky-400">Dashboard</span>
              </h1>
              <p className="text-sm text-slate-500">
                Welcome back, {isPending ? "Reader" : user?.name || "Reader"}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-8 flex flex-wrap gap-2 border-b border-slate-800 pb-px">
          <button
            onClick={() => setActiveTab("purchased")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "purchased"
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MdMenuBook className="text-lg" />
            My Library
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "bookmarks"
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MdBookmark className="text-lg" />
            Bookmarks
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MdHistory className="text-lg" />
            Purchase History
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "profile"
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MdPerson className="text-lg" />
            Profile Management
          </button>
        </div>
        <div>
          {activeTab === "purchased" && (
            <div>
              <h2 className="mb-6 text-xl font-bold text-white">
                Purchased Ebooks
              </h2>
              {books.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  You haven't purchased any ebooks yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="group rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-all hover:border-sky-500/30"
                    >
                      <div className="aspect-3/4 overflow-hidden rounded-xl bg-slate-800 mb-3">
                        <Image
                          src={book.cover}
                          alt={book.title}
                          width={30}
                          height={30}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="line-clamp-1 font-bold text-sm text-white group-hover:text-sky-400 transition-colors">
                        {book.title}
                      </h3>
                      <Link
                        href={`/books/${book.slug}`}
                        className="mt-3 block text-center rounded-lg bg-slate-800 py-1.5 text-xs font-semibold text-slate-300 hover:bg-sky-500 hover:text-slate-950 transition-colors"
                      >
                        Read Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "bookmarks" && (
            <div>
              <h2 className="mb-6 text-xl font-bold text-white">
                Bookmarked Ebooks
              </h2>
              {bookmarks.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  You haven't bookmarked any ebooks yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {bookmarks.map((book) => (
                    <div
                      key={book.id}
                      className="group rounded-2xl border border-slate-800 bg-slate-900 p-4 transition-all hover:border-amber-500/30"
                    >
                      <div className="aspect-3/4 overflow-hidden rounded-xl bg-slate-800 mb-3">
                        <Image
                          src={book.cover}
                          alt={book.title}
                          width={30}
                          height={30}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="line-clamp-1 font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                        {book.title}
                      </h3>
                      <Link
                        href={`/books/${book.slug}`}
                        className="mt-3 block text-center rounded-lg bg-slate-800 py-1.5 text-xs font-semibold text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "history" && (
            <div>
              <h2 className="mb-6 text-xl font-bold text-white">
                Transaction Logs
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-slate-950 text-xs font-semibold uppercase text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Ebook Name</th>
                      <th className="px-6 py-4">Writer</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Purchase Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {history.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-white">
                          {item.name}
                        </td>
                        <td className="px-6 py-4">{item.writer}</td>
                        <td className="px-6 py-4 text-sky-400 font-semibold">
                          {item.price}
                        </td>
                        <td className="px-6 py-4">{item.date}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {history.length === 0 && (
                  <p className="p-6 text-center text-slate-500 text-sm">
                    No transaction records found.
                  </p>
                )}
              </div>
            </div>
          )}
          {activeTab === "profile" && (
            <div className="max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-6 text-xl font-bold text-white">
                Profile Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-slate-800/60 pb-4">
                  <div className="h-14 w-14 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                    <Image
                      src={user?.image || "https://via.placeholder.com/100"}
                      alt="Avatar"
                      width={30}
                      height={30}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {user?.name || "Reader Account"}
                    </h3>
                    <p className="text-xs text-amber-500 font-medium tracking-wider uppercase">
                      User Role
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">
                      Full Name
                    </span>
                    <div className="rounded-lg bg-slate-950 px-3 py-2 text-sm text-slate-300 border border-slate-800">
                      {user?.name || "N/A"}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">
                      Email Address
                    </span>
                    <div className="rounded-lg bg-slate-950 px-3 py-2 text-sm text-slate-300 border border-slate-800">
                      {user?.email || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
