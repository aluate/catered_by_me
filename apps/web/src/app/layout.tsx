import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catered By Me",
  description: "Host the meal. We've got the rest. Turn your recipes into a step-by-step game plan so everything hits the table at the same time.",
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

