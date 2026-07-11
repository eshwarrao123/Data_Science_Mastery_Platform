import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { TopNav } from "@/components/layout/top-nav";
import { CommandPalette } from "@/components/layout/command-palette";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Data Science Mastery",
    template: "%s · Data Science Mastery",
  },
  description:
    "Learn Data Science from Absolute Beginner to Industry Ready. Interactive playgrounds, an AI tutor, and an exhaustive curriculum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-base text-primary">
        <Providers>
          <TopNav />
          <CommandPalette />
          <div className="flex-1 flex flex-col pt-16">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
