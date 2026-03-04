import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Market Pulse | AI-Driven Opportunity Scanning",
    template: "%s | Market Pulse",
  },
  description:
    "Capture intelligence across the software landscape. AI-powered market signal analysis to help you build what people actually want.",
  keywords: [
    "Market Intelligence",
    "AI",
    "Startup Signals",
    "Opportunity Scanning",
    "Market Pulse",
  ],
  authors: [{ name: "Market Pulse Team" }],
  creator: "Market Pulse",
  publisher: "Market Pulse",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Market Pulse",
    description: "Intelligence Engine for Modern Builders",
    url: "https://marketpulse.ai",
    siteName: "Market Pulse",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Market Pulse",
    description: "Intelligence Engine for Modern Builders",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
