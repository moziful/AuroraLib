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
import OverviewLayout from "./OverviewLayout";
import {
  getPurchasedBooks,
  getBookmarkedBooks,
  getTransactionHistory,
} from "@/lib/user-actions";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function UserDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(queryTab || "overview");
  const [history, setHistory] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`);
  };

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
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const barData = Object.keys(monthlyPurchasesMap)
    .map((k) => ({
      name: k,
      value: monthlyPurchasesMap[k],
    }))
    .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

  const genreMap = {};
  books.forEach((b) => {
    const g = b.genre || "Unknown";
    genreMap[g] = (genreMap[g] || 0) + 1;
  });
  const pieData = Object.keys(genreMap).map((k) => ({
    name: k,
    value: genreMap[k],
  }));

  const handleUnbookmark = (bookId) => {
    setBookmarks((prev) => prev.filter((b) => (b._id || b.id) !== bookId));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-10 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="sticky top-[49px] z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md -mx-4 px-4 py-4 border-b border-slate-200 dark:border-slate-800 lg:static lg:bg-transparent lg:border-none lg:p-0 lg:m-0">
          <DashboardHeader
            roleTitle="User Dashboard"
            subtitle={`Welcome back, ${!mounted || isPending ? "Reader" : user?.name || "Reader"}`}
            icon={MdDashboard}
          />
          <div className="block lg:hidden">
            <DashboardTabs
              tabs={tabsConfig}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
          <div className="hidden lg:block lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] lg:self-start">
            <DashboardTabs
              tabs={tabsConfig}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
            />
          </div>

          <div className="w-full min-w-0">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                    Overview
                  </h2>
                  <OverviewLayout
                    stats={
                      <>
                        <AnalyticsStatCard
                          title="Purchased Books"
                          value={loading ? "..." : totalBooks}
                          description="Books in your library"
                          icon={MdMenuBook}
                          colorClass="text-emerald-400"
                        />
                        <AnalyticsStatCard
                          title="Bookmarks"
                          value={loading ? "..." : totalBookmarks}
                          description="Saved for later"
                          icon={MdBookmark}
                          colorClass="text-violet-400"
                        />
                        <AnalyticsStatCard
                          title="Total Spent"
                          value={loading ? "..." : `$${totalSpent.toFixed(2)}`}
                          description="Lifetime purchases"
                          icon={MdTrendingUp}
                          colorClass="text-amber-400"
                        />
                      </>
                    }
                    charts={
                      <DashboardCharts
                        title1="Monthly Purchases"
                        title2="Library by Genre"
                        barData={barData}
                        pieData={pieData}
                      />
                    }
                  />
                </div>
              </div>
            )}

            {activeTab === "purchased" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Purchased Ebooks
                </h2>
                <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
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
                      You haven&apos;t purchased any ebooks yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
                <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  <EbookGallery
                    books={bookmarks}
                    isLoading={loading}
                    emptyMessage="You haven't bookmarked any ebooks yet."
                    actionLabel="View Details"
                    hoverBorderClass="hover:border-sky-400/30"
                    btnHoverClass="hover:bg-sky-400 dark:hover:bg-sky-400"
                    onUnbookmark={handleUnbookmark}
                  />
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Transaction Logs
                </h2>
                <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  <DataTable
                    headers={[
                      "#",
                      "Ebook Name",
                      "Writer",
                      "Price",
                      "Purchase Date",
                      "Status",
                    ]}
                    data={history}
                    isLoading={loading}
                    renderRow={(item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {item.writer}
                        </td>
                        <td className="px-4 py-3 text-sky-600 dark:text-sky-400 font-semibold">
                          {item.price}
                        </td>
                        <td className="px-4 py-3">{item.date}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    )}
                    renderMobileCard={(item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm truncate flex-1">
                            {item.name}
                          </span>
                          <span className="text-sky-600 dark:text-sky-400 font-semibold text-sm ml-2">
                            {item.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-600 dark:text-slate-400">
                              {item.writer}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                              {item.status}
                            </span>
                          </div>
                          <span className="text-slate-500 dark:text-slate-500">
                            {item.date}
                          </span>
                        </div>
                      </div>
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
                <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
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
