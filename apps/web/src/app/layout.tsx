import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../components/auth/AuthProvider";
import { ToastProvider } from "../components/ui/Toast";

export const metadata: Metadata = {
  title: "Catered By Me",
  description: "Host the meal. We've got the rest. Turn your recipes into a step-by-step game plan so everything hits the table at the same time.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
