"use client";

import React from "react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-body border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Left: Logo + Tagline */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2L3 7V17H17V7L10 2Z"
                    stroke="#F7F3EE"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <line x1="5" y1="10" x2="15" y2="10" stroke="#F7F3EE" strokeWidth="1" />
                  <line x1="6" y1="13" x2="14" y2="13" stroke="#F7F3EE" strokeWidth="1" />
                  <line x1="7" y1="16" x2="13" y2="16" stroke="#F7F3EE" strokeWidth="1" />
                </svg>
              </div>
              <span className="text-lg font-bold text-ink">catered by me</span>
            </div>
            <p className="text-xs text-text-muted">
              Built for people who want to host and actually enjoy the party.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <button
                  onClick={() => scrollToSection("app-area")}
                  className="hover:text-ink transition-colors"
                >
                  The App
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  Recipe Library
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  Meal Prep Mode
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  Event Mode
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="hover:text-ink transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="hover:text-ink transition-colors"
                >
                  Contact
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* More Column */}
          <div>
            <h3 className="text-sm font-semibold text-ink mb-3">More</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ink transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/aluate/catered_by_me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} Catered By Me. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

