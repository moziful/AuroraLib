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
import { getBooksByEmail } from "@/lib/data";
import { deleteBookAction, updateBookStatus } from "@/lib/actions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // Modals state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [bookToStatus, setBookToStatus] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [editingBookData, setEditingBookData] = useState(null);

  const totalEbooks = books.length;
  const publishedBooks = books.filter(
    (b) => b.status === "Available" || b.status === "published",
  ).length;
  const unpublishedBooks = books.filter(
    (b) => b.status === "Unavailable" || b.status === "unpublished",
  ).length;
  const upcomingBooks = books.filter(
    (b) => b.status === "Coming Soon" || b.status === "upcoming",
  ).length;

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

  const handleEditClick = (book) => {
    setEditingBookData(book);
    setActiveTab("add-book");
  };

  // Delete Actions
  const promptDeleteBook = (book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  const confirmDeleteBook = async () => {
    if (!bookToDelete) return;
    setIsDeleting(true);
    try {
      const token = await fetchAuthToken();
      await deleteBookAction(bookToDelete._id, token);
      toast.success("Book deleted successfully.");
      setDeleteModalOpen(false);
      setBookToDelete(null);
      await fetchWriterBooks();
    } catch (err) {
      toast.error("Failed to delete book: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const promptStatusChange = (book) => {
    setBookToStatus(book);
    if (book.status === "Coming Soon") {
      setSelectedStatus("Available"); // default choice
    } else {
      setSelectedStatus(
        book.status === "Available" ? "Unavailable" : "Available",
      );
    }
    setStatusModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!bookToStatus || !selectedStatus) return;
    setIsUpdatingStatus(true);
    try {
      const token = await fetchAuthToken();
      await updateBookStatus(bookToStatus._id, selectedStatus, token);
      toast.success("Book status updated successfully.");
      setStatusModalOpen(false);
      setBookToStatus(null);
      setSelectedStatus("");
      await fetchWriterBooks();
    } catch (err) {
      toast.error("Failed to update status: " + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
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
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastClassName="!bg-slate-800 !text-slate-100 !border !border-slate-700"
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
                    <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="relative h-12 w-9 overflow-hidden rounded-xl bg-slate-800 shrink-0">
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
                          <span className="font-medium text-slate-900 dark:text-white max-w-[150px] truncate">
                            {book.title}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {book.genre || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-violet-400 font-semibold">
                          ${book.price}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${
                              book.status === "Available" ||
                              book.status === "published"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : book.status === "Coming Soon"
                                  ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {book.status || "Available"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => promptStatusChange(book)}
                              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition-colors"
                            >
                              {book.status === "Available"
                                ? "Unpublish"
                                : book.status === "Unavailable"
                                  ? "Publish"
                                  : "Set Status"}
                            </button>
                            <button
                              onClick={() => handleEditClick(book)}
                              className="p-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded hover:bg-violet-500 hover:text-white transition-all"
                            >
                              <MdEdit />
                            </button>
                            <button
                              onClick={() => promptDeleteBook(book)}
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
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {sale.title}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {sale.buyer}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {sale.date}
                        </td>
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
        isOpen={deleteModalOpen && bookToDelete}
        title="Delete Ebook"
        actions={
          <>
            <button
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteBook}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Are you sure you want to delete{" "}
          <span className="text-sky-400 font-semibold">
            "{bookToDelete?.title}"
          </span>
          ? This action cannot be undone.
        </p>
      </Modal>
      <Modal
        isOpen={statusModalOpen && bookToStatus}
        title="Change Status"
        actions={
          <>
            <button
              onClick={() => setStatusModalOpen(false)}
              disabled={isUpdatingStatus}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmStatusChange}
              disabled={isUpdatingStatus}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30 hover:bg-sky-500 hover:text-white transition-colors disabled:opacity-50"
            >
              {isUpdatingStatus ? "Updating..." : "Confirm"}
            </button>
          </>
        }
      >
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          Update the status for{" "}
          <span className="text-sky-400 font-semibold">
            "{bookToStatus?.title}"
          </span>
          .
        </p>

        <div className="space-y-3">
          {bookToStatus?.status === "Coming Soon" ? (
            <>
              <p className="text-xs text-amber-400 mb-2">
                Warning: Once changed from 'Coming Soon', it cannot be reverted
                back to 'Coming Soon'.
              </p>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Available"
                  checked={selectedStatus === "Available"}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="accent-sky-400"
                />
                Available
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="Unavailable"
                  checked={selectedStatus === "Unavailable"}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="accent-sky-400"
                />
                Unavailable
              </label>
            </>
          ) : (
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Are you sure you want to make this book{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedStatus}
              </span>
              ?
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
