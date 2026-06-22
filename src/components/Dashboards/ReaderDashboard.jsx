"use client";

import { useEffect, useState } from "react";
import {
  MdHistory,
  MdMenuBook,
  MdBookmark,
  MdPerson,
  MdDashboard,
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";

import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import EbookGallery from "./EbookGallery";
import DataTable from "./DataTable";
import UserProfile from "./UserProfile";

export default function UserDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState("purchased");
  const [history, setHistory] = useState([]);
  const [books, setBooks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const tabsConfig = [
    { id: "purchased", label: "My Library", icon: MdMenuBook },
    { id: "bookmarks", label: "Bookmarks", icon: MdBookmark },
    { id: "history", label: "Purchase History", icon: MdHistory },
    { id: "profile", label: "Profile Management", icon: MdPerson },
  ];

  useEffect(() => {
    /* Fetch data logic as before */
  }, [user?.email]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <DashboardHeader
          roleTitle="User Dashboard"
          subtitle={`Welcome back, ${isPending ? "Reader" : user?.name || "Reader"}`}
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

          <div className="min-w-0">
            {activeTab === "purchased" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Purchased Ebooks
                </h2>
                <EbookGallery
                  books={books}
                  emptyMessage="You haven't purchased any ebooks yet."
                  actionLabel="Read Details"
                />
              </div>
            )}

            {activeTab === "bookmarks" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Bookmarked Ebooks
                </h2>
                <EbookGallery
                  books={bookmarks}
                  emptyMessage="You haven't bookmarked any ebooks yet."
                  actionLabel="View Details"
                  hoverBorderClass="hover:border-amber-500/30"
                  btnHoverClass="hover:bg-amber-500"
                />
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Transaction Logs
                </h2>
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
                  )}
                />
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h2 className="mb-6 text-xl font-bold text-white">
                  Profile Management
                </h2>
                <UserProfile user={user} role="User" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
