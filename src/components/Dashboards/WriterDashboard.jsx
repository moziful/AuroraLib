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
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { getBooksByEmail, getWriterSales } from "@/lib/data";
import { deleteBookAction, updateBookStatus } from "@/lib/actions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImSpinner2 } from "react-icons/im";

// Reusable Dashboard Sub-components
import DashboardHeader from "../Dashboards/DashboardHeader";
import DashboardTabs from "../Dashboards/DashboardTabs";
import EbookGallery from "../Dashboards/EbookGallery";
import DataTable from "../Dashboards/DataTable";
import UserProfile from "../Dashboards/UserProfile";
import AnalyticsStatCard from "./AnalyticsStatCard";
import DashboardCharts from "./DashboardCharts";
import Modal from "./Modal";

import AddBookForm from "./AddBookForm";
import Image from "next/image";

async function getBookmarkedReferences(email) {
  return [
    {
      id: "b1",
      title: "Database Sharding Patterns",
      cover: "/not-found-image.png",
      slug: "database-sharding-patterns",
    },
  ];
}

async function fetchAuthToken() {
  const res = await fetch("/api/auth/token");
  if (!res.ok)
    throw new Error("Failed to retrieve auth token. Are you signed in?");
  const data = await res.json();
  if (!data.success || !data.token)
    throw new Error(data.message || "No token returned.");
  return data.token;
}

export default function WriterDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState("overview");
  const [books, setBooks] = useState([]);
  const [sales, setSales] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

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
  const barData = Object.keys(monthlySalesMap).map((k) => ({
    name: k,
    value: monthlySalesMap[k],
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

  const tabsConfig = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "manage", label: "Manage Ebooks", icon: MdBook },
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

      const [writerBooks, salesData, bookmarksData] = await Promise.all([
        getBooksByEmail(user.email),
        getWriterSales(user.email),
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
              (b._id || b.id || b.slug) === bookId
                ? { ...b, status: newStatus }
                : b
            )
          );
          toast.success(`Book marked as ${newStatus}.`);
        } catch (e) {
          toast.error(`Failed to update status: ${e.message}`);
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
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
      />
      <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-10 text-slate-900 dark:text-slate-100">
        <div className="mx-auto max-w-7xl">
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
                    <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <AnalyticsStatCard
                          title="Total Ebooks"
                          value={totalEbooks}
                          description="Books managed on AuroraLib"
                          icon={MdBook}
                          colorClass="text-violet-400"
                        />
                        <AnalyticsStatCard
                          title="Published"
                          value={publishedBooks}
                          description="Currently available"
                          icon={MdPublic}
                          colorClass="text-emerald-400"
                        />
                        <AnalyticsStatCard
                          title="Upcoming"
                          value={upcomingBooks}
                          description="Coming soon"
                          icon={MdSchedule}
                          colorClass="text-sky-400"
                        />
                        <AnalyticsStatCard
                          title="Unpublished"
                          value={unpublishedBooks}
                          description="Currently unavailable"
                          icon={MdVisibilityOff}
                          colorClass="text-rose-400"
                        />
                        <AnalyticsStatCard
                          title="Gross Earnings"
                          value={`$${grossEarnings.toFixed(2)}`}
                          description="Accumulated revenue details"
                          icon={MdTrendingUp}
                          colorClass="text-amber-400"
                        />
                      </div>

                      <div className="mt-8">
                        <DashboardCharts
                          title1="Monthly Sales Volume"
                          title2="Ebooks by Genre"
                          barData={barData}
                          pieData={pieData}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "manage" && (
                <div>
                  <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                    Your Publications
                  </h2>
                  <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                    <DataTable
                      headers={[
                        "#",
                        "Book Details",
                        "Genre",
                        "Price",
                        "Status",
                        "Actions",
                      ]}
                      data={books}
                      emptyMessage="You haven't uploaded any books yet."
                      renderRow={(book, index) => (
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
                                src={
                                  book.coverImage ||
                                  book.cover ||
                                  "/not-found-image.png"
                                }
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white max-w-37 truncate">
                              {book.title}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                            {book.genre || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-violet-600 dark:text-violet-400 font-semibold">
                            ${book.price}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${
                                book.status === "Available" || book.status === "published"
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
                                  actionLoading[book._id || book.id] ===
                                    "publishing" ||
                                  actionLoading[book._id || book.id] ===
                                    "deleting"
                                }
                                className="inline-flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors disabled:opacity-50"
                              >
                                {actionLoading[book._id || book.id] ===
                                  "publishing" && (
                                  <ImSpinner2 className="animate-spin text-xs" />
                                )}
                                {book.status === "Available" || book.status === "published"
                                  ? "Unpublish"
                                  : "Publish"}
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
                                  actionLoading[book._id || book.id] ===
                                    "publishing" ||
                                  actionLoading[book._id || book.id] ===
                                    "deleting"
                                }
                                className="p-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                              >
                                {actionLoading[book._id || book.id] ===
                                "deleting" ? (
                                  <ImSpinner2 className="animate-spin text-sm" />
                                ) : (
                                  <MdDelete />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                      renderMobileCard={(book) => (
                        <div
                          key={book._id || book.id || book.slug}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
                              <Image
                                src={
                                  book.coverImage ||
                                  book.cover ||
                                  "/not-found-image.png"
                                }
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                                {book.title}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                  {book.genre || "N/A"}
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border ${
                                    book.status === "Available" || book.status === "published"
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
                                actionLoading[book._id || book.id] ===
                                "publishing"
                              }
                              className="flex-1 text-xs py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {book.status === "Available" || book.status === "published"
                                ? "Unpublish"
                                : "Publish"}
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
                                actionLoading[book._id || book.id] === "deleting"
                              }
                              className="text-xs py-2 px-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                            >
                              <MdDelete className="inline" />
                            </button>
                          </div>
                        </div>
                      )}
                    />
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
                    emptyMessage="No references bookmarked."
                    actionLabel="View Details"
                    hoverBorderClass="hover:border-violet-500/30"
                    btnHoverClass="hover:bg-violet-500"
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
                        className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors"
                      >
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
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-sky-500 text-white rounded-lg hover:bg-sky-400 transition-colors disabled:opacity-50"
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
