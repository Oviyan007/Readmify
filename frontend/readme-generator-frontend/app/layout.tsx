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
  title: "README.ai - AI-Powered README Generator",
  description: "Generate professional README.md files for your GitHub repositories instantly using AI. Free, fast, and secure.",
  keywords: "README generator, AI README, GitHub README, documentation generator",
  authors: [{ name: "README.ai" }],
  openGraph: {
    title: "README.ai - AI-Powered README Generator",
    description: "Generate professional README.md files for your GitHub repositories instantly using AI.",
    type: "website",
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
