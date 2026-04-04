import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
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

  it("defines both conversion choices plus deposit and referral copy in shared content", () => {
    const conversionFlow = (
      landingPageContent as {
        conversionFlow?: {
          choices?: Array<{
            description: string;
            id: string;
            label: string;
            success: { body: string; title: string };
            valueProps: string[];
          }>;
          metricCallout?: string;
          referralShare?: {
            description: string;
            fallbackActionLabel: string;
            primaryActionLabel: string;
            title: string;
          };
        };
      }
    ).conversionFlow;

    expect(conversionFlow).toBeDefined();
    expect(conversionFlow?.choices).toHaveLength(2);
    expect(conversionFlow?.choices?.map((choice) => choice.id)).toEqual([
      "waitlist",
      "deposit",
    ]);

    const waitlistChoice = conversionFlow?.choices?.find(
      (choice) => choice.id === "waitlist",
    );
    const depositChoice = conversionFlow?.choices?.find(
      (choice) => choice.id === "deposit",
    );

    expect(waitlistChoice?.label.toLowerCase()).toContain("free");
    expect(waitlistChoice?.valueProps).toHaveLength(3);
    expect(waitlistChoice?.success.title.length).toBeGreaterThan(0);

    expect(depositChoice?.label).toContain("$25");
    expect(depositChoice?.description.toLowerCase()).toContain("refundable");
    expect(depositChoice?.valueProps).toHaveLength(3);
    expect(depositChoice?.success.body.toLowerCase()).toContain("payment");

    expect(conversionFlow?.metricCallout?.toLowerCase()).toContain("referral rate");
    expect(conversionFlow?.referralShare?.title.toLowerCase()).toContain("share");
    expect(conversionFlow?.referralShare?.description.toLowerCase()).toContain(
      "organic demand",
    );
    expect(conversionFlow?.referralShare?.primaryActionLabel).toContain("Copy");
    expect(conversionFlow?.referralShare?.fallbackActionLabel).toContain("manual");
  });

  it("documents the updated landing-page states and copy hierarchy in design.md", () => {
    const designDocPath = resolve(process.cwd(), "design.md");

    expect(existsSync(designDocPath)).toBe(true);

    const designDoc = readFileSync(designDocPath, "utf8");

    expect(designDoc).toContain("Hero surface");
    expect(designDoc).toContain("Footer surface");
    expect(designDoc).toContain("Free waitlist");
    expect(designDoc).toContain("$25 refundable deposit");
    expect(designDoc).toContain("Success state");
    expect(designDoc).toContain("Referral share state");
  });
});
