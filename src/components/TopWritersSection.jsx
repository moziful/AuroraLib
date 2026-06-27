import { getAllBooks } from "@/lib/data";
import SectionHeader from "@/components/SectionHeader";
import WritersGrid from "@/components/WritersGrid";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const rankConfig = [
  {
    place: "1st",
    emoji: "🥇",
    banner: "from-red-500/30 via-red-400/20 to-transparent",
    bannerLine: "from-red-400 to-red-600",
    ring: "ring-red-400/60",
    glow: "hover:shadow-red-500/20",
    genrePill: "bg-red-400/10 text-red-300 border-red-400/20",
    statIcon: "text-red-400",
    divider: "via-red-400/30",
  },
  {
    place: "2nd",
    emoji: "🥈",
    banner: "from-orange-500/30 via-orange-400/20 to-transparent",
    bannerLine: "from-orange-400 to-orange-600",
    ring: "ring-orange-400/60",
    glow: "hover:shadow-orange-500/20",
    genrePill: "bg-orange-400/10 text-orange-300 border-orange-400/20",
    statIcon: "text-orange-400",
    divider: "via-orange-400/30",
  },
  {
    place: "3rd",
    emoji: "🥉",
    banner: "from-yellow-500/30 via-yellow-400/20 to-transparent",
    bannerLine: "from-yellow-400 to-yellow-600",
    ring: "ring-yellow-400/60",
    glow: "hover:shadow-yellow-500/20",
    genrePill: "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
    statIcon: "text-yellow-400",
    divider: "via-yellow-400/30",
  },
];

const getTopWriters = (books) => {
  const data = Array.isArray(books) ? books : [];

  const writerStats = data.reduce((acc, book) => {
    const key = book.writerEmail || book.writerName;
    if (!key) return acc;

    if (!acc[key]) {
      acc[key] = {
        email: book.writerEmail || null,
        name: book.writerName || key,
        bookCount: 0,
        totalSales: 0,
        genres: {},
      };
    }

    acc[key].bookCount += 1;
    acc[key].totalSales += Number(book.price || 0);
    const g = book.genre || "General";
    acc[key].genres[g] = (acc[key].genres[g] || 0) + 1;
    return acc;
  }, {});

  return Object.values(writerStats)
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 3)
    .map((w) => ({
      ...w,
      topGenre:
        Object.entries(w.genres).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        "General",
    }));
};

async function fetchTopWriters() {
  const apiBooks = await getAllBooks();
  const books = Array.isArray(apiBooks) ? apiBooks : [];
  return getTopWriters(books);
}

export default async function TopWritersSection() {
  const writers = await fetchTopWriters();

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 px-4 py-12 sm:py-16">
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Top Writers"
          heading="Authors our readers love most"
          subheading="Ranked by total book sales across the library"
        />
        <WritersGrid writers={writers} />
      </div>
    </section>
  );
}
