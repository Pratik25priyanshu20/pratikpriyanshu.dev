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

export const metadata: Metadata = {
  title: "Pratik Priyanshu — ML Engineer",
  description:
    "ML Engineer specializing in Multi-Agent Systems, Quantum ML, and Edge AI. Building intelligent systems that push the boundaries of machine learning.",
  keywords: [
    "ML Engineer",
    "Machine Learning",
    "Multi-Agent Systems",
    "Quantum ML",
    "Edge AI",
    "Deep Learning",
    "Portfolio",
  ],
  authors: [{ name: "Pratik Priyanshu" }],
  openGraph: {
    title: "Pratik Priyanshu — ML Engineer",
    description:
      "ML Engineer specializing in Multi-Agent Systems, Quantum ML, and Edge AI.",
    type: "website",
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
