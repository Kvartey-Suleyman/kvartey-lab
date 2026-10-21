import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "KVARTEY LAB — Merakını oyuna dönüştür",
  description:
    "Futbol kariyerleri, alternatif dünyalar ve interaktif keşifler. Türkçe deneyim platformu.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
