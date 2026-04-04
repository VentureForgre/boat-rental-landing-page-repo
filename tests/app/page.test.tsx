import { render } from "@testing-library/react";
import HomePage from "@/app/page";

const heroSectionSpy = vi.fn(
  ({ referralCode }: { referralCode?: string }) => (
    <section data-testid="hero-section">{referralCode ?? "no-referral"}</section>
  ),
);
const siteFooterSpy = vi.fn(
  ({ referralCode }: { referralCode?: string }) => (
    <footer data-testid="site-footer">{referralCode ?? "no-referral"}</footer>
  ),
);

vi.mock("@/components/landing/benefits-section", () => ({
  BenefitsSection: () => <section data-testid="benefits-section" />,
}));

vi.mock("@/components/landing/cta-section", () => ({
  CtaSection: () => <section data-testid="cta-section" />,
}));

vi.mock("@/components/landing/hero-section", () => ({
  HeroSection: (props: { referralCode?: string }) => heroSectionSpy(props),
}));

vi.mock("@/components/landing/lakes-section", () => ({
  LakesSection: () => <section data-testid="lakes-section" />,
}));

vi.mock("@/components/landing/site-footer", () => ({
  SiteFooter: (props: { referralCode?: string }) => siteFooterSpy(props),
}));

describe("HomePage", () => {
  beforeEach(() => {
    heroSectionSpy.mockClear();
    siteFooterSpy.mockClear();
  });

  it("passes a normalized referral code into both landing page conversion surfaces", async () => {
    render(await HomePage({ searchParams: Promise.resolve({ ref: " ab12cd34 " }) }));

    expect(heroSectionSpy.mock.calls[0]?.[0]).toEqual({ referralCode: "AB12CD34" });
    expect(siteFooterSpy.mock.calls[0]?.[0]).toEqual({ referralCode: "AB12CD34" });
  });

  it("uses the first valid referral code from repeated query params and ignores invalid values", async () => {
    const { rerender } = render(
      await HomePage({
        searchParams: Promise.resolve({ ref: ["bad-ref", " zx98yu76 "] }),
      }),
    );

    expect(heroSectionSpy.mock.calls[0]?.[0]).toEqual({ referralCode: "ZX98YU76" });
    expect(siteFooterSpy.mock.calls[0]?.[0]).toEqual({ referralCode: "ZX98YU76" });

    heroSectionSpy.mockClear();
    siteFooterSpy.mockClear();

    rerender(await HomePage({ searchParams: Promise.resolve({ ref: "not-valid" }) }));

    expect(heroSectionSpy.mock.calls[0]?.[0]).toEqual({ referralCode: undefined });
    expect(siteFooterSpy.mock.calls[0]?.[0]).toEqual({ referralCode: undefined });
  });
});
