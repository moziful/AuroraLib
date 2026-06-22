"use client";

import { useEffect, useState } from "react";
import {
  MdDashboard,
  MdBook,
  MdAddCircle,
  MdBookmark,
  MdAttachMoney,
  MdPerson,
  MdEdit,
  MdDelete,
  MdTrendingUp,
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { getBooksByEmail } from "@/lib/data";

// Reusable Dashboard Sub-components
import DashboardHeader from "../Dashboards/DashboardHeader";
import DashboardTabs from "../Dashboards/DashboardTabs";
import EbookGallery from "../Dashboards/EbookGallery";
import DataTable from "../Dashboards/DataTable";
import UserProfile from "../Dashboards/UserProfile";
import AnalyticsStatCard from "./AnalyticsStatCard";

// Your custom standalone AddBookForm component exactly as you built it
import AddBookForm from "./AddBookForm";
import Image from "next/image";

// Mock data fetchers for auxiliary views
async function getSalesHistory(email) {
  return [
    {
      id: "s1",
      title: "Mastering Next.js Architecture",
      buyer: "John Doe",
      date: "2026-06-15",
      amount: "$29.00",
    },
  ];
}

async function getBookmarkedReferences(email) {
  return [
    {
      id: "b1",
      title: "Database Sharding Patterns",
      cover: "https://via.placeholder.com/150",
      slug: "database-sharding-patterns",
    },
  ];
}

export default function WriterDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Active dashboard tab state
  const [activeTab, setActiveTab] = useState("overview");
  const [books, setBooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const totalEbooks = books.length;
  const grossEarnings = sales.reduce((total, sale) => {
    const value = parseFloat(String(sale.amount || "").replace("$", ""));
    return total + (Number.isNaN(value) ? 0 : value);
  }, 0);

  const tabsConfig = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "manage", label: "Manage Ebooks", icon: MdBook },
    { id: "add-book", label: "Add Ebook", icon: MdAddCircle },
    { id: "bookmarks", label: "Bookmarks", icon: MdBookmark },
    { id: "sales", label: "Sales History", icon: MdAttachMoney },
    { id: "profile", label: "Profile Management", icon: MdPerson },
  ];

  useEffect(() => {
    let alive = true;

    const loadWriterData = async () => {
      if (!user?.email) return;

      const [writerBooks, salesData, bookmarksData] = await Promise.all([
        getBooksByEmail(user.email),
        getSalesHistory(user.email),
        getBookmarkedReferences(user.email),
      ]);

      if (alive) {
        setBooks(writerBooks || []);
        setSales(salesData || []);
        setBookmarks(bookmarksData || []);
      }
    };

    loadWriterData();
    return () => {
      alive = false;
    };
  }, [user?.email]);

  const togglePublish = (id) => {
    setBooks(
      books.map((b) =>
        b.id === id
          ? {
              ...b,
              status: b.status === "published" ? "unpublished" : "published",
            }
          : b,
      ),
    );
  };

  const deleteBook = (id) => {
    if (confirm("Are you sure you want to delete this ebook?")) {
      setBooks(books.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <DashboardHeader
          roleTitle="Writer Dashboard"
          subtitle="Manage your books, upload contributions, and monitor distribution metrics."
          icon={MdDashboard}
          iconColorClass="text-violet-400"
          bgColorClass="bg-violet-500/10"
          borderColorClass="border-violet-500/20"
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
                  <h2 className="mb-6 text-xl font-bold text-white">
                    Overview
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AnalyticsStatCard
                    title="Total Ebooks"
                    value={isPending ? "..." : totalEbooks}
                    description="Books managed on AuroraLib"
                    icon={MdBook}
                    colorClass="text-violet-400"
                  />
                  <AnalyticsStatCard
                    title="Gross Earnings"
                    value={isPending ? "..." : `$${grossEarnings.toFixed(2)}`}
                    description="Accumulated revenue details"
                    icon={MdTrendingUp}
                    colorClass="text-emerald-400"
                  />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "manage" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Your Publications
                </h2>
                <DataTable
                  headers={[
                    "Book Details",
                    "Genre",
                    "Price",
                    "Status",
                    "Actions",
                  ]}
                  data={books}
                  emptyMessage="You haven't uploaded any books yet."
                  renderRow={(book) => (
                    <tr
                      key={book.id || book.slug}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <Image
                          src={book.cover || "https://via.placeholder.com/150"}
                          alt=""
                          className="h-12 w-9 rounded object-cover bg-slate-800"
                        />
                        <span className="font-medium text-white">
                          {book.title}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {book.genre || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-violet-400 font-semibold">
                        {book.price}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${
                            book.status === "published"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {book.status || "published"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => togglePublish(book.id)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors"
                          >
                            {book.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                          </button>
                          <button
                            onClick={() => setActiveTab("add-book")}
                            className="p-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded hover:bg-violet-500 hover:text-white transition-all"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => deleteBook(book.id)}
                            className="p-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded hover:bg-rose-500 hover:text-white transition-all"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              </div>
            )}
            {activeTab === "add-book" && (
              <div className="w-full">
                <AddBookForm />
              </div>
            )}
            {activeTab === "bookmarks" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Bookmarked References
                </h2>
                <EbookGallery
                  books={bookmarks}
                  emptyMessage="No references bookmarked."
                  actionLabel="View Details"
                  hoverBorderClass="hover:border-violet-500/30"
                  btnHoverClass="hover:bg-violet-500"
                />
              </div>
            )}
            {activeTab === "sales" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Sales Logs & Distributions
                </h2>
                <DataTable
                  headers={[
                    "Ebook Title",
                    "Buyer Name",
                    "Purchase Date",
                    "Amount",
                  ]}
                  data={sales}
                  emptyMessage="No items have been purchased yet."
                  renderRow={(sale) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {sale.title}
                      </td>
                      <td className="px-6 py-4 text-slate-400">{sale.buyer}</td>
                      <td className="px-6 py-4 text-slate-400">{sale.date}</td>
                      <td className="px-6 py-4 text-emerald-400 font-semibold">
                        {sale.amount}
                      </td>
                    </tr>
                  )}
                />
              </div>
            )}
            {activeTab === "profile" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Profile Management
                </h2>
                <UserProfile user={user} role="Writer" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
