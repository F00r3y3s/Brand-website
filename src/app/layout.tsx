import type { Metadata } from "next";
import { Inter, Outfit, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Providers } from "@/context/Providers";
import MagneticCursor from "@/components/MagneticCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AInar - Premium Brand Agency",
  description:
    "A premium brand agency specializing in sustainability, AI advisory, and digital transformation. Based in UAE.",
  keywords: [
    "Brand Agency",
    "Sustainability",
    "AI Advisory",
    "UAE",
    "Digital Transformation",
    "Web Development",
  ],
  authors: [{ name: "AInar" }],
  openGraph: {
    title: "AInar - Premium Brand Agency",
    description: "A premium brand agency specializing in sustainability and AI.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_AE"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} ${notoSansArabic.variable} antialiased`}
      >
        <div className="grain-overlay" />
        <Providers>
          <MagneticCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
