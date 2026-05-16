import type { Metadata } from "next";
import { Manrope, Oswald } from "next/font/google";
import "@/app/globals.css";
import { BRAND } from "@/content/site";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";

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
    images: [{ url: "/media/collage/collage-01.jpg", width: 1200, height: 630, alt: "Nano Grit Auto Detailing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} | ${BRAND.tagline}`,
    description:
      "Ceramic coating, custom paint, powder coating, tinting, wrapping, and premium detailing for cars and bikes.",
    images: ["/media/collage/collage-01.jpg"],
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
        <WhatsAppFloat />
      </body>
    </html>
  );
}
