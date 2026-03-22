import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxe Lake Escapes",
  description: "Luxury boat charters on Georgia lakes.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

