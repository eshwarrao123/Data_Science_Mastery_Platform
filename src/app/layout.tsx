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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              // Apply the stored theme before first paint to avoid a flash
              // of the wrong theme. Mirrors the logic in theme-provider.tsx.
              `try{if((localStorage.getItem("dsm-theme")??"dark")==="dark")document.documentElement.classList.add("dark")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
        <Providers>
          <TopNav />
          <CommandPalette />
          <div className="flex-1 flex flex-col pt-16">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
