import Image from "next/image";
import Link from "next/link";
import { MdHome } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-10 text-center">
        <Image
          src="/not-found-image.png"
          width={300}
          height={300}
          alt="Page not found illustration"
          className="h-auto w-60 sm:w-72 md:w-80 border-2 border-dashed border-white rounded-xl"
        />

        <div className="max-w-2xl">
          <h1 className="text-4xl font-black text-white md:text-5xl">
            Page Not Found
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-400 md:text-lg">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Let&apos;s get you back to the home page.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-sky-300"
        >
          <MdHome className="text-base" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
