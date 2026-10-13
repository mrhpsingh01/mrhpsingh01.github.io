import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/poppins/latin-700.css";
import "@fontsource/poppins/latin-800.css";
import "@fontsource-variable/fraunces/wght.css";
import "@fontsource-variable/fraunces/wght-italic.css";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CursorPet } from "@/components/cursor-pet";
import { siteConfig } from "@/content/site";
import { profile } from "@/content/profile";
import { LOCAL_ORIGIN, getSiteOrigin } from "@/lib/site-url";

const origin = getSiteOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(origin ?? LOCAL_ORIGIN),
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <SiteHeader />
        <CursorPet />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
      </body>
    </html>
  );
}
