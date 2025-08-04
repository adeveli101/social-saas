import type { Metadata, Viewport } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/lib/theme-provider'
import "./globals.css";
import "aos/dist/aos.css";
import { FooterSection } from "@/components/landing_page/footer-section"
import { Header } from "@/components/shared/header"

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
      <html lang="en" suppressHydrationWarning>
        <body
          className="antialiased text-foreground min-h-screen font-sans"
        >
          <ThemeProvider>
            <Header />
            <div className="min-h-screen bg-gradient-main page-fade transition-all">
              {children}
            </div>
            <FooterSection />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
