"use client";

import { Plus, UserPlus, Users, ChevronRight, ArrowRight } from "lucide-react";
import { EVENTS } from "@/lib/constants";
import { useLanguage } from "@/context/language-context";

/**
 * Mobile Dual CTA Banner
 */
export function MobileCtaBanner() {
  const { t } = useLanguage();
  const openModal = () =>
    window.dispatchEvent(new CustomEvent(EVENTS.OPEN_ADD_WORKER_MODAL));

  return (
    <div className="mt-4">
      <div className="bg-primary/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/[0.07]" />
        <div className="absolute -bottom-5 -left-5 w-20 h-20 rounded-full bg-white/[0.04]" />
        <div className="absolute top-1/2 right-8 w-12 h-12 rounded-full bg-white/[0.06]" />

        <div className="relative z-10">
          <h3 className="text-[15px] font-extrabold text-white leading-tight">
            {t("cta.title")}
          </h3>
          <p className="text-[12px] text-white/70 mt-1.5 leading-relaxed">
            {t("cta.subtitleMobile")}
          </p>

          <div className="mt-4 flex gap-2.5">
            <button
              className="flex-1 bg-white text-primary font-bold text-[13px] px-3 py-3 rounded-xl shadow-sm hover:shadow-md active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              onClick={openModal}
            >
              <Plus className="h-3.5 w-3.5" />
              {t("cta.listCardTitle")}
            </button>
            <button
              className="flex-1 bg-white/15 border border-white/20 text-white font-bold text-[13px] px-3 py-3 rounded-xl hover:bg-white/25 active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center gap-1.5"
              onClick={openModal}
            >
              <UserPlus className="h-3.5 w-3.5" />
              {t("cta.addCardTitle")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Desktop Dual CTA Banner
 */
export function DesktopCtaBanner() {
  const { t, language } = useLanguage();
  const openModal = () =>
    window.dispatchEvent(new CustomEvent(EVENTS.OPEN_ADD_WORKER_MODAL));

  return (
    <div className="w-full max-w-7xl mx-auto z-40 relative px-4 sm:px-6 lg:px-8 mt-2 sm:mt-8 mb-2">
      <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-200/80 transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        
        {/* Corner Glow Micro-Decorations */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-primary/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-slate-400/[0.04] blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-primary/[0.02] blur-2xl pointer-events-none" />

        {/* LEFT SIDE: Icon + Text */}
        <div className="flex items-center gap-5 lg:gap-6 flex-1 w-full relative z-10">
          {/* Big Icon */}
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white border border-slate-200/90 shadow-sm flex items-center justify-center flex-shrink-0 relative">
            <Users className="w-8 h-8 lg:w-9 lg:h-9 text-primary/80" />
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border-2 border-white shadow-sm">
              <Plus className="w-3 h-3 lg:w-3.5 lg:h-3.5" strokeWidth={3} />
            </div>
          </div>
          
          {/* Text */}
          <div className="flex-1 lg:pr-8 relative z-10">
            <h3 className="text-xl lg:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t("cta.title")}
            </h3>
            {language === "en" ? (
              <p className="text-[13px] lg:text-[14px] text-slate-500 mt-1 lg:mt-1.5 font-medium leading-relaxed">
                Add workers or list your own services.<br className="hidden lg:block" />
                Together, we build a stronger community.
              </p>
            ) : (
              <p className="text-[13px] lg:text-[14px] text-slate-500 mt-1 lg:mt-1.5 font-medium leading-relaxed">
                തൊഴിലാളികളെ ചേർക്കുക അല്ലെങ്കിൽ നിങ്ങളുടെ സ്വന്തം സേവനങ്ങൾ ചേർക്കുക.<br className="hidden lg:block" />
                നമുക്കൊരുമിച്ച് വളരാം.
              </p>
            )}
          </div>
        </div>

        {/* Gradient Divider (Stripe/Vercel style) */}
        <div className="hidden lg:block self-stretch w-px relative flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
        </div>

        {/* RIGHT SIDE: 2 Sub-Card Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full lg:w-[540px] relative z-10">
          
          {/* Button 1: Add a Worker */}
          <button 
            onClick={openModal}
            className="group/add relative flex-1 bg-white border border-slate-200 hover:border-primary/30 hover:bg-primary/[0.02] rounded-2xl p-5 text-left transition-all duration-150 ease-out active:scale-[0.98] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer"
          >
            {/* Mount Shimmer */}
            <div className="absolute inset-0 -translate-x-[200%] animate-[shimmer_2s_ease-in-out_0.8s_1_forwards] bg-gradient-to-r from-transparent via-slate-100/60 to-transparent pointer-events-none skew-x-12" />
            {/* Soft Glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover/add:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />

            <div className="flex items-start justify-between relative z-10 w-full">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  <span className="font-bold text-[14px] lg:text-[15px] text-primary">{t("cta.addCardTitle")}</span>
                </div>
              </div>
              {/* Arrow with momentum slide */}
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary flex items-center justify-center text-white transition-transform duration-300 group-hover/add:translate-x-1 relative flex-shrink-0">
                <ChevronRight className="w-4 h-4 transition-all duration-300 group-hover/add:opacity-0 group-hover/add:scale-75 absolute" />
                <ArrowRight className="w-4 h-4 transition-all duration-300 opacity-0 scale-75 group-hover/add:opacity-100 group-hover/add:scale-100 absolute" />
              </div>
            </div>
            {language === "en" ? (
              <p className="text-[12px] lg:text-[13px] text-slate-500 mt-3 font-medium leading-snug relative z-10">
                Know a skilled worker?<br className="hidden lg:block"/>Add them to the community.
              </p>
            ) : (
              <p className="text-[12px] lg:text-[13px] text-slate-500 mt-3 font-medium leading-snug relative z-10">
                നിങ്ങൾക്ക് പരിചയമുള്ള വിദഗ്ദ്ധ തൊഴിലാളികളുണ്ടോ?<br className="hidden lg:block"/>അവരെ ഇതിലേക്ക് ചേർക്കൂ.
              </p>
            )}
            {/* Friction label below subtext */}
            <div className="text-[11px] font-bold text-primary mt-2 relative z-10">
              {t("common.oneMin")}
            </div>
          </button>

          {/* Button 2: List Yourself */}
          <button 
            onClick={openModal}
            className="group/list relative flex-1 bg-[#f5f8fc] border border-transparent rounded-2xl p-5 text-left transition-all duration-150 ease-out active:scale-[0.98] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer"
          >
            {/* Mount Shimmer */}
            <div className="absolute inset-0 -translate-x-[200%] animate-[shimmer_2s_ease-in-out_0.5s_1_forwards] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none skew-x-12" />
            {/* Soft Glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover/list:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/[0.04] to-transparent pointer-events-none" />

            <div className="flex items-start justify-between relative z-10 w-full">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  <span className="font-bold text-[14px] lg:text-[15px] text-primary">{t("cta.listCardTitle")}</span>
                </div>
              </div>
              {/* Arrow with momentum slide */}
              <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-primary flex items-center justify-center text-white transition-transform duration-300 group-hover/list:translate-x-1 relative flex-shrink-0">
                <ChevronRight className="w-4 h-4 transition-all duration-300 group-hover/list:opacity-0 group-hover/list:scale-75 absolute" />
                <ArrowRight className="w-4 h-4 transition-all duration-300 opacity-0 scale-75 group-hover/list:opacity-100 group-hover/list:scale-100 absolute" />
              </div>
            </div>
            {language === "en" ? (
              <p className="text-[12px] lg:text-[13px] text-slate-500 mt-3 font-medium leading-snug relative z-10">
                Offer your services and get<br className="hidden lg:block"/>discovered by locals.
              </p>
            ) : (
              <p className="text-[12px] lg:text-[13px] text-slate-500 mt-3 font-medium leading-snug relative z-10">
                നിങ്ങളുടെ സേവനങ്ങൾ ഇവിടെ ചേർത്ത്<br className="hidden lg:block"/>കൂടുതൽ ആളുകളിലേക്ക് എത്തൂ.
              </p>
            )}
            {/* Friction label below subtext */}
            <div className="text-[11px] font-bold text-emerald-600 mt-2 relative z-10">
              {t("common.alwaysFree")}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
