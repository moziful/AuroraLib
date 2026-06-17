"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdHome, MdDashboard, MdBook, MdLogin, MdClose } from "react-icons/md";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const baseNavItems = [
    { href: "/", label: "Home", icon: <MdHome className="text-xl" /> },
    {
      href: "/ebooks",
      label: "Browse Ebooks",
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-black tracking-wider transition-opacity hover:opacity-90"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="text-white drop-shadow-[0_2px_10px_rgba(56,189,248,0.2)]">
            <span className="text-sky-400">Aurora</span>Lib
          </span>
        </Link>
        <div className="hidden items-center bg-slate-900/60 border border-slate-800 p-1 px-2 rounded-xl gap-3 md:flex">
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
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-xs font-black rounded-lg bg-sky-400 text-slate-950 hover:bg-[#7dd3fc] transition-all duration-200 shadow-lg shadow-sky-400/10 flex items-center gap-1.5"
            >
              <MdLogin className="text-sm" />
              <span>Start Reading</span>
            </Link>
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
              <Link
                href="/auth/signin"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 py-3 text-sm font-black text-slate-950 hover:bg-[#7dd3fc] transition-all duration-200 mt-1 shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MdLogin className="text-lg" />
                <span>Login / Register</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
