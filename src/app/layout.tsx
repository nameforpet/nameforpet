import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "loveforpet.com - AI Pet Name Generator with Built-in Vision",
  description: "Find the most meaningful pet name for your dog, cat, rabbit, or bird across 14+ languages. Upload a photo and let our self-hosted AI match coat colors and features.",
  keywords: ["pet names", "ai pet name finder", "dog names", "cat names", "japanese pet names", "french pet names", "spanish pet names", "loveforpet"],
  openGraph: {
    title: "loveforpet.com - AI Pet Name Generator",
    description: "Upload a picture of your pet to find matching multilingual names powered by built-in vision AI.",
    url: "https://loveforpet.com",
    siteName: "loveforpet.com",
    locale: "en_US",
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
