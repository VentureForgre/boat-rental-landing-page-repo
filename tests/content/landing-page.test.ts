import {
  benefitCards,
  featuredLakes,
  landingPageContent,
  lakeOptions,
  navigationItems,
  offerPopupContent,
  waitlistSurfaceContent,
} from "@/content/landing-page";
import { landingIcons } from "@/components/landing/icons";

describe("landing-page content", () => {
  const currentYear = new Date().getFullYear();

  it("covers the five supported Georgia launch lakes in both option and feature data", () => {
    expect(lakeOptions).toHaveLength(5);
    expect(featuredLakes).toHaveLength(5);

    expect(new Set(featuredLakes.map((lake) => lake.id))).toEqual(
      new Set(lakeOptions.map((lake) => lake.id)),
    );
  });

  it("defines both inline form surfaces against the shared lake catalog", () => {
    const supportedLakeIds = new Set(lakeOptions.map((lake) => lake.id));

    expect(waitlistSurfaceContent.hero.source).toBe("hero");
    expect(waitlistSurfaceContent.footer.source).toBe("footer");
    expect(supportedLakeIds.has(waitlistSurfaceContent.hero.defaultLakeId)).toBe(
      true,
    );
    expect(
      supportedLakeIds.has(waitlistSurfaceContent.footer.defaultLakeId),
    ).toBe(true);
    expect(waitlistSurfaceContent.hero.submitLabel).toMatch(/claim offer/i);
    expect(waitlistSurfaceContent.footer.submitLabel).toMatch(/offer details/i);
  });

  it("keeps the navigation and trust content populated for later section components", () => {
    expect(navigationItems).toHaveLength(4);
    expect(benefitCards).toHaveLength(4);
    expect(landingIcons.sailing).toBeDefined();
    expect(landingIcons.mail).toBeDefined();
    expect(landingIcons.badge).toBeDefined();
  });

  it("derives launch and copyright copy from the current year", () => {
    expect(landingPageContent.footerCopyright).toContain(`${currentYear}`);
    expect(landingPageContent.lakesSection.body).toContain(`Summer ${currentYear}`);
    expect(landingPageContent.footerCopyright).not.toContain("2024");
    expect(landingPageContent.lakesSection.body).not.toContain("Summer 2025");
  });

  it("uses Pexels-hosted imagery for J. Strom Thurmond and Walter F. George", () => {
    const jStromThurmond = featuredLakes.find(
      (lake) => lake.id === "j-strom-thurmond-lake",
    );
    const walterFGeorge = featuredLakes.find(
      (lake) => lake.id === "walter-f-george-lake",
    );

    expect(jStromThurmond?.imageSrc).toMatch(/^https:\/\/images\.pexels\.com\//);
    expect(walterFGeorge?.imageSrc).toMatch(/^https:\/\/images\.pexels\.com\//);
  });

  it("centers the page around the $200 offer while preserving referral-share follow-up", () => {
    const conversionFlow = landingPageContent.conversionFlow;
    const depositChoice = conversionFlow.choices[0];

    expect(landingPageContent.hero.eyebrow).toMatch(/today/i);
    expect(landingPageContent.hero.description).toMatch(/\$200/i);
    expect(landingPageContent.hero.description).toMatch(/any 2 days|any two days/i);
    expect(landingPageContent.hero.primaryAction.label).toMatch(/claim/i);
    expect(landingPageContent.closingCta.title).toMatch(/\$200/i);
    expect(landingPageContent.closingCta.body).toMatch(/redeem/i);
    expect(landingPageContent.brand.summary).not.toMatch(/waitlist/i);
    expect(benefitCards.some((card) => /\$25|waitlist/i.test(card.description))).toBe(false);

    expect(conversionFlow.choices).toHaveLength(1);
    expect(depositChoice.id).toBe("deposit");
    expect(depositChoice.label).toMatch(/\$200/i);
    expect(depositChoice.submitLabel).toMatch(/claim offer/i);
    expect(depositChoice.success.body).toMatch(/\$200/i);
    expect(conversionFlow.referralShare.title).toMatch(/share/i);
    expect(conversionFlow.referralShare.helperText).toMatch(/offer requests/i);

    expect(offerPopupContent.headline).toMatch(/30% off/i);
    expect(offerPopupContent.body).toMatch(/\$200/i);
    expect(offerPopupContent.submitLabel).toMatch(/unlock/i);
    expect(offerPopupContent.successMessage).toMatch(/30% off/i);
    expect(offerPopupContent.triggers.delaySeconds).toBe(6);
    expect(offerPopupContent.triggers.maxDailyImpressions).toBe(2);
    expect(offerPopupContent.triggers.dismissCooldownHours).toBe(72);
    expect(offerPopupContent.triggers.submittedSuppressionDays).toBe(30);
  });
});
