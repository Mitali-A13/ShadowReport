"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl z-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">SafeReport</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/submit-report" className="text-sm text-zinc-400 hover:text-white">
                Submit Report
              </Link>
              <Link href="/track-report" className="text-sm text-zinc-400 hover:text-white">
                Track Report
              </Link>
              <Link href="/how-it-works" className="text-sm text-zinc-400 hover:text-white">
                How It Works
              </Link>
              <Link href="/resources" className="text-sm text-zinc-400 hover:text-white">
                Resources
              </Link>

              {/* 🔐 AUTH BUTTONS */}
              {!session ? (
                <>
                  <Link
                    href="/auth/signin"
                    className="text-sm text-blue-400 hover:text-white"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="px-3 py-1.5 text-sm rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm text-green-400 hover:text-white"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => signOut()}
                    className="px-3 py-1.5 text-sm rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Emergency + Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Link
                href="/contact"
                className="hidden md:block text-sm text-zinc-400 hover:text-white"
              >
                Contact
              </Link>

              <button className="group flex h-9 items-center gap-2 rounded-full bg-red-500/10 pl-4 pr-5 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 hover:bg-red-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                Emergency: 100
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-zinc-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Component */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
