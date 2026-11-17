import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Journey from "@/components/Journey";
import FxBoot from "@/components/FxBoot";
import { profile } from "@/data/profile";

const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Change this to your real domain once deployed
const siteUrl = "https://godsonudochukwu.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.shortName} | ${profile.role}`,
    template: `%s | ${profile.shortName}`,
  },
  description: profile.intro,
  keywords: ["Product Designer", "UI/UX Designer", "UX Lead", "SaaS Design", "Dashboard Design", "Nigeria", "Remote"],
  authors: [{ name: profile.fullName }],
  openGraph: {
    title: `${profile.shortName} | ${profile.role}`,
    description: profile.intro,
    url: siteUrl,
    siteName: profile.shortName,
    type: "website",
  },
  twitter: { card: "summary_large_image", creator: "@Ud_Graphics" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
    { media: "(prefers-color-scheme: light)", color: "#f5f4ef" },
  ],
};

// Applies the saved theme before paint so there's no flash
const themeScript = `try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className="scroll-progress" aria-hidden="true" />
        <Nav />
        <Journey />
        <main>{children}</main>
        <Footer />
        <FxBoot />
      </body>
    </html>
  );
}
