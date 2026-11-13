import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "./site-footer";

export const metadata: Metadata = {
  title: "Eindhoven Cricket Club",
  description: "Cricket lives here. Eindhoven's cricket community since 1915.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}<SiteFooter /></body>
    </html>
  );
}
