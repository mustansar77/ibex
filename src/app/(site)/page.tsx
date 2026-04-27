import HeroCarousel from "@/components/sections/HeroCarousel";
import StatsSection from "@/components/sections/StatsSection";
import ProgramsSection from "@/components/sections/ProgramsSection";
import TopPositionsSection from "@/components/sections/TopPositionsSection";
import WhyIbexSection from "@/components/sections/WhyIbexSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <StatsSection />
      <ProgramsSection />
      <TopPositionsSection />
      <WhyIbexSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
