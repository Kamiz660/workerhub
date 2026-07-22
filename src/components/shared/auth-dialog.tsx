"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

export type SignupIntent = "customer" | "worker";
export type AuthContextReason =
  | "general"
  | "add_worker"
  | "post_job"
  | "write_review";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "login" | "signup";
  initialIntent?: SignupIntent;
  contextReason?: AuthContextReason;
  onSuccess?: () => void;
}

export function AuthDialog({
  open,
  onOpenChange,
  initialMode = "signup",
  initialIntent = "customer",
  contextReason = "general",
  onSuccess,
}: AuthDialogProps) {
  const { login, signup } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [intent, setIntent] = useState<SignupIntent>(initialIntent);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setIntent(initialIntent);
    }
  }, [open, initialMode, initialIntent]);

  const resetForm = () => {
    setMode(initialMode);
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setSubmitting(false);
    setError(null);
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        const result = await login(email, password);
        if (result.success) {
          onSuccess?.();
          handleOpenChange(false);
        } else {
          setError(result.error);
        }
      } else {
        const result = await signup(name, email, password);
        if (result.success) {
          onSuccess?.();
          handleOpenChange(false);
        } else {
          setError(result.error);
        }
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const getSubtext = () => {
    if (contextReason !== "general") {
      switch (contextReason) {
        case "add_worker":
          return t("auth.contextAddWorker");
        case "post_job":
          return t("auth.contextPostJob");
        case "write_review":
          return t("auth.contextWriteReview");
      }
    }
    return mode === "login" ? t("auth.loginSubtext") : t("auth.signupSubtext");
  };

  const getBenefits = () => {
    if (intent === "worker") {
      return [
        t("auth.workerBenefit1"),
        t("auth.workerBenefit2"),
        t("auth.workerBenefit3"),
      ];
    }
    return [
      t("auth.customerBenefit1"),
      t("auth.customerBenefit2"),
      t("auth.customerBenefit3"),
    ];
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden rounded-2xl sm:grid sm:grid-cols-5 gap-0 border-0 shadow-2xl">
        {/* Desktop Visual Illustration Column */}
        <div className="hidden sm:flex sm:col-span-2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden flex-col justify-between p-7 select-none border-r border-slate-800">
          {/* Ambient micro-glows */}
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-primary/30 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Top Brand Mark */}
          <div className="relative z-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md shadow-primary/40">
              W
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">
              WorkerHub
            </span>
          </div>

          {/* Center SaaS Micro Visual Card */}
          <div className="relative z-10 my-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-bold tracking-wide uppercase text-slate-200">
                  Local Network
                </span>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2 overflow-hidden">
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-primary/50 text-white text-xs font-bold flex items-center justify-center">
                  P
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  E
                </div>
                <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                  C
                </div>
              </div>
              <div className="text-xs">
                <p className="font-bold text-white leading-none">
                  {intent === "worker" ? "Receive Enquiries" : "500+ Verified Workers"}
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  {intent === "worker" ? "Direct calls from locals" : "Call & chat directly"}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              100% Direct & Always Free
            </span>
          </div>
        </div>

        {/* Auth Form Column */}
        <div className="sm:col-span-3 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            <DialogHeader className="text-center sm:text-left pb-1">
              <div className="mx-auto w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2 sm:hidden">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {mode === "login"
                  ? t("auth.welcomeBack")
                  : t("auth.signupTitle")}
              </DialogTitle>
              <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                {getSubtext()}
              </p>
            </DialogHeader>

            {/* Intent Segment Control & Benefits Card: ONLY in Signup Mode */}
            {mode === "signup" && (
              <div className="mt-4 space-y-3">
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setIntent("customer")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      intent === "customer"
                        ? "bg-white text-primary shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t("auth.intentCustomer")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntent("worker")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      intent === "worker"
                        ? "bg-white text-primary shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {t("auth.intentWorker")}
                  </button>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3">
                  <ul className="space-y-1.5">
                    {getBenefits().map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs font-medium text-slate-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              {error && (
                <div
                  role="alert"
                  aria-live="polite"
                  className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-xl font-medium"
                >
                  {error}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="auth-name-input"
                    className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
                  >
                    {t("auth.nameLabel")}
                  </label>
                  <Input
                    id="auth-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    autoComplete="name"
                    required
                    disabled={submitting}
                    className="h-11 rounded-xl border-slate-200/90 bg-slate-50/60 focus:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 text-slate-900 text-sm placeholder:text-slate-400"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email-input"
                  className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1.5"
                >
                  {t("auth.emailLabel")}
                </label>
                <Input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  disabled={submitting}
                  className="h-11 rounded-xl border-slate-200/90 bg-slate-50/60 focus:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 text-slate-900 text-sm placeholder:text-slate-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="auth-password-input"
                    className="text-[11px] font-bold uppercase tracking-wider text-slate-700"
                  >
                    {t("auth.passwordLabel")}
                  </label>
                  {mode === "login" && (
                    <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">
                      {t("auth.forgotPassword")}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="auth-password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    required
                    disabled={submitting}
                    className="h-11 rounded-xl border-slate-200/90 bg-slate-50/60 focus:bg-white pr-10 focus-visible:ring-2 focus-visible:ring-primary/20 text-slate-900 text-sm placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    aria-label={t("auth.togglePassword")}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="h-11 w-full bg-primary hover:bg-primary/95 text-white rounded-xl font-bold cursor-pointer border-0 mt-2 shadow-md shadow-primary/20 active:scale-[0.99] transition-all text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                    {mode === "login"
                      ? t("auth.submittingLogin")
                      : t("auth.submittingSignup")}
                  </>
                ) : mode === "login" ? (
                  t("auth.loginSubmit")
                ) : (
                  t("auth.signupSubmit")
                )}
              </Button>

              <div className="text-center pt-3 border-t border-slate-100 flex flex-col gap-1">
                <div className="text-xs text-slate-500 font-medium">
                  <span>
                    {mode === "login"
                      ? t("auth.noAccount")
                      : t("auth.alreadyAccount")}{" "}
                  </span>
                  <button
                    type="button"
                    onClick={toggleMode}
                    disabled={submitting}
                    className="text-primary font-bold hover:underline cursor-pointer bg-transparent border-0 p-0 inline"
                  >
                    {mode === "login"
                      ? t("auth.switchToSignup")
                      : t("auth.switchToLogin")}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t("auth.termsNotice")}
                </p>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
