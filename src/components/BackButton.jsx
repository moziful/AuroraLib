"use client";

import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 px-5 py-3 text-sm font-bold text-slate-500 dark:text-slate-200 transition-colors hover:border-sky-400/40 hover:text-sky-300"
    >
      <FaChevronLeft />
      Go Back
    </button>
  );
}
