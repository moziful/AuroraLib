"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

const socialLinks = [
  { href: "#", label: "Facebook", icon: FaFacebookF },
  { href: "#", label: "X", icon: FaXTwitter },
  { href: "#", label: "Instagram", icon: FaInstagram },
  { href: "#", label: "LinkedIn", icon: FaLinkedinIn },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-4 py-10 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <h2 className="text-lg font-black text-white">
            <span className="text-sky-400">Aurora</span>Lib
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            A calm place to discover, read, and keep track of your favorite
            books.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-300 transition-colors hover:text-sky-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Follow
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Follow AuroraLib on your favourite social media to get updates.
          </p>
          <div className="mt-4 flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 transition-colors hover:border-sky-400/30 hover:text-sky-300"
                >
                  <Icon className="text-sm" />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Newsletter
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Subscribe newsletter to get update about new features, offers and
            promotions.
          </p>
          <form className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-sky-400/40"
            />
            <button
              type="submit"
              disabled
              className="cursor-not-allowed rounded-xl bg-sky-400 px-4 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-sky-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-slate-800 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} AuroraLib. All rights reserved.</p>
        <p>Made for readers, writers, and everyone in between.</p>
      </div>
    </footer>
  );
}
