import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { AiStatusIndicator } from "@/components/AiStatusIndicator";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "WildWhisper AI",
  description: "Listen. Look. Discover. An offline AI nature companion.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WildWhisper",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground pb-16 antialiased selection:bg-green-500/30`}>
        <OfflineIndicator />
        <AiStatusIndicator />
        <main className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-card border-x border-border/40 overflow-hidden">
          {children}
        </main>
        <Navigation />
      </body>
    </html>
  );
}
