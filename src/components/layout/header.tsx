"use client";

import { useState } from "react";
import Link from "next/link";
import { HardHat, User, LogOut } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import { AuthDialog } from "@/components/shared/auth-dialog";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { user, loading, logout } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
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
              {/* Sliding Language Segment Toggle */}
              <div className="relative flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200/50 w-20 h-[34px] select-none">
                <div 
                  className="absolute top-0.5 bottom-0.5 w-[36px] bg-white rounded-full shadow-sm border border-slate-200/30 transition-all duration-200 ease-out"
                  style={{ left: language === "en" ? "2px" : "40px" }}
                />
                <button
                  onClick={() => setLanguage("en")}
                  className={`flex-1 text-center text-xs font-bold z-10 transition-colors cursor-pointer select-none leading-none h-full ${language === "en" ? "text-primary" : "text-slate-500 hover:text-slate-700"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("ml")}
                  className={`flex-1 text-center text-xs font-bold z-10 transition-colors cursor-pointer select-none leading-none h-full ${language === "ml" ? "text-primary" : "text-slate-500 hover:text-slate-700"}`}
                >
                  അ
                </button>
              </div>

              {/* Auth state button / user badge */}
              {loading ? (
                <div
                  data-testid="header-auth-loading"
                  className="w-20 h-9 bg-slate-100 animate-pulse rounded-xl"
                />
              ) : user ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                    <span className="text-xs font-semibold text-gray-800 max-w-[100px] truncate hidden sm:inline">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => logout()}
                    id="header-logout-btn"
                    title={t("common.logout")}
                    className="flex items-center justify-center text-gray-500 hover:text-red-600 active:scale-95 transition-all p-2 rounded-xl border border-slate-200/80 hover:bg-red-50 hover:border-red-200 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} />
                    <span className="sr-only sm:not-sr-only sm:text-xs sm:font-semibold sm:ml-1.5">
                      {t("common.logout")}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  id="header-login-btn"
                  onClick={() => setAuthDialogOpen(true)}
                  className="flex items-center justify-center text-gray-500 hover:text-primary/80 active:scale-95 transition-all p-1 cursor-pointer
                    sm:bg-primary/5 sm:border sm:border-primary/15 sm:text-primary sm:hover:bg-primary/10 sm:px-3.5 sm:py-2 sm:rounded-xl sm:font-semibold sm:text-sm sm:gap-1.5"
                >
                  <User className="h-6 w-6 sm:h-4.5 sm:w-4.5" strokeWidth={1.5} />
                  <span className="hidden sm:inline">{t("common.login")}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode="login"
      />
    </>
  );
}
