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
  metadataBase: new URL('https://ainar.ae'),
  title: {
    default: "AInar - Premium Brand Agency | Sustainability & AI",
    template: "%s | AINAR"
  },
  description:
    "AInar is a premium UAE brand agency specializing in sustainability and AI advisory to empower businesses with innovative digital solutions.",
  keywords: [
    "Brand Agency UAE",
    "Sustainability Advisor",
    "AI Advisory Dubai",
    "Digital Transformation",
    "Sustainable Growth",
    "AINAR",
  ],
  authors: [{ name: "AInar" }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "AInar - Premium Brand Agency | Sustainability & AI",
    description: "Empowering businesses through sustainability and AI-driven digital transformation in the UAE.",
    url: 'https://ainar.ae',
    siteName: 'AINAR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AINAR - Sustainability and AI Advisory',
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "AInar - Premium Brand Agency | Sustainability & AI",
    description: "Empowering businesses through sustainability and AI-driven digital transformation in the UAE.",
    images: ['/og-image.png'],
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
        suppressHydrationWarning={true}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        <div className="grain-overlay" />
        <Providers>
          <MagneticCursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
