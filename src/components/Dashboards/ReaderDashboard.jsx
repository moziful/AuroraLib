"use client";

import { useEffect, useState } from "react";
import {
  MdHistory,
  MdMenuBook,
  MdBookmark,
  MdPerson,
  MdDashboard,
  MdTrendingUp,
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";

import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import EbookGallery from "./EbookGallery";
import DataTable from "./DataTable";
import UserProfile from "./UserProfile";
import AnalyticsStatCard from "./AnalyticsStatCard";
import DashboardCharts from "./DashboardCharts";
import LibraryBookCard from "./LibraryBookCard";
import {
  getPurchasedBooks,
  getBookmarkedBooks,
  getTransactionHistory,
} from "@/lib/user-actions";

export default function UserDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState("overview");
  const [history, setHistory] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const tabsConfig = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "purchased", label: "My Library", icon: MdMenuBook },
    { id: "bookmarks", label: "Bookmarks", icon: MdBookmark },
    { id: "history", label: "Purchase History", icon: MdHistory },
    { id: "profile", label: "Profile Management", icon: MdPerson },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const [purchased, bookmarked, txHistory] = await Promise.all([
            getPurchasedBooks(user.email),
            getBookmarkedBooks(user.email),
            getTransactionHistory(user.email),
          ]);
          setBooks(purchased);
          setBookmarks(bookmarked);
          setHistory(txHistory);
        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user?.email]);

  const totalBooks = books.length;
  const totalBookmarks = bookmarks.length;
  const totalSpent = history.reduce(
    (sum, item) =>
      sum + parseFloat(String(item.price || "").replace("$", "") || 0),
    0,
  );

  const monthlyPurchasesMap = {};
  history.forEach((h) => {
    if (!h.date) return;
    const month = new Date(h.date).toLocaleString("default", {
      month: "short",
    });
    const val = parseFloat(String(h.price || "").replace("$", "")) || 0;
    monthlyPurchasesMap[month] = (monthlyPurchasesMap[month] || 0) + val;
  });
  const barData = Object.keys(monthlyPurchasesMap).map((k) => ({
    name: k,
    value: monthlyPurchasesMap[k],
  }));

  const genreMap = {};
  books.forEach((b) => {
    const g = b.genre || "Unknown";
    genreMap[g] = (genreMap[g] || 0) + 1;
  });
  const pieData = Object.keys(genreMap).map((k) => ({
    name: k,
    value: genreMap[k],
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-10 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader
          roleTitle="User Dashboard"
          subtitle={`Welcome back, ${(!mounted || isPending) ? "Reader" : user?.name || "Reader"}`}
          icon={MdDashboard}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:self-start">
            <DashboardTabs
              tabs={tabsConfig}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className="w-full min-w-0">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                    Overview
                  </h2>
                  <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <AnalyticsStatCard
                        title="Purchased Books"
                        value={totalBooks}
                        description="Books in your library"
                        icon={MdMenuBook}
                        colorClass="text-emerald-400"
                      />
                      <AnalyticsStatCard
                        title="Bookmarks"
                        value={totalBookmarks}
                        description="Saved for later"
                        icon={MdBookmark}
                        colorClass="text-violet-400"
                      />
                      <AnalyticsStatCard
                        title="Total Spent"
                        value={`$${totalSpent.toFixed(2)}`}
                        description="Lifetime purchases"
                        icon={MdTrendingUp}
                        colorClass="text-amber-400"
                      />
                    </div>
                    <div className="mt-8">
                      <DashboardCharts
                        title1="Monthly Purchases"
                        title2="Library by Genre"
                        barData={barData}
                        pieData={pieData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "purchased" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Purchased Ebooks
                </h2>
                <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  {loading ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-4 h-80"
                        />
                      ))}
                    </div>
                  ) : books.length === 0 ? (
                    <p className="text-slate-600 dark:text-slate-500 text-sm">
                      You haven't purchased any ebooks yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {books.map((book) => (
                        <LibraryBookCard key={book._id} book={book} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "bookmarks" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Bookmarked Ebooks
                </h2>
                <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  <EbookGallery
                    books={bookmarks}
                    emptyMessage="You haven't bookmarked any ebooks yet."
                    actionLabel="View Details"
                    hoverBorderClass="hover:border-sky-400/30"
                    btnHoverClass="hover:bg-sky-400 dark:hover:bg-sky-400"
                  />
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Transaction Logs
                </h2>
                <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  <DataTable
                    headers={[
                      "Ebook Name",
                      "Writer",
                      "Price",
                      "Purchase Date",
                      "Status",
                    ]}
                    data={history}
                    renderRow={(item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {item.writer}
                        </td>
                        <td className="px-6 py-4 text-sky-600 dark:text-sky-400 font-semibold">
                          {item.price}
                        </td>
                        <td className="px-6 py-4">{item.date}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    )}
                  />
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Profile Management
                </h2>
                <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  <UserProfile user={user} role="User" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
