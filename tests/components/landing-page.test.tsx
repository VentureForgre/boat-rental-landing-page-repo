import type { ComponentPropsWithoutRef } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
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

  it("renders the expected sections, lakes, and waitlist surfaces", () => {
    const { container } = render(<HomePage />);

    expect(
      screen.getByRole("link", { name: /join waitlist/i }),
    ).toHaveAttribute("href", "#waitlist");
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /explore georgia's premier shores/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /lake sidney lanier/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /allatoona lake/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /hartwell lake/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /j\. strom thurmond lake/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /walter f\. george lake/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /unrivaled safety, comfort & style/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /secure your launch priority/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 3,
        name: /professional captains/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/concierge@luxelake\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/primary market .* launch priority/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(`${currentYear} luxe lake escapes, all rights reserved`, "i"),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(new RegExp(`coming summer ${currentYear}`, "i")),
    ).toHaveLength(2);
    expect(
      screen.getByText(new RegExp(`summer ${currentYear} launch fleet locations`, "i")),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("combobox", { name: /select your lake/i })).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /join the waitlist/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(
      container.querySelector('img[src*="AB6AXuA0T4Z2ypI0eBJgupQzvWlIf9-gSx5gm0BwhAWYj_KtpY-y0v_BoTq3Rta3qv4YFs0lefLx8FfMKr-HfmmTnqPjLcd6h6qBtiK79HlomyqG4oe1LYK0NBRSl6pbyNkn9XOMJtZP5CWruiMrzrxeqwyoftuto_9ZtvVtL9HAsjZF0ZXAXOsoD7tKqlsrJeIZ0vpHxHKncvmnHEEvSdP4mVGUnvzN4YzEA_nmWPiazYz2rXCXiwCgsuGbR_9ZaOQnxK4KuPpSl0g70so_"][loading="eager"]'),
    ).not.toBeNull();
  });

  it("exposes a keyboard skip link and a toggleable mobile navigation menu", () => {
    const layout = RootLayout({ children: <HomePage /> });

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
