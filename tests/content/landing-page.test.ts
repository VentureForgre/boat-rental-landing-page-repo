import {
  benefitCards,
  featuredLakes,
  landingPageContent,
  lakeOptions,
  navigationItems,
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

  it("defines both waitlist surfaces against the shared lake catalog", () => {
    const supportedLakeIds = new Set(lakeOptions.map((lake) => lake.id));

    expect(waitlistSurfaceContent.hero.source).toBe("hero");
    expect(waitlistSurfaceContent.footer.source).toBe("footer");
    expect(supportedLakeIds.has(waitlistSurfaceContent.hero.defaultLakeId)).toBe(
      true,
    );
    expect(
      supportedLakeIds.has(waitlistSurfaceContent.footer.defaultLakeId),
    ).toBe(true);
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
    expect(landingPageContent.hero.eyebrow).toContain(`${currentYear}`);
    expect(landingPageContent.lakesSection.body).toContain(`Summer ${currentYear}`);
    expect(landingPageContent.footerCopyright).not.toContain("2024");
    expect(landingPageContent.hero.eyebrow).not.toContain("2025");
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
});
