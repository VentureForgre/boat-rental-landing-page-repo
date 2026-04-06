import type { ComponentPropsWithoutRef } from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import HomePage from "@/app/page";

vi.mock("next/font/google", () => ({
  Playfair_Display: () => ({
    style: { fontFamily: "Playfair Display" },
    variable: "--font-display",
  }),
  Plus_Jakarta_Sans: () => ({
    style: { fontFamily: "Plus Jakarta Sans" },
    variable: "--font-sans",
  }),
}));

vi.mock("next/image", () => ({
  default: (props: ComponentPropsWithoutRef<"img"> & { priority?: boolean }) => {
    const { alt = "", priority, ...rest } = props;
    void priority;

    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />;
  },
}));

const { metadata } = await import("@/app/layout");
const { default: RootLayout } = await import("@/app/layout");

describe("Landing page composition", () => {
  const currentYear = new Date().getFullYear();

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the expected sections, lakes, and both conversion surfaces without referral context", async () => {
    const { container } = render(await HomePage({}));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /reserve today \$200 for any 2 days/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /claim today's offer/i }).every(
        (link) => link.getAttribute("href") === "#deposit",
      ),
    ).toBe(true);
    expect(
      screen.getAllByText(/\$200 today for any 2 days/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/redeem it later for any two charter days/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /explore georgia's premier shores/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /reserve any 2 charter days with \$200 today/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /reserve today with \$200 for any 2 days/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\$25/)).not.toBeInTheDocument();
    expect(screen.queryByText(/free waitlist/i)).not.toBeInTheDocument();
    expect(screen.getByText(/concierge@luxelake\.com/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(`${currentYear} luxe lake escapes, all rights reserved`, "i"),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/today's offer only/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/reserve any 2 charter days later/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(new RegExp(`summer ${currentYear} launch fleet locations`, "i")),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("combobox", { name: /select your lake/i })).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /claim offer/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send offer details/i }),
    ).toBeInTheDocument();
    expect(
      container.querySelector('img[src*="AB6AXuA0T4Z2ypI0eBJgupQzvWlIf9-gSx5gm0BwhAWYj_KtpY-y0v_BoTq3Rta3qv4YFs0lefLx8FfMKr-HfmmTnqPjLcd6h6qBtiK79HlomyqG4oe1LYK0NBRSl6pbyNkn9XOMJtZP5CWruiMrzrxeqwyoftuto_9ZtvVtL9HAsjZF0ZXAXOsoD7tKqlsrJeIZ0vpHxHKncvmnHEEvSdP4mVGUnvzN4YzEA_nmWPiazYz2rXCXiwCgsuGbR_9ZaOQnxK4KuPpSl0g70so_"][loading="eager"]'),
    ).not.toBeNull();
    expect(container.querySelector('[data-testid="hero-fade-transition"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="lakes-fade-transition"]')).not.toBeNull();
  });

  it("includes the referral code in submissions from both the hero and footer surfaces", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            ok: true,
            message:
              "Your $200 for any 2 days request is in. Watch your inbox for concierge follow-up and your share link.",
            conversionType: "deposit",
            referralCode: "ZX98YU76",
            shareUrl: "https://luxelake.com/?ref=ZX98YU76",
          }),
          {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            ok: true,
            message:
              "Your $200 for any 2 days request is in. Watch your inbox for concierge follow-up and your share link.",
            conversionType: "deposit",
            referralCode: "MN34PQ56",
            shareUrl: "https://luxelake.com/?ref=MN34PQ56",
          }),
          {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    render(await HomePage({ searchParams: Promise.resolve({ ref: "ab12cd34" }) }));

    const hero = screen.getByRole("banner");
    const footer = screen.getByRole("contentinfo");

    fireEvent.change(within(hero).getByRole("textbox", { name: /ready to reserve/i }), {
      target: { value: "captain@example.com" },
    });
    fireEvent.click(within(hero).getByRole("button", { name: /claim offer/i }));

    fireEvent.change(within(footer).getByRole("textbox", { name: /your email address/i }), {
      target: { value: "crew@example.com" },
    });
    fireEvent.click(within(footer).getByRole("button", { name: /send offer details/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      method: "POST",
    });
    expect(JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)).toEqual({
      email: "captain@example.com",
      source: "hero",
      preferredLake: "lake-sidney-lanier",
      conversionType: "deposit",
      referralCode: "AB12CD34",
    });
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({
      method: "POST",
    });
    expect(JSON.parse(fetchMock.mock.calls[1]?.[1]?.body as string)).toEqual({
      email: "crew@example.com",
      source: "footer",
      preferredLake: "lake-sidney-lanier",
      conversionType: "deposit",
      referralCode: "AB12CD34",
    });
  });

  it("exposes a keyboard skip link and a toggleable mobile navigation menu", async () => {
    const page = await HomePage({});
    const layout = RootLayout({ children: page });

    render(<>{layout.props.children.props.children}</>);

    expect(screen.getByRole("link", { name: /skip to main content/i })).toHaveAttribute(
      "href",
      "#main-content",
    );

    const menuButton = screen.getByRole("button", {
      name: /open navigation menu/i,
    });

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("dialog", { name: /mobile navigation/i }),
    ).not.toBeInTheDocument();

    fireEvent.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    const mobileMenu = screen.getByRole("dialog", { name: /mobile navigation/i });

    expect(
      screen.getByRole("link", { name: /premium fleet/i }),
    ).toHaveAttribute("href", "#benefits");
    expect(
      screen.getByRole("link", { name: /contact/i }),
    ).toHaveAttribute("href", "#concierge");
    expect(
      within(mobileMenu).getByRole("link", { name: /georgia lakes/i }),
    ).toHaveAttribute("href", "#lakes");

    fireEvent.click(within(mobileMenu).getByRole("button", { name: /close/i }));

    expect(
      screen.getByRole("button", { name: /open navigation menu/i }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("dialog", { name: /mobile navigation/i }),
    ).not.toBeInTheDocument();
  });

  it("exports baseline SEO metadata for sharing and indexing", () => {
    expect(metadata.metadataBase?.toString()).toBe("https://luxelakeescapes.com/");
    expect(metadata.title).toEqual({
      default: "Luxe Lake Escapes | Luxury Boat Rentals Georgia",
      template: "%s | Luxe Lake Escapes",
    });
    expect(metadata.description).toMatch(/luxury boat charters on georgia lakes/i);
    expect(metadata.openGraph).toMatchObject({
      siteName: "Luxe Lake Escapes",
      title: "Luxe Lake Escapes | Luxury Boat Rentals Georgia",
      type: "website",
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Luxe Lake Escapes | Luxury Boat Rentals Georgia",
    });
  });
});
