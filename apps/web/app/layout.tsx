import type { Metadata } from "next";

import "reactflow/dist/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "RealityCheck AI",
  description: "Startup idea to market atlas hackathon scaffold."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}