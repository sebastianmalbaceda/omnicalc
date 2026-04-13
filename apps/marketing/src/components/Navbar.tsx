'use client';

import Link from 'next/link';
import { useState } from 'react';

const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3002';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-200 dark:border-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl text-[#392cc1] dark:text-[#c3c0ff]">⊞</span>
            <span className="text-xl font-extrabold tracking-tighter text-[#392cc1] dark:text-[#c3c0ff]">
              OmniCalc
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-[#392cc1] dark:hover:text-[#c3c0ff] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/downloads"
              className="text-sm font-medium hover:text-[#392cc1] dark:hover:text-[#c3c0ff] transition-colors"
            >
              Downloads
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium hover:text-[#392cc1] dark:hover:text-[#c3c0ff] transition-colors"
            >
              Sign In
            </Link>
            <a
              href={WEB_APP_URL}
              className="px-4 py-2 bg-[#392cc1] hover:bg-[#534ad9] text-white text-sm font-semibold rounded-full transition-colors"
            >
              Try Free
            </a>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-[#1a1a2e]">
            <div className="flex flex-col gap-4">
              <Link
                href="/pricing"
                className="text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/downloads"
                className="text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Downloads
              </Link>
              <Link
                href="/sign-in"
                className="text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <a
                href={WEB_APP_URL}
                className="px-4 py-2 bg-[#392cc1] text-white text-sm font-semibold rounded-full text-center"
                onClick={() => setMobileOpen(false)}
              >
                Try Free
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
