import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import {
  FaBook,
  FaSearch,
  FaHeart,
  FaRocket,
  FaDragon,
  FaSkull,
  FaLandmark,
  FaFlask,
  FaBriefcase,
  FaBrain,
  FaGlobeAmericas,
  FaStar,
} from "react-icons/fa";

const genres = [
  {
    name: "Fiction",
    icon: FaBook,
    color:
      "from-violet-500/20 to-violet-600/10 border-violet-500/30 hover:border-violet-400/60",
    iconColor: "text-violet-400",
    glow: "hover:shadow-violet-500/10",
  },
  {
    name: "Mystery",
    icon: FaSearch,
    color:
      "from-amber-500/20 to-amber-600/10 border-amber-500/30 hover:border-amber-400/60",
    iconColor: "text-amber-400",
    glow: "hover:shadow-amber-500/10",
  },
  {
    name: "Romance",
    icon: FaHeart,
    color:
      "from-rose-500/20 to-rose-600/10 border-rose-500/30 hover:border-rose-400/60",
    iconColor: "text-rose-400",
    glow: "hover:shadow-rose-500/10",
  },
  {
    name: "Sci-Fi",
    icon: FaRocket,
    color:
      "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-400/60",
    iconColor: "text-cyan-400",
    glow: "hover:shadow-cyan-500/10",
  },
  {
    name: "Fantasy",
    icon: FaDragon,
    color:
      "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 hover:border-emerald-400/60",
    iconColor: "text-emerald-400",
    glow: "hover:shadow-emerald-500/10",
  },
  {
    name: "Horror",
    icon: FaSkull,
    color:
      "from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-400/60",
    iconColor: "text-red-400",
    glow: "hover:shadow-red-500/10",
  },
  {
    name: "History",
    icon: FaLandmark,
    color:
      "from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-400/60",
    iconColor: "text-orange-400",
    glow: "hover:shadow-orange-500/10",
  },
  {
    name: "Science",
    icon: FaFlask,
    color:
      "from-sky-500/20 to-sky-600/10 border-sky-500/30 hover:border-sky-400/60",
    iconColor: "text-sky-400",
    glow: "hover:shadow-sky-500/10",
  },
  {
    name: "Business",
    icon: FaBriefcase,
    color:
      "from-teal-500/20 to-teal-600/10 border-teal-500/30 hover:border-teal-400/60",
    iconColor: "text-teal-400",
    glow: "hover:shadow-teal-500/10",
  },
  {
    name: "Self-Help",
    icon: FaBrain,
    color:
      "from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-400/60",
    iconColor: "text-purple-400",
    glow: "hover:shadow-purple-500/10",
  },
  {
    name: "Travel",
    icon: FaGlobeAmericas,
    color:
      "from-lime-500/20 to-lime-600/10 border-lime-500/30 hover:border-lime-400/60",
    iconColor: "text-lime-400",
    glow: "hover:shadow-lime-500/10",
  },
  {
    name: "Poetry",
    icon: FaStar,
    color:
      "from-fuchsia-500/20 to-fuchsia-600/10 border-fuchsia-500/30 hover:border-fuchsia-400/60",
    iconColor: "text-fuchsia-400",
    glow: "hover:shadow-fuchsia-500/10",
  },
];

export default function GenresSection() {
  return (
    <section className="bg-white dark:bg-slate-950 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Browse by Genre"
          heading="Find your next favourite read"
          subheading="Explore our collection filtered by the genre you love most"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {genres.map(({ name, icon: Icon, color, iconColor, glow }) => (
            <Link
              key={name}
              href={`/books`}
              className={`group flex flex-col items-center gap-3 rounded-2xl border bg-linear-to-b ${color} p-5 shadow-lg ${glow} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/70 dark:bg-slate-900/60 text-2xl ${iconColor} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon />
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
