import { AuthProvider } from "../../components/auth/AuthProvider";
import { ToastProvider } from "../../components/ui/Toast";
import { ErrorBoundary } from "../../components/ErrorBoundary";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

