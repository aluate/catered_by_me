import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catered By Me",
  description: "Your day-of cooking execution planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

