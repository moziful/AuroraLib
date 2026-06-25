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
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";

import DashboardHeader from "../Dashboards/DashboardHeader";
import DashboardTabs from "../Dashboards/DashboardTabs";
import DataTable from "../Dashboards/DataTable";
import AnalyticsStatCard from "./AnalyticsStatCard";
import DashboardCharts from "./DashboardCharts";
import Modal from "./Modal";
import Image from "next/image";

import { getAllBooks } from "@/lib/data";
import AddBookForm from "./AddBookForm";
import {
  deleteBookAction,
  updateBookStatus,
  updateUserDetails,
} from "@/lib/actions";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

async function getAdminOverviewData() {
  const realBooks = await getAllBooks();
  return {
    ebooks: realBooks,
    transactions: [
      {
        id: "TX-9901",
        type: "publishing fee",
        email: "nathan@auroralib.com",
        amount: "$10.00",
        date: "2026-06-18",
      },
      {
        id: "TX-9902",
        type: "purchase",
        email: "alice@example.com",
        amount: "$24.99",
        date: "2026-06-20",
      },
    ],
  };
}

export default function AdminDashboard() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState("overview"); // overview | users | ebooks | transactions | add-book
  const [editingBookData, setEditingBookData] = useState(null);
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

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
    { id: "add-book", label: "Add Ebook", icon: MdAddCircle },
  ];

  useEffect(() => {
    let active = true;
    getAdminOverviewData().then((data) => {
      if (active) {
        setEbooks(data.ebooks);
        setTransactions(data.transactions);
      }
    });

    authClient.admin
      .listUsers({ query: { limit: 100 } })
      .then((res) => {
        if (active && res?.data?.users) {
          setUsers(res.data.users);
        }
      })
      .catch((err) => console.error("Failed to fetch users:", err));

    return () => {
      active = false;
    };
  }, []);

  // Reuse writer's edit handling for books
  const handleEditClick = (book) => {
    setEditingBookData(book);
    setActiveTab("add-book");
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
          }
          setConfirmConfig({ ...confirmConfig, isOpen: false });
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
        try {
          await authClient.admin.removeUser({ userId: id });
          setUsers(users.filter((u) => u.id !== id));
          toast.success("User deleted successfully!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete user.");
        }
        setConfirmConfig({ ...confirmConfig, isOpen: false });
      },
    });
  };

  // Helper to get auth token for privileged actions
  async function fetchAuthToken() {
    const res = await fetch("/api/auth/token");
    if (!res.ok) throw new Error("Failed to retrieve auth token. Are you signed in?");
    const data = await res.json();
    if (!data.success || !data.token) throw new Error(data.message || "No token returned.");
    return data.token;
  }

  const toggleBookPublish = async (book) => {
    // Normalize status to lower‑case for consistent checks
    const isAvailable = book.status === "Available";
    // Toggle between Available and Unavailable
    const newStatus = isAvailable ? "Unavailable" : "Available";

    setConfirmConfig({
      isOpen: true,
      title: "Change Status",
      message: `Are you sure you want to mark this book as ${newStatus}?`,
      onConfirm: async () => {
        try {
          const token = await fetchAuthToken();
          const bookId = book._id || book.id || book.slug;
          await updateBookStatus(bookId, newStatus, token);
          // Update local state with the normalized status using the same identifier logic
          setEbooks(
            ebooks.map((b) =>
              (b._id || b.id || b.slug) === bookId ? { ...b, status: newStatus } : b,
            ),
          );
          toast.success(`Book marked as ${newStatus}.`);
        } catch (e) {
          toast.error(`Failed to update status: ${e.message}`);
        }
        setConfirmConfig({ ...confirmConfig, isOpen: false });
      },
    });
  };

  // Delete book with authentication token
  const deleteBook = async (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Ebook",
      message: "Are you sure you want to delete this ebook from the platform?",
      onConfirm: async () => {
        try {
          const token = await fetchAuthToken();
          await deleteBookAction(id, token);
          setEbooks(ebooks.filter((b) => b.id !== id));
          toast.success("Book deleted successfully!");
        } catch (e) {
          toast.error(`Failed to delete book: ${e.message}`);
        }
        setConfirmConfig({ ...confirmConfig, isOpen: false });
      },
    });
  };
  const totalAccounts = users.length;
  const totalReadersCount = users.filter(
    (u) => u.role === "reader" || u.role === "User",
  ).length;
  const totalWritersCount = users.filter(
    (u) => u.role === "writer" || u.role === "Writer",
  ).length;
  const totalAdminsCount = users.filter(
    (u) => u.role === "admin" || u.role === "Admin",
  ).length;

  const totalBooksCount = ebooks.length;
  const publishedBooksCount = ebooks.filter(
    (b) => b.status === "published" || b.status === "Available",
  ).length;
  const unpublishedBooksCount = ebooks.filter(
    (b) => b.status === "unpublished" || b.status === "Unavailable",
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
  const barData = Object.keys(monthlySalesMap).map((k) => ({
    name: k,
    value: monthlySalesMap[k],
  }));

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
      <ToastContainer position="bottom-right" theme="dark" />
      <div className="mx-auto max-w-7xl">
        <DashboardHeader
          roleTitle="Admin Control Room"
          subtitle="Site configuration metrics, role assignments, platform audit logs, and catalog verification."
          icon={MdShield}
          iconColorClass="text-rose-400"
          bgColorClass="bg-rose-500/10"
          borderColorClass="border-rose-500/20"
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
                  <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      <AnalyticsStatCard
                        title="Total Accounts"
                        value={totalAccounts}
                        description="All registered accounts"
                        icon={MdPeople}
                        colorClass="text-slate-400"
                      />
                      <AnalyticsStatCard
                        title="Readers"
                        value={totalReadersCount}
                        description="Active reader accounts"
                        icon={MdPeople}
                        colorClass="text-sky-400"
                      />
                      <AnalyticsStatCard
                        title="Writers"
                        value={totalWritersCount}
                        description="Approved creators"
                        icon={MdPerson}
                        colorClass="text-violet-400"
                      />
                      <AnalyticsStatCard
                        title="Admins"
                        value={totalAdminsCount}
                        description="System administrators"
                        icon={MdShield}
                        colorClass="text-rose-400"
                      />
                      <AnalyticsStatCard
                        title="Total Books"
                        value={totalBooksCount}
                        description="Entire system catalog"
                        icon={MdBook}
                        colorClass="text-fuchsia-400"
                      />
                      <AnalyticsStatCard
                        title="Ebooks Sold"
                        value={totalEbooksSold}
                        description="Total purchase transactions"
                        icon={MdReceipt}
                        colorClass="text-amber-400"
                      />
                      <AnalyticsStatCard
                        title="Published Books"
                        value={publishedBooksCount}
                        description="Currently available"
                        icon={MdToggleOn}
                        colorClass="text-emerald-400"
                      />
                      <AnalyticsStatCard
                        title="Unpublished Books"
                        value={unpublishedBooksCount}
                        description="Hidden from catalog"
                        icon={MdToggleOff}
                        colorClass="text-slate-500"
                      />
                      <AnalyticsStatCard
                        title="Total Revenue"
                        value={`$${totalRevenueVal.toFixed(2)}`}
                        description="Aggregated systems revenue"
                        icon={MdTrendingUp}
                        colorClass="text-emerald-400"
                      />
                    </div>

                    <div className="mt-8">
                      <DashboardCharts
                        title1="Platform Revenue"
                        title2="Ebooks by Status"
                        barData={barData}
                        pieData={pieData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "users" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Manage System Accounts
                </h2>
                <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <DataTable
                    headers={[
                      "Name",
                      "Email Address",
                      "Current Role",
                      "Actions",
                    ]}
                    data={users}
                    emptyMessage="No registered users found."
                    renderRow={(u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {u.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-slate-100 dark:bg-slate-950 text-xs font-semibold text-slate-900 dark:text-slate-300 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-1.5">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
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
                      </tr>
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
                <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <DataTable
                    headers={[
                      "#",
                      "Book Details",
                      "Writer",
                      "Genre",
                      "Price",
                      "Status",
                      "Actions",
                    ]}
                    data={ebooks}
                    emptyMessage="No ebooks available in the system."
                    renderRow={(book, index) => (
                      <tr
                        key={book._id || book.id || book.slug}
                        className="hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 flex items-center gap-3">
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
                          <span className="font-medium text-slate-900 dark:text-white max-w-[150px] truncate">
                            {book.title}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {book.writerName}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {book.genre || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-violet-600 dark:text-violet-400 font-semibold">
                          ${book.price}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${book.status === "Available" ||
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
                          <div className="flex gap-2">
                            <button type="button"
                              onClick={() => toggleBookPublish(book)}
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
                              onClick={() => deleteBook(book.id || book._id)}
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
                <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] pb-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <DataTable
                    headers={[
                      "Transaction ID",
                      "Type",
                      "Email Address",
                      "Amount",
                      "Execution Date",
                    ]}
                    data={transactions}
                    emptyMessage="No transaction entries recorded."
                    renderRow={(tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-slate-300">
                          {tx.id}
                        </td>
                        <td className="px-6 py-4 uppercase text-xs tracking-wider">
                          <span
                            className={`px-2 py-0.5 rounded border ${tx.type === "purchase"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                              }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{tx.email}</td>
                        <td className="px-6 py-4 text-emerald-400 font-bold">
                          {tx.amount}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{tx.date}</td>
                      </tr>
                    )}
                  />
                </div>
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
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={confirmConfig.onConfirm}
              className="px-4 py-2 text-sm font-bold bg-sky-500 text-white rounded-lg hover:bg-sky-400 transition-colors"
            >
              Confirm
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-300">{confirmConfig.message}</p>
      </Modal>
    </div>
  );
}
