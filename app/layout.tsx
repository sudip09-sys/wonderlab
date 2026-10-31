import type { Metadata } from "next";
import "./globals.css";
import "./studio.css";
import "./accessibility.css";

export const metadata: Metadata = {
  title: "WonderLab — Make an idea worth explaining",
  description: "Create interactive exhibits, collaborate with credited contributors, and rehearse explaining your ideas.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "WonderLab", statusBarStyle: "default" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
