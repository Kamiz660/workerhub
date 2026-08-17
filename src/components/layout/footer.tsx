"use client";

import Link from "next/link";
import {
  HardHat,
  ShieldCheck,
  PhoneCall,
  MapPin,
  ArrowUpRight,
  Heart,
  Sparkles,
  CheckCircle2,
  Zap,
  Droplet,
  Hammer,
  Paintbrush,
  Wrench,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { EVENTS } from "@/lib/constants";

const popularServices = [
  { en: "Electricians", ml: "ഇലക്ട്രീഷ്യൻ", slug: "electrician", icon: Zap },
  { en: "Plumbers", ml: "പ്ലംബർ", slug: "plumber", icon: Droplet },
  { en: "Carpenters", ml: "കാർപെന്റർ", slug: "carpenter", icon: Hammer },
  { en: "Painters", ml: "പെയിന്റർ", slug: "painter", icon: Paintbrush },
  { en: "Technicians", ml: "ടെക്നീഷ്യൻ", slug: "technician", icon: Wrench },
  { en: "Masons & Builders", ml: "മേസൺ / നിർമ്മാണം", slug: "mason", icon: HardHat },
];

const serviceTowns = [
  { en: "Koothattukulam", ml: "കൂത്താട്ടുകുളം" },
];

export function Footer() {
  const { language } = useLanguage();

  const handleOpenAddWorker = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(EVENTS.OPEN_ADD_WORKER_MODAL));
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-blue-900 to-blue-950 text-slate-200 overflow-hidden border-t border-slate-800/80 mt-auto">
      {/* Ambient Top Glow */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-56 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(37,99,235,0.28),transparent)]" 
      />

      {/* Top Value Strip */}
      <div className="border-b border-slate-800/60 bg-black/25 backdrop-blur-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            {/* Live Network Pill */}
            <div className="flex items-center gap-2.5 bg-slate-800/90 border border-slate-700/60 px-3.5 py-1.5 rounded-full text-slate-200 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold">
                {language === "en" ? "Live Local Marketplace in Kerala" : "കേരളത്തിലെ തത്സമയ തൊഴിൽ പ്ലാറ്റ്‌ഫോം"}
              </span>
            </div>

            {/* Direct Value Props */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{language === "en" ? "100% Direct Calling" : "നേരിട്ട് വിളിക്കാം"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{language === "en" ? "Zero Commission" : "കമ്മീഷൻ ഇല്ല"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{language === "en" ? "Free for Community" : "സൗജന്യ സേവനം"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Hero CTA (5 of 12 cols on desktop) */}
          <div className="lg:col-span-4 space-y-5 text-center md:text-left flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                <HardHat className="h-5 w-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Worker<span className="text-blue-400">Hub</span>
              </span>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {language === "en"
                ? "Connecting homeowners and local businesses directly with skilled tradespeople in Koothattukulam and surrounding towns across Kerala."
                : "കൂത്താട്ടുകുളത്തും സമീപ പ്രദേശങ്ങളിലുമുള്ള വിശ്വസ്തരായ തൊഴിലാളികളെ ഇടനിലക്കാരില്ലാതെ കണ്ടെത്താനുള്ള പ്രാദേശിക പ്ലാറ്റ്‌ഫോം."}
            </p>

            {/* List Trade CTA Card */}
            <div className="w-full max-w-sm bg-slate-900/90 border border-slate-700/80 p-4 rounded-2xl shadow-sm text-left mt-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>{language === "en" ? "Are you a skilled worker?" : "നിങ്ങളൊരു തൊഴിലാളിയാണോ?"}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {language === "en"
                      ? "List yourself for free and get direct phone calls from local clients."
                      : "സൗജന്യമായി രജിസ്റ്റർ ചെയ്ത് നേരിട്ട് തൊഴിൽ അന്വേഷണങ്ങൾ നേടൂ."}
                  </p>
                </div>
              </div>
              <button
                onClick={handleOpenAddWorker}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer group active:scale-[0.98]"
                id="footer-list-worker-btn"
              >
                <span>{language === "en" ? "List Your Trade Free" : "സൗജന്യമായി പേര് ചേർക്കൂ"}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Column 2: Popular Categories (3 of 12 cols) */}
          <div className="lg:col-span-3 text-center md:text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center justify-center md:justify-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>{language === "en" ? "Popular Services" : "പ്രധാന സേവനങ്ങൾ"}</span>
            </h3>
            <ul className="space-y-2.5">
              {popularServices.map((service) => {
                const Icon = service.icon;
                return (
                  <li key={service.slug}>
                    <Link
                      href={`/workers?category=${service.slug}`}
                      className="group inline-flex items-center gap-2.5 text-sm text-slate-300 hover:text-white transition-colors"
                    >
                      <div className="w-6 h-6 rounded-md bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary/50 transition-colors">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform">
                        {language === "en" ? service.en : service.ml}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Service Town & Coverage Area (3 of 12 cols) */}
          <div className="lg:col-span-3 text-center md:text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center justify-center md:justify-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{language === "en" ? "Service Town" : "സേവന കേന്ദ്രം"}</span>
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
              {serviceTowns.map((town) => (
                <Link
                  key={town.en}
                  href={`/workers?search=${encodeURIComponent(town.en)}`}
                  className="inline-flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-xs transition-all shadow-2xs group"
                >
                  <MapPin className="h-3 w-3 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  <span>{language === "en" ? town.en : town.ml}</span>
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3.5">
              {language === "en"
                ? "Serving Koothattukulam & nearby local areas."
                : "കൂത്താട്ടുകുളത്തും സമീപ പ്രദേശങ്ങളിലും സേവനം ലഭ്യമാണ്."}
            </p>
          </div>

          {/* Column 4: Trust & Direct Connect (2 of 12 cols) */}
          <div className="lg:col-span-2 text-center md:text-left space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center justify-center md:justify-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{language === "en" ? "Direct Trust" : "സുരക്ഷിതത്വം"}</span>
            </h3>
            
            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="font-bold text-white flex items-center justify-center md:justify-start gap-1.5">
                  <PhoneCall className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{language === "en" ? "Direct Dial" : "നേരിട്ട് വിളിക്കുക"}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === "en" ? "No registration needed to call." : "രജിസ്ട്രേഷൻ ആവശ്യമില്ല."}
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                <div className="font-bold text-white flex items-center justify-center md:justify-start gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>{language === "en" ? "Community Driven" : "പ്രാദേശിക സേവനം"}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === "en" ? "Free for all community members." : "എല്ലാവർക്കും സൗജന്യം."}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} WorkerHub.</span>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1">
              <span>{language === "en" ? "Built for local communities" : "പ്രാദേശിക ആവശ്യങ്ങൾക്കായി"}</span>
              <Heart className="h-3 w-3 text-rose-400 fill-rose-400/80" />
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-default">
              {language === "en" ? "Koothattukulam, Kerala" : "കൂത്താട്ടുകുളം, കേരളം"}
            </span>
            <span className="hover:text-white transition-colors cursor-default">
              {language === "en" ? "Privacy & Terms" : "വ്യവസ്ഥകൾ"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
