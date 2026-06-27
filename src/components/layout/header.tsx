"use client";

import Link from "next/link";
import { HardHat, LogIn } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3.5" id="header-logo">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <HardHat className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Worker<span className="text-primary">Hub</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Global login button */}
            <button
              id="header-login-btn"
              className="flex items-center justify-center text-gray-500 hover:text-primary/80 active:scale-95 transition-all p-1 cursor-pointer
                sm:bg-primary/5 sm:border sm:border-primary/15 sm:text-primary sm:hover:bg-primary/10 sm:px-3.5 sm:py-2 sm:rounded-xl sm:font-semibold sm:text-sm sm:gap-1.5"
            >
              <LogIn className="h-6 w-6 sm:h-4.5 sm:w-4.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Log In</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
