import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://aitokencost.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "AI Token Cost — compare LLM API prices on your real prompt",
  description:
    "Paste a prompt and see what one request costs on GPT-4o, Claude, Gemini, " +
    "and more — with exact OpenAI token counts and hand-checked prices.",
  keywords: [
    "LLM cost calculator",
    "OpenAI pricing",
    "Claude API pricing",
    "Gemini pricing",
    "token cost comparison",
  ],
  openGraph: {
    title: "AI Token Cost",
    description:
      "Compare LLM API prices on your real prompt. Exact OpenAI token counts, hand-checked pricing.",
    url: SITE_URL,
    siteName: "AI Token Cost",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Token Cost",
    description: "Compare LLM API prices on your real prompt.",
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
