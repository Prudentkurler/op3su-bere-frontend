import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: '#0B0F19',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: "NASA Weather Companion",
  description: "AI-powered weather insights using NASA meteorological data",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NASA Weather Companion",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "NASA Weather Companion",
    title: "NASA Weather Companion",
    description: "AI-powered weather insights using NASA meteorological data",
  },
  twitter: {
    card: "summary",
    title: "NASA Weather Companion",
    description: "AI-powered weather insights using NASA meteorological data",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
