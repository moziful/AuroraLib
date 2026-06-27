import Image from "next/image";
import Link from "next/link";
import { MdHome } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-16 flex items-center justify-center">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 text-center">
        <div className="relative rounded-2xl bg-slate-900/50 border border-slate-800 shadow-2xl backdrop-blur-sm">
          <Image
            src="/not-found-image.png"
            width={350}
            height={350}
            alt="Page not found illustration"
            className="h-auto w-60 sm:w-72 md:w-80 rounded-xl object-contain drop-shadow-md"
          />
        </div>

        <div className="max-w-2xl space-y-3">
          <h1 className="text-4xl font-black text-white md:text-5xl tracking-tight">
            Page Not Found
          </h1>
          <p className="text-base leading-7 text-slate-400 md:text-lg">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Let&apos;s get you back to the home page.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-sky-300 hover:scale-105 active:scale-95 shadow-lg shadow-sky-400/20"
        >
          <MdHome className="text-lg" />
          Go Home
        </Link>
      </div>
    </div>
  );
}

