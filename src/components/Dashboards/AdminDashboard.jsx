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
  MdWriters,
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";

import DashboardHeader from "../Dashboards/DashboardHeader";
import DashboardTabs from "../Dashboards/DashboardTabs";
import DataTable from "../Dashboards/DataTable";
import AnalyticsStatCard from "./AnalyticsStatCard";
import DashboardCharts from "./DashboardCharts";

async function getAdminOverviewData() {
  return {
    users: [
      {
        id: "u1",
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "User",
      },
      {
        id: "u2",
        name: "Nathan Clarke",
        email: "nathan@auroralib.com",
        role: "Writer",
      },
      {
        id: "u3",
        name: "Marcus Aurelius",
        email: "marcus@admin.com",
        role: "Admin",
      },
    ],
    ebooks: [
      {
        id: "b1",
        title: "The Quantum Enigma",
        writerName: "Nathan Clarke",
        price: "$24.99",
        status: "published",
      },
      {
        id: "b2",
        title: "Next.js Production Guide",
        writerName: "John Doe",
        price: "$19.00",
        status: "unpublished",
      },
    ],
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

  const [activeTab, setActiveTab] = useState("home"); // home | users | ebooks | transactions
  const [users, setUsers] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const tabsConfig = [
    { id: "home", label: "Dashboard Home", icon: MdHome },
    { id: "users", label: "Manage Users", icon: MdPeople },
    { id: "ebooks", label: "Manage All Ebooks", icon: MdBook },
    { id: "transactions", label: "View All Transactions", icon: MdReceipt },
  ];

  useEffect(() => {
    let active = true;
    getAdminOverviewData().then((data) => {
      if (active) {
        setUsers(data.users);
        setEbooks(data.ebooks);
        setTransactions(data.transactions);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const changeUserRole = (id, newRole) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
  };

  const deleteUser = (id) => {
    if (
      confirm("Are you sure you want to permanently delete this user profile?")
    ) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const toggleBookPublish = (id) => {
    setEbooks(
      ebooks.map((b) =>
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
    if (
      confirm("Are you sure you want to delete this ebook from the platform?")
    ) {
      setEbooks(ebooks.filter((b) => b.id !== id));
    }
  };
  const totalUsersCount = users.filter((u) => u.role === "User").length;
  const totalWritersCount = users.filter((u) => u.role === "Writer").length;
  const totalEbooksSold = transactions.filter(
    (t) => t.type === "purchase",
  ).length;
  const totalRevenueVal = transactions.reduce(
    (acc, t) => acc + parseFloat(t.amount.replace("$", "")),
    0,
  );

  const monthlySalesMap = {};
  transactions.forEach((t) => {
    if (!t.date || t.type !== "purchase") return;
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    const val = parseFloat(String(t.amount || "").replace("$", "")) || 0;
    monthlySalesMap[month] = (monthlySalesMap[month] || 0) + val;
  });
  const barData = Object.keys(monthlySalesMap).map(k => ({ name: k, value: monthlySalesMap[k] }));

  const statusMap = {};
  ebooks.forEach((b) => {
    const s = b.status || "Unknown";
    statusMap[s] = (statusMap[s] || 0) + 1;
  });
  const pieData = Object.keys(statusMap).map(k => ({ name: k, value: statusMap[k] }));

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
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
            {activeTab === "home" && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <AnalyticsStatCard
                    title="Total Users"
                    value={sessionLoading ? "..." : totalUsersCount}
                    description="Active reader accounts"
                    icon={MdPeople}
                    colorClass="text-sky-400"
                  />
                  <AnalyticsStatCard
                    title="Total Writers"
                    value={totalWritersCount}
                    description="Approved platform creators"
                    icon={MdPeople}
                    colorClass="text-violet-400"
                  />
                  <AnalyticsStatCard
                    title="Ebooks Sold"
                    value={totalEbooksSold}
                    description="Successful volume purchases"
                    icon={MdBook}
                    colorClass="text-amber-400"
                  />
                  <AnalyticsStatCard
                    title="Total Revenue"
                    value={`$${totalRevenueVal.toFixed(2)}`}
                    description="Aggregated systems revenue"
                    icon={MdTrendingUp}
                    colorClass="text-emerald-400"
                  />
                </div>

                <DashboardCharts 
                  title1="Platform Revenue"
                  title2="Ebooks by Status"
                  barData={barData}
                  pieData={pieData}
                />
              </div>
            )}
            {activeTab === "users" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Manage System Accounts
                </h2>
                <DataTable
                  headers={["Name", "Email Address", "Current Role", "Actions"]}
                  data={users}
                  emptyMessage="No registered users found."
                  renderRow={(u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => changeUserRole(u.id, e.target.value)}
                          className="bg-slate-950 text-xs font-semibold text-slate-300 border border-slate-800 rounded-lg px-2 py-1 focus:outline-none focus:border-rose-500"
                        >
                          <option value="User">User</option>
                          <option value="Writer">Writer</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="p-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-md hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  )}
                />
              </div>
            )}
            {activeTab === "ebooks" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Manage Global Catalog
                </h2>
                <DataTable
                  headers={["Book Title", "Writer", "Price", "Status", "Actions"]}
                  data={ebooks}
                  emptyMessage="No ebooks available in the system."
                  renderRow={(book) => (
                    <tr
                      key={book.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        {book.title}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {book.writerName}
                      </td>
                      <td className="px-6 py-4 text-rose-400 font-semibold">
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
                          {book.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleBookPublish(book.id)}
                            className="text-slate-400 hover:text-white text-xl p-1 transition-colors"
                          >
                            {book.status === "published" ? (
                              <MdToggleOn className="text-emerald-400 text-2xl" />
                            ) : (
                              <MdToggleOff className="text-slate-600 text-2xl" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteBook(book.id)}
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
            )}
            {activeTab === "transactions" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Platform Audit Ledger
                </h2>
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
                          className={`px-2 py-0.5 rounded border ${
                            tx.type === "purchase"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
