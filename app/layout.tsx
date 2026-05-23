import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgroNexis AI | Precision agriculture intelligence",
  description:
    "Explore AI-driven monitoring, climate insights, and farm optimization with AgroNexis AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F1F8E9] text-[#1C1C1C]">{children}</body>
    </html>
  );
}
