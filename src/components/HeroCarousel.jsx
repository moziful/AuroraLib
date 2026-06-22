"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { booksdata } from "@/lib/data";
import { FaArrowRight } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const slides = booksdata.slice(0, 6).map((book) => ({
  ...book,
  subtitle: book.description,
}));

function SlideDots({ active, count, onChange }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange(index)}
          className={`h-3 w-3 rounded-full border cursor-pointer transition-all duration-300 ${
            index === active
              ? "scale-110 border-sky-400 bg-sky-400"
              : "border-sky-400/45 bg-transparent hover:border-sky-400 hover:bg-sky-400/20"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

function HeroButton({ href, variant = "primary", children }) {
  const base =
    "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-[10px] lg:text-sm font-black transition-colors";
  const styles =
    variant === "primary"
      ? "bg-sky-400 text-slate-950 hover:bg-sky-300"
      : "border border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-400/30 hover:text-sky-300";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

function BookCard({ book, active = false }) {
  return (
    <article
      className={`h-full rounded-xl border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-md transition-all duration-700 ${
        active ? "scale-100 opacity-100" : "scale-[0.96] opacity-75"
      }`}
    >
      <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950">
        <div className="relative h-60 sm:h-72 lg:h-90 w-full">
          <Image
            src={book.coverImage || "/placeholder-cover.png"}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={active}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/5 to-transparent" />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
              {book.genre}
            </span>
            <span className="text-sm font-black text-white">
              $ {book.price.toFixed(2)}
            </span>
          </div>

          <h2 className="mt-4 text-xl font-black leading-tight text-white line-clamp-1">
            {book.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300 line-clamp-2">
            {book.subtitle}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
            <span className="truncate">{book.writerName}</span>
            <span className="shrink-0 flex items-center">
              <span
                className={`text-2xl mb-0.75 mr-1 ${
                  book.status === "Available"
                    ? "text-green-400"
                    : book.status === "Unavailable"
                      ? "text-red-400"
                      : "text-orange-400"
                }`}
              >
                &bull;
              </span>
              <span>{book.status}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function StackCarousel({ slides, active, direction }) {
  const visibleCards = useMemo(() => {
    const total = slides.length;
    return [
      {
        id: (active - 2 + total) % total,
        position: "far-prev",
        style: { x: "-210%", scale: 0.75, zIndex: 5, opacity: 0 },
      },
      {
        id: (active - 1 + total) % total,
        position: "prev",
        style: { x: "-105%", scale: 0.88, zIndex: 10, opacity: 0.6 },
      },
      {
        id: active,
        position: "active",
        style: { x: "0%", scale: 1, zIndex: 30, opacity: 1 },
      },
      {
        id: (active + 1) % total,
        position: "next",
        style: { x: "105%", scale: 0.88, zIndex: 10, opacity: 0.6 },
      },
      {
        id: (active + 2) % total,
        position: "far-next",
        style: { x: "210%", scale: 0.75, zIndex: 5, opacity: 0 },
      },
    ];
  }, [active, slides.length]);

  return (
    <div className="relative h-132 sm:h-146 lg:h-164 w-full flex items-center justify-center overflow-hidden mask-[linear-gradient(to_right,transparent_0%,white_15%,white_85%,transparent_100%)]">
      <AnimatePresence initial={false} custom={direction}>
        {visibleCards.map((card) => (
          <motion.div
            key={`infinite-slide-${card.id}`}
            custom={direction}
            initial={(dir) => ({
              x: dir > 0 ? "210%" : "-210%",
              scale: 0.8,
              opacity: 0,
            })}
            animate={{
              x: card.style.x,
              scale: card.style.scale,
              zIndex: card.style.zIndex,
              opacity: card.style.opacity,
            }}
            exit={(dir) => ({
              x: dir > 0 ? "-210%" : "210%",
              scale: 0.8,
              opacity: 0,
            })}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 30,
              opacity: { duration: 0.25 },
            }}
            className="absolute w-66 sm:w-76 lg:w-88"
          >
            <BookCard
              book={slides[card.id]}
              active={card.position === "active"}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [[page, direction], setPage] = useState([0, 1]);

  const prevActiveRef = useRef(active);

  const handlePageChange = (newIndex) => {
    let dir = 1;
    if (newIndex !== prevActiveRef.current) {
      const total = slides.length;
      const diff = newIndex - prevActiveRef.current;
      if (Math.abs(diff) > total / 2) {
        dir = diff > 0 ? -1 : 1;
      } else {
        dir = diff > 0 ? 1 : -1;
      }
    }

    prevActiveRef.current = newIndex;
    setPage([newIndex, dir]);
    setActive(newIndex);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextIndex = (active + 1) % slides.length;
      handlePageChange(nextIndex);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [active]);

  const current = slides[active];

  return (
    <section className="relative overflow-hidden bg-slate-950 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_34%)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[72px_72px]" />

      <div className="relative mx-auto flex flex-col-reverse lg:grid min-h-[calc(100vh-8rem)] max-w-7xl gap-10 lg:grid-cols-[0.4fr_0.6fr] lg:items-center">
        {" "}
        <div className="w-full text-center lg:text-left lg:max-w-xl lg:pr-6">
          <p className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-[10px] lg:text-xs font-black uppercase tracking-[0.25em] text-sky-300">
            Lighten your heart by reading books.
          </p>
          <h1 className="mt-6  text-2xl font-black leading-tight text-white sm:text-4xl lg:text-6xl">
            Discover & Read Original Ebooks
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
            Explore curated literature masterpieces handpicked by our librarians
            for readers chasing dynamic modern stories.
          </p>

          <div className="my-8 flex justify-center lg:justify-start items-center gap-3">
            <HeroButton href="/books" variant="primary">
              Browse Ebooks
              <FaArrowRight />
            </HeroButton>
            <HeroButton href="/dashboard" variant="secondary">
              <MdDashboard />
              View Dashboard
            </HeroButton>
          </div>
        </div>
        <div className="relative w-full">
          <div className="absolute inset-0 rounded-4xl bg-sky-500/10 blur-3xl" />
          <div className="relative">
            <StackCarousel
              slides={slides}
              active={active}
              direction={direction}
            />
          </div>
          {/* <div className="relative z-40 flex flex-col items-center gap-4">
            <SlideDots
              active={active}
              count={slides.length}
              onChange={handlePageChange}
            />
          </div> */}
        </div>
      </div>
    </section>
  );
}
