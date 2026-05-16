import type { Metadata } from "next";
import { Manrope, Oswald } from "next/font/google";
import "@/app/globals.css";
import { BRAND } from "@/content/site";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

const displayFont = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.canonicalUrl),
  title: `${BRAND.name} | ${BRAND.tagline}`,
  description:
    "Ceramic coating, custom paint, powder coating, tinting, wrapping, and premium detailing for cars and bikes.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${BRAND.name} | ${BRAND.tagline}`,
    description:
      "Ceramic coating, custom paint, powder coating, tinting, wrapping, and premium detailing for cars and bikes.",
    url: BRAND.canonicalUrl,
    siteName: BRAND.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} | ${BRAND.tagline}`,
    description:
      "Ceramic coating, custom paint, powder coating, tinting, wrapping, and premium detailing for cars and bikes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteNav />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
