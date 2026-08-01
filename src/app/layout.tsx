import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Founder Dashboard",
  description:
    "Overnight revenue, urgent customer issues, and what needs your reply.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${inter.variable} ${jetbrainsMono.variable} h-full w-full antialiased`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen w-full font-sans">
        <ThemeProvider>
          <div className="relative flex min-h-screen w-full flex-col">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
