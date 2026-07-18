import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgroNexis AI | Precision Agriculture Intelligence",
  description:
    "AgroNexis AI is an enterprise precision agriculture platform for crop intelligence, irrigation optimization, disease prediction, and farm operations.",
  keywords: [
    "precision agriculture",
    "AI farming",
    "agritech SaaS",
    "crop intelligence",
    "farm operations",
  ],
  openGraph: {
    title: "AgroNexis AI",
    description:
      "AI-powered precision agriculture command center for modern farm enterprises.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full bg-[#071A2F] font-sans text-slate-100">
        {children}
      </body>
    </html>
  );
}
