import { BenefitsSection } from "@/components/landing/benefits-section";
import { CtaSection } from "@/components/landing/cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LakesSection } from "@/components/landing/lakes-section";
import { SiteFooter } from "@/components/landing/site-footer";

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroSection />
      <LakesSection />
      <BenefitsSection />
      <div className="topo-pattern relative overflow-hidden bg-[var(--color-background)]">
        <CtaSection />
        <SiteFooter />
      </div>
    </main>
  );
}
