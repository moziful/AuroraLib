import HeroCarousel from "@/components/HeroCarousel";
import FeaturedEbooksSection from "@/components/FeaturedEbooksSection";

export default async function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950">
      <HeroCarousel />
      <FeaturedEbooksSection />
    </div>
  );
}
