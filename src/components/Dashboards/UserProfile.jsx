import Image from "next/image";
import { MdEmail, MdPerson, MdVerifiedUser } from "react-icons/md";

export default function UserProfile({ user, role = "Reader" }) {
  // Define fallback colors based on the dashboard role
  const roleColors = {
    User: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    Reader: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    Writer: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    Admin: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  const currentBadgeColor = roleColors[role] || roleColors.Reader;

  return (
    <div className="max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-6">
        <div className="flex items-center gap-4">
          {/* Avatar Container */}
          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shadow-inner">
            {user?.image ? (
              <Image
                src={user.image}
                alt={`${user?.name || "User"}'s avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-500">
                <MdPerson className="text-3xl" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {user?.name || "Anonymous User"}
            </h3>
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${currentBadgeColor}`}
            >
              <MdVerifiedUser className="text-sm" />
              {role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="group rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-950 p-4 transition-colors hover:border-slate-300 dark:hover:border-slate-800">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-500 mb-1">
            <MdPerson className="text-sm" /> Full Name
          </span>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">
            {user?.name || "Not provided"}
          </div>
        </div>

        <div className="group rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-100 dark:bg-slate-950 p-4 transition-colors hover:border-slate-300 dark:hover:border-slate-800">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-500 mb-1">
            <MdEmail className="text-sm" /> Email Address
          </span>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">
            {user?.email || "Not provided"}
          </div>
        </div>
      </div>
    </div>
  );
}
