import type { Metadata } from "next";
import { Inter, Space_Grotesk, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const SITE_URL = "https://pratikpriyanshu-dev.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pratik Priyanshu | ML Engineer | GenAI, Quantum ML & Multi-Agent Systems",
  description:
    "ML Engineer bridging research and production across GenAI, Quantum ML, Multi-Agent AI, and Privacy-Preserving Systems. Building production-grade AI at scale.",
  openGraph: {
    title: "Pratik Priyanshu | ML Engineer | GenAI, Quantum ML & Multi-Agent Systems",
    description:
      "ML Engineer bridging research and production across GenAI, Quantum ML, Multi-Agent AI, and Privacy-Preserving Systems. Building production-grade AI at scale.",
    url: SITE_URL,
    siteName: "Pratik Priyanshu",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pratik Priyanshu | ML Engineer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratik Priyanshu | ML Engineer | GenAI, Quantum ML & Multi-Agent Systems",
    description:
      "ML Engineer bridging research and production across GenAI, Quantum ML, Multi-Agent AI, and Privacy-Preserving Systems. Building production-grade AI at scale.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${firaCode.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
