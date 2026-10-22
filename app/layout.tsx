import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Cosmos } from "@/components/Cosmos";
import { Cursor } from "@/components/Cursor";
import { IntroProvider } from "@/components/IntroProvider";
import { Nav } from "@/components/Nav";
import { Preloader } from "@/components/Preloader";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const shoulders = Big_Shoulders({
  variable: "--font-shoulders",
  subsets: ["latin"],
  axes: ["opsz"],
  adjustFontFallback: false,
  fallback: ["Impact", "sans-serif"],
});
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OleTide — We see the vision. We scale games.",
  description:
    "OleTide is a LiveOps partner for Roblox games. We take over growth and development, and get paid through a revenue share.",
};

export const viewport: Viewport = { themeColor: "#0a0705" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${shoulders.variable} ${fraunces.variable} ${geist.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <Cosmos />
        <IntroProvider>
          <SmoothScroll />
          <Preloader />
          <Nav />
          <Cursor />
          {children}
        </IntroProvider>
        <div aria-hidden className="vignette" />
        <div aria-hidden className="grain" />
      </body>
    </html>
  );
}
