"use client";

import Link from "next/link";
import { HardHat, Plus } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center sm:justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" id="header-logo">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <HardHat className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Worker<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              id="header-list-btn"
              className="hidden sm:flex border border-blue-600/40 text-blue-600 font-medium text-sm rounded-lg items-center gap-1.5 px-3 py-1.5 transition-all bg-transparent hover:bg-blue-600 hover:text-white cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              List Your Service
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
