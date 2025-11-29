"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../components/auth/AuthProvider";
import Button from "../../../components/ui/Button";
import Logo from "../../../components/Logo";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error: signInError } = await signInWithEmail(email);
    if (signInError) {
      setError(signInError.message);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-body flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Logo variant="primary" withWordmark={true} className="mb-4" />
          <h1 className="text-3xl font-bold text-ink mb-2">Welcome back</h1>
          <p className="text-text-muted">
            We&apos;ll send you a magic link to sign in. No password needed.
          </p>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm border border-gray-200">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ink mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary outline-none"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full">
                Send magic link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">✉️</div>
              <h2 className="text-xl font-semibold text-ink">
                Check your email
              </h2>
              <p className="text-text-muted">
                We sent a magic link to <strong>{email}</strong>. Click it to
                sign in.
              </p>
              <p className="text-sm text-text-muted">
                Didn&apos;t get it? Check your spam folder, or{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-accent-primary hover:underline"
                >
                  try again
                </button>
                .
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          New here? Just enter your email and we&apos;ll create an account for
          you.
        </p>
      </div>
    </div>
  );
}

