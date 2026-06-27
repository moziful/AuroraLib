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
  MdPublic,
  MdVisibilityOff,
  MdSchedule,
  MdMenuBook,
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { getBooksByEmail, getWriterSales } from "@/lib/data";
import { deleteBookAction, updateBookStatus } from "@/lib/actions";
import { getPurchasedBooks, getBookmarkedBooks } from "@/lib/user-actions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImSpinner2 } from "react-icons/im";
import LibraryBookCard from "./LibraryBookCard";

// Reusable Dashboard Sub-components
import DashboardHeader from "../Dashboards/DashboardHeader";
import DashboardTabs from "../Dashboards/DashboardTabs";
import EbookGallery from "../Dashboards/EbookGallery";
import DataTable from "../Dashboards/DataTable";
import UserProfile from "../Dashboards/UserProfile";
import AnalyticsStatCard from "./AnalyticsStatCard";
import DashboardCharts from "./DashboardCharts";
import OverviewLayout from "./OverviewLayout";
import ManageEbooksTable from "./ManageEbooksTable";
import Modal from "./Modal";

import AddBookForm from "./AddBookForm";
import Image from "next/image";

async function fetchAuthToken() {
  const res = await fetch("/api/auth/token");
  if (!res.ok)
    throw new Error("Failed to retrieve auth token. Are you signed in?");
  const data = await res.json();
  if (!data.success || !data.token)
    throw new Error(data.message || "No token returned.");
  return data.token;
}

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function WriterDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(queryTab || "overview");
  const [books, setBooks] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState({});
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [editingBookData, setEditingBookData] = useState(null);

  // Generic Confirm Modal
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const totalEbooks = books.length;
  const publishedBooks = books.filter((b) => b.status === "Available" || b.status === "published").length;
  const unpublishedBooks = books.filter(
    (b) => b.status === "Unavailable"
  ).length;
  const upcomingBooks = books.filter((b) => b.status === "Coming Soon").length;

  const grossEarnings = sales.reduce((total, sale) => {
    const value = parseFloat(String(sale.amount || "").replace("$", ""));
    return total + (Number.isNaN(value) ? 0 : value);
  }, 0);

  const monthlySalesMap = {};
  sales.forEach((s) => {
    if (!s.date) return;
    const month = new Date(s.date).toLocaleString("default", {
      month: "short",
    });
    const val = parseFloat(String(s.amount || "").replace("$", "")) || 0;
    monthlySalesMap[month] = (monthlySalesMap[month] || 0) + val;
  });
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const barData = Object.keys(monthlySalesMap)
    .map((k) => ({
      name: k,
      value: monthlySalesMap[k],
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

  const tabsConfig = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "manage", label: "Manage Ebooks", icon: MdBook },
    { id: "purchased", label: "My Library", icon: MdMenuBook },
    { id: "add-book", label: "Add Ebook", icon: MdAddCircle },
    { id: "bookmarks", label: "Bookmarks", icon: MdBookmark },
    { id: "sales", label: "Sales History", icon: MdAttachMoney },
    { id: "profile", label: "Profile Management", icon: MdPerson },
  ];

  const fetchWriterBooks = async () => {
    if (user?.email) {
      const writerBooks = await getBooksByEmail(user.email);
      setBooks(writerBooks || []);
    }
  };

  useEffect(() => {
    let alive = true;

    const loadWriterData = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const [writerBooks, salesData, bookmarksData, purchasedData] = await Promise.all([
          getBooksByEmail(user.email),
          getWriterSales(user.email),
          getBookmarkedBooks(user.email),
          getPurchasedBooks(user.email),
        ]);

        if (alive) {
          setBooks(writerBooks || []);
          setSales(salesData || []);
          setBookmarks(bookmarksData || []);
          setPurchasedBooks(purchasedData || []);
        }
      } catch (err) {
        console.error("Failed to load writer data:", err);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    loadWriterData();
    return () => {
      alive = false;
    };
  }, [user?.email]);

  const handleUnbookmark = (bookId) => {
    setBookmarks((prev) => prev.filter((b) => (b._id || b.id) !== bookId));
  };

  const handleEditClick = (book) => {
    setEditingBookData(book);
    setActiveTab("add-book");
  };

  const toggleBookPublish = async (book) => {
    const isAvailable = book.status === "Available" || book.status === "published";
    const newStatus = isAvailable ? "Unavailable" : "Available";
    const bookId = book._id || book.id || book.slug;

    setConfirmConfig({
      isOpen: true,
      title: "Change Status",
      message: `Are you sure you want to mark this book as ${newStatus}?`,
      onConfirm: async () => {
        setIsModalLoading(true);
        setActionLoading((prev) => ({ ...prev, [bookId]: "publishing" }));
        try {
          const token = await fetchAuthToken();
          await updateBookStatus(bookId, newStatus, token);
          setBooks(
            books.map((b) =>
              (b._id || b.id || b.slug) === bookId ? { ...b, status: newStatus } : b,
            ),
          );
          toast.success(`Book marked as ${newStatus} successfully!`);
        } catch (e) {
          toast.error(`Failed to update book: ${e.message}`);
        } finally {
          setActionLoading((prev) => ({ ...prev, [bookId]: null }));
          setIsModalLoading(false);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const deleteBook = async (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Ebook",
      message: "Are you sure you want to delete this ebook from the platform?",
      onConfirm: async () => {
        setIsModalLoading(true);
        setActionLoading((prev) => ({ ...prev, [id]: "deleting" }));
        try {
          const token = await fetchAuthToken();
          await deleteBookAction(id, token);
          setBooks(books.filter((b) => (b.id || b._id) !== id));
          toast.success("Book deleted successfully!");
        } catch (e) {
          toast.error(`Failed to delete book: ${e.message}`);
        } finally {
          setActionLoading((prev) => ({ ...prev, [id]: null }));
          setIsModalLoading(false);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleTabChange = (tabId) => {
    if (tabId !== "add-book") {
      setEditingBookData(null);
    }
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-10 text-slate-900 dark:text-slate-100">
        <div className="mx-auto max-w-7xl">
          <div className="sticky top-[49px] z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md -mx-4 px-4 py-4 border-b border-slate-200 dark:border-slate-800 lg:static lg:bg-transparent lg:border-none lg:p-0 lg:m-0">
            <DashboardHeader
              roleTitle="Writer Dashboard"
              subtitle="Manage your books, upload contributions, and monitor distribution metrics."
              icon={MdDashboard}
              iconColorClass="text-violet-400"
              bgColorClass="bg-violet-500/10"
              borderColorClass="border-violet-500/20"
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
                            title="Total Ebooks"
                            value={loading ? "..." : totalEbooks}
                            description="Books managed on AuroraLib"
                            icon={MdBook}
                            colorClass="text-violet-400"
                          />
                          <AnalyticsStatCard
                            title="Published"
                            value={loading ? "..." : publishedBooks}
                            description="Currently available"
                            icon={MdPublic}
                            colorClass="text-emerald-400"
                          />
                          <AnalyticsStatCard
                            title="Upcoming"
                            value={loading ? "..." : upcomingBooks}
                            description="Coming soon"
                            icon={MdSchedule}
                            colorClass="text-sky-400"
                          />
                          <AnalyticsStatCard
                            title="Unpublished"
                            value={loading ? "..." : unpublishedBooks}
                            description="Currently unavailable"
                            icon={MdVisibilityOff}
                            colorClass="text-rose-400"
                          />
                          <AnalyticsStatCard
                            title="Gross Earnings"
                            value={loading ? "..." : `$${grossEarnings.toFixed(2)}`}
                            description="Accumulated revenue details"
                            icon={MdTrendingUp}
                            colorClass="text-amber-400"
                          />
                          <AnalyticsStatCard
                            title="Books Owned"
                            value={loading ? "..." : purchasedBooks.length}
                            description="Books in your library"
                            icon={MdMenuBook}
                            colorClass="text-sky-400"
                          />
                          <AnalyticsStatCard
                            title="Bookmarks"
                            value={loading ? "..." : bookmarks.length}
                            description="Ebooks you saved for later"
                            icon={MdBookmark}
                            colorClass="text-sky-400"
                          />
                        </>
                      }
                      charts={
                        <DashboardCharts
                          title1="Monthly Sales Volume"
                          title2="Ebooks by Genre"
                          barData={barData}
                          pieData={pieData}
                        />
                      }
                    />
                  </div>
                </div>
              )}
              {activeTab === "manage" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                    Your Publications
                  </h2>
                  <ManageEbooksTable
                    books={books}
                    isLoading={loading}
                    emptyMessage="You haven't uploaded any books yet."
                    actionLoading={actionLoading}
                    toggleBookPublish={toggleBookPublish}
                    handleEditClick={handleEditClick}
                    deleteBook={deleteBook}
                    showWriter={false}
                  />
                </div>
              )}
              {activeTab === "purchased" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                    My Library
                  </h2>
                  <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                    {purchasedBooks.length === 0 ? (
                      <p className="text-slate-600 dark:text-slate-500 text-sm">
                        You haven&apos;t purchased any ebooks yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {purchasedBooks.map((book) => (
                          <LibraryBookCard key={book._id} book={book} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "add-book" && (
                <div className="w-full">
                  <AddBookForm
                    initialData={editingBookData}
                    onSuccess={() => {
                      fetchWriterBooks();
                      setActiveTab("manage");
                    }}
                  />
                </div>
              )}
              {activeTab === "bookmarks" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                    Bookmarked References
                  </h2>
                  <EbookGallery
                    books={bookmarks}
                    isLoading={loading}
                    emptyMessage="No references bookmarked."
                    actionLabel="View Details"
                    hoverBorderClass="hover:border-violet-500/30"
                    btnHoverClass="hover:bg-violet-500"
                    onUnbookmark={handleUnbookmark}
                  />
                </div>
              )}
              {activeTab === "sales" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                    Sales Logs & Distributions
                  </h2>
                  <DataTable
                    headers={[
                      "#",
                      "Ebook Title",
                      "Buyer Name",
                      "Purchase Date",
                      "Amount",
                    ]}
                    data={sales}
                    isLoading={loading}
                    emptyMessage="No items have been purchased yet."
                    renderRow={(sale, index) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                          {sale.title}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {sale.buyer}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {sale.date}
                        </td>
                        <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                          {sale.amount}
                        </td>
                      </tr>
                    )}
                    renderMobileCard={(sale) => (
                      <div
                        key={sale.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm truncate flex-1">
                            {sale.title}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm ml-2">
                            {sale.amount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">
                            {sale.buyer}
                          </span>
                          <span className="text-slate-500 dark:text-slate-500">
                            {sale.date}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}
              {activeTab === "profile" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                    Profile Management
                  </h2>
                  <UserProfile user={user} role="Writer" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        actions={
          <>
            <button
              onClick={() =>
                setConfirmConfig({ ...confirmConfig, isOpen: false })
              }
              disabled={isModalLoading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmConfig.onConfirm}
              disabled={isModalLoading}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors disabled:opacity-50 ${
                confirmConfig.title?.toLowerCase().includes("delete")
                  ? "bg-rose-600 hover:bg-rose-500"
                  : "bg-sky-500 hover:bg-sky-400"
              }`}
            >
              {isModalLoading && (
                <ImSpinner2 className="animate-spin text-xs" />
              )}
              Confirm
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {confirmConfig.message}
        </p>
      </Modal>
    </>
  );
}
