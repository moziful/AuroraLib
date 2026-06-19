"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  MdHome,
  MdDashboard,
  MdBook,
  MdLogin,
  MdClose,
  MdLogout,
} from "react-icons/md";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut();
    window.location.href = "/";
  };

  const baseNavItems = [
    { href: "/", label: "Home", icon: <MdHome className="text-xl" /> },
    {
      href: "/books",
      label: "Browse Books",
      icon: <MdBook className="text-xl" />,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <MdDashboard className="text-xl" />,
    },
  ];

  const linkClass = (href) => `
    px-3 py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-2 border
    ${
      pathname.startsWith(href) && (href !== "/" || pathname === "/")
        ? "bg-slate-900 text-sky-400 border-sky-400/20 shadow-md shadow-sky-400/5"
        : "border-transparent text-slate-400 hover:text-sky-300"
    }
  `;

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  const AuthSection = () => {
    if (isPending) {
      return <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-800" />;
    }
    if (user) {
      return (
        <div className="flex items-center gap-2">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-400/30"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/20 ring-2 ring-sky-400/30">
              <span className="text-xs font-black text-sky-400">
                {getInitials(user.name)}
              </span>
            </div>
          )}
          <span className="max-w-25 truncate text-xs font-bold text-slate-200">
            {/* {user.name?.split(" ")[0]} */}
            {user.name}
          </span>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="ml-1 flex items-center gap-2 rounded-lg border-2 border-slate-700 px-2 py-2 text-xs font-bold text-slate-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            {signingOut ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            ) : (
              <MdLogout className="text-sm" />
            )}
          </button>
        </div>
      );
    }

    return (
      <Link
        href="/auth/signin"
        className="px-4 mx-1 py-2 text-xs font-black rounded-lg bg-sky-400 text-slate-950 hover:bg-[#7dd3fc] transition-all duration-200 shadow-lg shadow-sky-400/10 flex items-center gap-2"
      >
        <MdLogin className="text-sm" />
        <span>Start Reading</span>
      </Link>
    );
  };
  const MobileAuthSection = () => {
    if (isPending) {
      return (
        <div className="h-12 w-full animate-pulse rounded-xl bg-slate-800" />
      );
    }

    if (user) {
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-400/30"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-400/20 ring-2 ring-sky-400/30">
                <span className="text-xs font-black text-sky-400">
                  {getInitials(user.name)}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-200">
                {user.name}
              </p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2 text-sm font-black text-red-400 transition-all duration-200 hover:bg-red-500/20 disabled:opacity-50"
          >
            {signingOut ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
            ) : (
              <MdLogout className="text-lg" />
            )}
            Sign Out
          </button>
        </div>
      );
    }

    return (
      <Link
        href="/auth/signin"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 py-3 text-sm font-black text-slate-950 hover:bg-[#7dd3fc] transition-all duration-200 mt-1 shadow-md"
        onClick={() => setMobileMenuOpen(false)}
      >
        <MdLogin className="text-lg" />
        <span>Start Reading</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950 px-4 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-black tracking-wider transition-opacity hover:opacity-90"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="AuroraLib Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-sm object-cover"
            />
            <span>
              <span className="text-white drop-shadow-[0_2px_10px_rgba(56,189,248,0.2)]">
                <span className="text-sky-400">Aurora</span>Lib
              </span>
            </span>
          </div>
        </Link>
        <div className="hidden items-center bg-slate-900/60 border border-slate-800 p-1 rounded-xl gap-3 md:flex">
          <div className="flex items-center gap-1">
            {baseNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={linkClass(item.href)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div className="flex items-center">
            <AuthSection />
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-900 md:hidden transition-colors border border-transparent hover:border-slate-800"
          aria-label="Toggle Navigation Drawer"
        >
          {mobileMenuOpen ? (
            <MdClose className="text-2xl" />
          ) : (
            <GiHamburgerMenu className="text-2xl" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute left-0 right-0 top-full border-b border-slate-800 bg-slate-950 px-4 py-6 shadow-2xl md:hidden z-50"
          >
            <div className="flex flex-col gap-3 bg-slate-900 border border-slate-800 p-2 rounded-xl">
              {baseNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${linkClass(item.href)} w-full py-3`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              <MobileAuthSection />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
