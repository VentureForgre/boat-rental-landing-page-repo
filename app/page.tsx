import { BenefitsSection } from "@/components/landing/benefits-section";
import { CtaSection } from "@/components/landing/cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LakesSection } from "@/components/landing/lakes-section";
import { OfferPopup } from "@/components/landing/offer-popup";
import { SiteFooter } from "@/components/landing/site-footer";
import { referralCodePattern } from "@/lib/waitlist-schema";

type PageSearchParams = {
  ref?: string | string[] | undefined;
};

type HomePageProps = {
  searchParams?: Promise<PageSearchParams> | PageSearchParams;
};

function normalizeReferralCode(
  value: PageSearchParams["ref"],
): string | undefined {
  const values = Array.isArray(value) ? value : [value];

  for (const candidate of values) {
    if (typeof candidate !== "string") {
      continue;
    }

    const normalizedCandidate = candidate.trim().toUpperCase();

    if (referralCodePattern.test(normalizedCandidate)) {
      return normalizedCandidate;
    }
  }

  return undefined;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const referralCode = normalizeReferralCode(resolvedSearchParams?.ref);

  return (
    <>
      <main id="main-content">
        <HeroSection referralCode={referralCode} />
        <LakesSection />
        <BenefitsSection />
        <div className="topo-pattern relative overflow-hidden bg-[var(--color-background)]">
          <CtaSection />
          <SiteFooter referralCode={referralCode} />
        </div>
      </main>
      <OfferPopup />
    </>
  );
}
