import type { Metadata, Viewport } from "next";

import Providers from "@/components/Providers";
import { profile } from "@/content/profile";
import "./globals.css";

const archivo = { variable: "s1" };

const mono = { variable: "s2" };

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description:
    "Embedded systems, machine learning, and the interfaces on top of them. Computer science at UC Irvine, class of 2027.",
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    title: profile.name,
    description: "Embedded systems, machine learning, and the interfaces on top of them.",
    siteName: profile.name,
  },
  twitter: { card: "summary_large_image", title: profile.name },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e13" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${mono.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
