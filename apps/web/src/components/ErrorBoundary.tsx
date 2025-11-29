"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Button from "./ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console (in production, send to error tracking service)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-body flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card rounded-xl p-8 shadow-lg border border-gray-200 text-center">
            <div className="text-4xl mb-4">😅</div>
            <h1 className="text-2xl font-bold text-ink mb-4">
              Something went wrong
            </h1>
            <p className="text-text-muted mb-6">
              We hit a snag. Don&apos;t worry, your data is safe. Try refreshing the page, or head back to your kitchen.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Refresh page
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = "/app")}
              >
                Go to My Kitchen
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-text-muted cursor-pointer">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

