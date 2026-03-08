import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

import "reactflow/dist/style.css";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700"]
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "RealityCheck AI",
  description: "Startup idea to market atlas hackathon scaffold."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${fraunces.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
