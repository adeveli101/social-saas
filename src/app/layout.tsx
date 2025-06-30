import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
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
  title: "Social SaaS - Modern Social Media Management",
  description: "Professional social media management platform for businesses and creators",
  keywords: ["social media", "management", "saas", "marketing", "analytics"],
  authors: [{ name: "Social SaaS Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground bg-background bg-gradient-to-br from-slate-950 via-background to-blue-950/20 min-h-screen`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
