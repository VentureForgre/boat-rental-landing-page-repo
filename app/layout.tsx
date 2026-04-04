import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfairDisplay = Playfair_Display({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  applicationName: "Luxe Lake Escapes",
  alternates: {
    canonical: "/",
  },
  description:
    "Luxury boat charters on Georgia lakes with concierge-level service, professional captains, and refundable $25 deposit priority before launch.",
  keywords: [
    "Georgia boat rentals",
    "luxury yacht charter Georgia",
    "Lake Lanier boat charter",
    "Lake Allatoona rentals",
    "luxury lake charters",
  ],
  metadataBase: new URL("https://luxelakeescapes.com"),
  openGraph: {
    description:
      "Luxury boat charters on Georgia lakes with concierge-level service, professional captains, and refundable $25 deposit priority before launch.",
    locale: "en_US",
    siteName: "Luxe Lake Escapes",
    title: "Luxe Lake Escapes | Luxury Boat Rentals Georgia",
    type: "website",
    url: "/",
  },
  title: {
    default: "Luxe Lake Escapes | Luxury Boat Rentals Georgia",
    template: "%s | Luxe Lake Escapes",
  },
  twitter: {
    card: "summary_large_image",
    description:
      "Luxury boat charters on Georgia lakes with concierge-level service, professional captains, and refundable $25 deposit priority before launch.",
    title: "Luxe Lake Escapes | Luxury Boat Rentals Georgia",
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable}`}
      lang="en"
    >
      <body className="antialiased">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
