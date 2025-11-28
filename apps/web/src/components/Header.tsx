"use client";

import React, { useState } from "react";
import Button from "./ui/Button";
import Logo from "./Logo";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-body border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Wordmark */}
          <Logo variant="primary" withWordmark={true} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("app-area")}
              className="text-sm text-text-muted hover:text-ink transition-colors"
            >
              The App
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm text-text-muted hover:text-ink transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-sm text-text-muted hover:text-ink transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-sm text-text-muted hover:text-ink transition-colors"
            >
              Contact
            </button>
            <Button
              variant="primary"
              onClick={() => scrollToSection("app-area")}
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6L18 18" />
              ) : (
                <path d="M3 12H21M3 6H21M3 18H21" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            <button
              onClick={() => scrollToSection("app-area")}
              className="block w-full text-left text-sm text-text-muted hover:text-ink py-2"
            >
              The App
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="block w-full text-left text-sm text-text-muted hover:text-ink py-2"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left text-sm text-text-muted hover:text-ink py-2"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left text-sm text-text-muted hover:text-ink py-2"
            >
              Contact
            </button>
            <Button
              variant="primary"
              onClick={() => scrollToSection("app-area")}
              className="w-full"
            >
              Get Started
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}

