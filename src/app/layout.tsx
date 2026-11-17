import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import Analytics from "@/components/Analytics";
import { getLocale } from "@/lib/i18n";
import { caveat, zen } from "@/lib/siteFonts";
import { inter } from "@/templates/fonts";
import "./globals.css";

const bengali = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-bn", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: { default: "My Product Shelf", template: "%s" },
  description:
    "Turn the photos scattered across Facebook and Instagram into one clean, organised product gallery you can share with a single link.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${inter.variable} ${bengali.variable} ${zen.variable} ${caveat.variable}`}>
      <body className="min-h-screen">
        {children}
        <Analytics id={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
