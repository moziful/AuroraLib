"use client";

import { useEffect, useState } from "react";
import {
  MdShield,
  MdHome,
  MdPeople,
  MdBook,
  MdReceipt,
  MdToggleOn,
  MdToggleOff,
  MdDelete,
  MdTrendingUp,
  MdPerson,
  MdEdit,
  MdAddCircle,
  MdMenuBook,
  MdBookmark,
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import { ImSpinner2 } from "react-icons/im";

import DashboardHeader from "../Dashboards/DashboardHeader";
import DashboardTabs from "../Dashboards/DashboardTabs";
import DataTable from "../Dashboards/DataTable";
import { motion } from "framer-motion";
import UserProfile from "./UserProfile";
import AnalyticsStatCard from "./AnalyticsStatCard";
import DashboardCharts from "./DashboardCharts";
import OverviewLayout from "./OverviewLayout";
import Modal from "./Modal";
import Image from "next/image";

import EbookGallery from "./EbookGallery";
import LibraryBookCard from "./LibraryBookCard";
import ManageEbooksTable from "./ManageEbooksTable";
import RoleBadge from "../RoleBadge";
import { getPurchasedBooks, getBookmarkedBooks } from "@/lib/user-actions";

// Make sure to export getAllTransactions from your data file
import { getAllBooks, getAllTransactions } from "@/lib/data";
import AddBookForm from "./AddBookForm";
import {
  deleteBookAction,
  updateBookStatus,
  updateUserDetails,
} from "@/lib/actions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Updated to fetch dynamic transaction data
async function getAdminOverviewData() {
  const [realBooks, realTransactions] = await Promise.all([
    getAllBooks(),
    getAllTransactions(),
  ]);

  return {
    ebooks: realBooks || [],
    transactions: realTransactions || [],
  };
}

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(queryTab || "overview");
  const [editingBookData, setEditingBookData] = useState(null);
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Admin personal library states
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [bookmarkedBooks, setBookmarkedBooks] = useState([]);
  const [personalLoading, setPersonalLoading] = useState(true);

  // Modal states for User Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "reader",
  });

  // Generic Confirm Modal
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const tabsConfig = [
    { id: "overview", label: "Overview", icon: MdHome },
    { id: "users", label: "Manage Users", icon: MdPeople },
    { id: "ebooks", label: "Manage All Ebooks", icon: MdBook },
    { id: "transactions", label: "View All Transactions", icon: MdReceipt },
    { id: "purchased", label: "My Library", icon: MdMenuBook },
    { id: "bookmarks", label: "Bookmarks", icon: MdBookmark },
    { id: "add-book", label: "Add Ebook", icon: MdAddCircle },
    { id: "profile", label: "Profile Management", icon: MdPerson },
  ];

  useEffect(() => {
    let active = true;

    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [overviewData, usersRes] = await Promise.all([
          getAdminOverviewData(),
          authClient.admin.listUsers({ query: { limit: 100 } }).catch((err) => {
            console.error("Failed to fetch users:", err);
            return { data: { users: [] } };
          }),
        ]);

        if (active) {
          setEbooks(overviewData.ebooks || []);
          setTransactions(overviewData.transactions || []);
          if (usersRes?.data?.users) {
            setUsers(usersRes.data.users);
          }
        }
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAdminData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (queryTab) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  useEffect(() => {
    if (user?.email) {
      setPersonalLoading(true);
      const fetchPersonalData = async () => {
        try {
          const [purchased, bookmarked] = await Promise.all([
            getPurchasedBooks(user.email),
            getBookmarkedBooks(user.email),
          ]);
          setPurchasedBooks(purchased);
          setBookmarkedBooks(bookmarked);
        } catch (err) {
          console.error("Failed to fetch admin personal library data:", err);
        } finally {
          setPersonalLoading(false);
        }
      };
      fetchPersonalData();
    }
  }, [user?.email]);

  const handleTabChange = (tabId) => {
    if (tabId !== "add-book") {
      setEditingBookData(null);
    }
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleEditClick = (book) => {
    setEditingBookData(book);
    handleTabChange("add-book");
  };

  const handleOpenEditModal = (user) => {
    setSelectedUserForEdit(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = () => {
    if (selectedUserForEdit) {
      setConfirmConfig({
        isOpen: true,
        title: "Confirm Edit",
        message: `Are you sure you want to save changes to ${selectedUserForEdit.name}?`,
        onConfirm: async () => {
          setIsModalLoading(true);
          try {
            await authClient.admin.setRole({
              userId: selectedUserForEdit.id,
              role: editForm.role,
            });
            await updateUserDetails(selectedUserForEdit.id, {
              name: editForm.name,
              email: editForm.email,
            });
            setUsers(
              users.map((u) =>
                u.id === selectedUserForEdit.id
                  ? {
                    ...u,
                    role: editForm.role,
                    name: editForm.name,
                    email: editForm.email,
                  }
                  : u,
              ),
            );
            setIsEditModalOpen(false);
            setSelectedUserForEdit(null);
            toast.success("User profile updated successfully!");
          } catch (err) {
            console.error(err);
            toast.error("Failed to update user.");
          } finally {
            setIsModalLoading(false);
            setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
          }
        },
      });
    }
  };

  const deleteUser = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete User",
      message: "Are you sure you want to permanently delete this user profile?",
      onConfirm: async () => {
        setIsModalLoading(true);
        try {
          await authClient.admin.removeUser({ userId: id });
          setUsers(users.filter((u) => u.id !== id));
          toast.success("User deleted successfully!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete user.");
        } finally {
          setIsModalLoading(false);
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  async function fetchAuthToken() {
    const res = await fetch("/api/auth/token");
    if (!res.ok)
      throw new Error("Failed to retrieve auth token. Are you signed in?");
    const data = await res.json();
    if (!data.success || !data.token)
      throw new Error(data.message || "No token returned.");
    return data.token;
  }

  const toggleBookPublish = async (book) => {
    const isAvailable = book.status === "Available";
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
          setEbooks(
            ebooks.map((b) =>
              (b._id || b.id || b.slug) === bookId
                ? { ...b, status: newStatus }
                : b,
            ),
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
          setEbooks(ebooks.filter((b) => (b.id || b._id) !== id));
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

  const handleUnbookmark = (bookId) => {
    setBookmarkedBooks((prev) => prev.filter((b) => (b._id || b.id) !== bookId));
  };

  const totalAccounts = users.length;
  const totalReadersCount = users.filter(
    (u) => u.role === "reader" || u.role === "user" || u.role === "User",
  ).length;
  const totalWritersCount = users.filter(
    (u) => u.role === "writer" || u.role === "Writer",
  ).length;
  const totalAdminsCount = users.filter(
    (u) => u.role === "admin" || u.role === "Admin",
  ).length;

  const totalBooksCount = ebooks.length;
  const publishedBooksCount = ebooks.filter(
    (b) => b.status === "Available",
  ).length;
  const unpublishedBooksCount = ebooks.filter(
    (b) => b.status === "Unavailable",
  ).length;

  const totalEbooksSold = transactions.filter(
    (t) => t.type === "purchase",
  ).length;
  const totalRevenueVal = transactions.reduce(
    (acc, t) => acc + parseFloat(String(t.amount || "").replace("$", "") || 0),
    0,
  );

  const monthlySalesMap = {};
  transactions.forEach((t) => {
    if (!t.date || t.type !== "purchase") return;
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });
    const val = parseFloat(String(t.amount || "").replace("$", "")) || 0;
    monthlySalesMap[month] = (monthlySalesMap[month] || 0) + val;
  });
  const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const barData = Object.keys(monthlySalesMap)
    .map((k) => ({
      name: k,
      value: monthlySalesMap[k],
    }))
    .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

  const statusMap = {};
  ebooks.forEach((b) => {
    const s = b.status || "Unknown";
    statusMap[s] = (statusMap[s] || 0) + 1;
  });
  const pieData = Object.keys(statusMap).map((k) => ({
    name: k,
    value: statusMap[k],
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-10 text-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="sticky top-[49px] z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md -mx-4 px-4 py-4 border-b border-slate-200 dark:border-slate-800 lg:static lg:bg-transparent lg:border-none lg:p-0 lg:m-0">
          <DashboardHeader
            roleTitle="Admin Control Room"
            subtitle="Site configuration metrics, role assignments, platform audit logs, and catalog verification."
            icon={MdShield}
            iconColorClass="text-rose-400"
            bgColorClass="bg-rose-500/10"
            borderColorClass="border-rose-500/20"
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
                          title="Total Accounts"
                          value={loading ? "..." : totalAccounts}
                          description="All registered accounts"
                          icon={MdPeople}
                          colorClass="text-slate-400"
                        />
                        <AnalyticsStatCard
                          title="Readers"
                          value={loading ? "..." : totalReadersCount}
                          description="Active reader accounts"
                          icon={MdPeople}
                          colorClass="text-sky-400"
                        />
                        <AnalyticsStatCard
                          title="Writers"
                          value={loading ? "..." : totalWritersCount}
                          description="Approved creators"
                          icon={MdPerson}
                          colorClass="text-violet-400"
                        />
                        <AnalyticsStatCard
                          title="Admins"
                          value={loading ? "..." : totalAdminsCount}
                          description="System administrators"
                          icon={MdShield}
                          colorClass="text-rose-400"
                        />
                        <AnalyticsStatCard
                          title="Total Books"
                          value={loading ? "..." : totalBooksCount}
                          description="Entire system catalog"
                          icon={MdBook}
                          colorClass="text-fuchsia-400"
                        />
                        <AnalyticsStatCard
                          title="Ebooks Sold"
                          value={loading ? "..." : totalEbooksSold}
                          description="Total purchase transactions"
                          icon={MdReceipt}
                          colorClass="text-amber-400"
                        />
                        <AnalyticsStatCard
                          title="Published Books"
                          value={loading ? "..." : publishedBooksCount}
                          description="Currently available"
                          icon={MdToggleOn}
                          colorClass="text-emerald-400"
                        />
                        <AnalyticsStatCard
                          title="Unpublished Books"
                          value={loading ? "..." : unpublishedBooksCount}
                          description="Hidden from catalog"
                          icon={MdToggleOff}
                          colorClass="text-slate-500"
                        />
                        <AnalyticsStatCard
                          title="Total Revenue"
                          value={loading ? "..." : `$${totalRevenueVal.toFixed(2)}`}
                          description="Aggregated systems revenue"
                          icon={MdTrendingUp}
                          colorClass="text-emerald-400"
                        />
                        <AnalyticsStatCard
                          title="Books Owned"
                          value={personalLoading ? "..." : purchasedBooks.length}
                          description="Books in your library"
                          icon={MdMenuBook}
                          colorClass="text-sky-400"
                        />
                        <AnalyticsStatCard
                          title="Bookmarks"
                          value={personalLoading ? "..." : bookmarkedBooks.length}
                          description="Ebooks you saved for later"
                          icon={MdBookmark}
                          colorClass="text-sky-400"
                        />
                      </>
                    }
                    charts={
                      <DashboardCharts
                        title1="Platform Revenue"
                        title2="Ebooks by Status"
                        barData={barData}
                        pieData={pieData}
                      />
                    }
                  />
                </div>
              </div>
            )}
            {activeTab === "users" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Manage System Accounts
                </h2>
                <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  <DataTable
                    headers={[
                      "#",
                      "Name",
                      "Email Address",
                      "Current Role",
                      "Actions",
                    ]}
                    data={users}
                    isLoading={loading}
                    emptyMessage="No registered users found."
                    renderRow={(u, index) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, type: "spring", stiffness: 100, damping: 15 }}
                        key={u.id}
                        className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                          {u.name}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 whitespace-nowrap max-w-30 truncate">
                          {u.email}
                        </td>
                        <td className="px-4 py-3">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenEditModal(u)}
                              className="p-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-md hover:bg-sky-500 hover:text-white transition-all"
                            >
                              <MdEdit />
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-md hover:bg-rose-500 hover:text-white transition-all"
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                    renderMobileCard={(u) => (
                      <div
                        key={u.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">
                            {u.name}
                          </span>
                          <RoleBadge role={u.role} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {u.email}
                        </p>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="flex-1 text-xs py-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg hover:bg-sky-500 hover:text-white transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="flex-1 text-xs py-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            )}
            {activeTab === "ebooks" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Manage Global Catalog
                </h2>
                <ManageEbooksTable
                  books={ebooks}
                  isLoading={loading}
                  emptyMessage="No ebooks available in the system."
                  actionLoading={actionLoading}
                  toggleBookPublish={toggleBookPublish}
                  handleEditClick={handleEditClick}
                  deleteBook={deleteBook}
                  showWriter={true}
                />
              </div>
            )}
            {activeTab === "add-book" && (
              <div className="pb-10">
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  {editingBookData ? "Edit Ebook" : "Add New Ebook"}
                </h2>
                <AddBookForm
                  initialData={editingBookData}
                  onSuccess={() => {
                    setEditingBookData(null);
                    setActiveTab("ebooks");
                  }}
                />
              </div>
            )}
            {activeTab === "transactions" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Platform Audit Ledger
                </h2>
                <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  <DataTable
                    headers={[
                      "#",
                      "Transaction ID",
                      "Type",
                      "Email Address",
                      "Amount",
                      "Execution Date",
                    ]}
                    data={transactions}
                    isLoading={loading}
                    emptyMessage="Looks like there are no transactions yet. Once users start interacting with the platform, records will populate here."
                    renderRow={(tx, index) => (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, type: "spring", stiffness: 100, damping: 15 }}
                        key={tx.id}
                        className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                          {tx.id || tx._id}
                        </td>
                        <td className="px-4 py-3 uppercase tracking-wider">
                          <span
                            className={`px-2 py-0.5 rounded border ${tx.type === "purchase"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {tx.email}
                        </td>
                        <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">
                          {tx.amount}
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-500">
                          {tx.date}
                        </td>
                      </motion.tr>
                    )}
                    renderMobileCard={(tx) => (
                      <div
                        key={tx.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium border uppercase ${tx.type === "purchase"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              }`}
                          >
                            {tx.type || "purchase"}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                            {tx.amount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400 truncate flex-1">
                            {tx.email}
                          </span>
                          <span className="text-slate-500 dark:text-slate-500 ml-2">
                            {tx.date}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            )}
            {activeTab === "purchased" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Purchased Ebooks (My Library)
                </h2>
                <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  {personalLoading ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-4 h-80"
                        />
                      ))}
                    </div>
                  ) : purchasedBooks.length === 0 ? (
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
            {activeTab === "bookmarks" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Bookmarked Ebooks
                </h2>
                <div className="lg:overflow-y-auto lg:overflow-x-hidden lg:max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
                  <EbookGallery
                    books={bookmarkedBooks}
                    isLoading={personalLoading}
                    emptyMessage="You haven't bookmarked any ebooks yet."
                    actionLabel="View Details"
                    hoverBorderClass="hover:border-sky-400/30"
                    btnHoverClass="hover:bg-sky-400 dark:hover:bg-sky-400"
                    onUnbookmark={handleUnbookmark}
                  />
                </div>
              </div>
            )}
            {activeTab === "profile" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Profile Management
                </h2>
                <UserProfile user={user} role="Admin" />
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        title="Edit User Profile"
        actions={
          <>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveUser}
              className="px-4 py-2 text-sm font-bold bg-sky-500 text-white rounded-lg hover:bg-sky-400 transition-colors"
            >
              Save
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="w-full bg-white dark:bg-slate-950 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              className="w-full bg-white dark:bg-slate-950 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">
              Role
            </label>
            <select
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value })
              }
              className="w-full bg-white dark:bg-slate-950 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30"
            >
              <option value="reader">User (Reader)</option>
              <option value="writer">Writer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </Modal>

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
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-colors disabled:opacity-50 ${confirmConfig.title?.toLowerCase().includes("delete")
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
    </div>
  );
}
