import Link from "next/link";
import { MdAdd, MdMenuBook, MdDashboard } from "react-icons/md";

export default function WriterDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20">
              <MdDashboard className="text-xl text-sky-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                Writer <span className="text-sky-400">Dashboard</span>
              </h1>
              <p className="text-sm text-slate-500">
                Manage your books and contributions
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/writer/add-book"
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:border-sky-500/40 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-sky-500/5"
          >
            <div className="absolute inset-0 bg-linear-to-br from-sky-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 transition-colors group-hover:bg-sky-500/20">
                <MdAdd className="text-2xl text-sky-400" />
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                Add New Book
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload a new book with cover image, description, and PDF link.
              </p>
            </div>
          </Link>
          <Link
            href="/books"
            className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:border-violet-500/40 hover:bg-slate-900/80 hover:shadow-lg hover:shadow-violet-500/5"
          >
            <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 transition-colors group-hover:bg-violet-500/20">
                <MdMenuBook className="text-2xl text-violet-400" />
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                Browse All Books
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View the full collection of books on AuroraLib.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
