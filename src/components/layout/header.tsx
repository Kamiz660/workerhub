"use client";

import Link from "next/link";
import { HardHat, Plus, CircleUserRound } from "lucide-react";
import { EVENTS } from "@/lib/constants";

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
            <button
              id="header-list-btn"
              className="hidden sm:flex border border-primary/40 text-primary font-medium text-sm rounded-lg items-center gap-1.5 px-3 py-1.5 transition-all duration-150 ease-out active:scale-[0.98] bg-transparent hover:bg-primary hover:text-white cursor-pointer"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent(EVENTS.OPEN_ADD_WORKER_MODAL)
                )
              }
            >
              <Plus className="h-3.5 w-3.5" />
              List Your Service
            </button>

            {/* Mobile avatar/login button */}
            <button
              id="header-mobile-login-btn"
              className="sm:hidden flex items-center justify-center text-gray-500 active:scale-95 transition-all p-1"
            >
              <CircleUserRound className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
