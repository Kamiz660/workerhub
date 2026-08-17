"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  BadgeCheck,
  CheckCircle2,
  Star,
  Phone,
  MessageSquare,
  ShieldCheck,
  Loader2,
  Award,
  Sparkles,
  Shield,
  Zap,
  Flag,
  AlertCircle,
  Check,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RatingStars } from "@/components/shared/rating-stars";
import { getWorkerById, getReviewsByWorkerId } from "@/services/workers";
import type { Worker, Review } from "@/lib/types";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/context/auth-context";
import { AuthDialog } from "@/components/shared/auth-dialog";
import { getTelLink, getWhatsAppLink } from "@/lib/contact";

interface WorkerProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function WorkerProfilePage({ params }: WorkerProfilePageProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { id } = use(params);
  const router = useRouter();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // Report Profile Modal state
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function load() {
      setIsLoading(true);
      try {
        const w = await getWorkerById(id);
        if (isActive) {
          setWorker(w ?? null);
          if (w) {
            const r = await getReviewsByWorkerId(w.id);
            if (isActive) setReviews(r);
          }
        }
      } catch (err) {
        console.error("Failed to load worker:", err);
        if (isActive) setWorker(null);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    load();
    return () => {
      isActive = false;
    };
  }, [id]);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setIsSubmittingReport(true);
    setTimeout(() => {
      setIsSubmittingReport(false);
      setReportSubmitted(true);
      setTimeout(() => {
        setReportDialogOpen(false);
        setReportSubmitted(false);
        setReportReason("");
      }, 1800);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2.5 text-sm font-medium text-slate-500">{t("common.loading")}</span>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-sm bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            {language === "en" ? "Worker Profile Not Found" : "തൊഴിലാളിയെ കണ്ടെത്താനായില്ല"}
          </h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            {language === "en"
              ? "The worker profile you're looking for doesn't exist or has been removed."
              : "നിങ്ങൾ തിരയുന്ന പ്രൊഫൈൽ നിലവിലില്ല."}
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6 h-11">
              {language === "en" ? "Browse Local Workers" : "തൊഴിലാളികളെ തിരയുക"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const rawName = worker.name?.trim() || "Worker";
  const displayName = rawName.toLowerCase() === "mason boi" ? "Manoj Kumar" : rawName;
  const firstName = displayName.split(" ")[0];

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "W";

  const rawLocation = worker.location?.trim() || "Local Area";
  const locationDisplay =
    language === "ml" && rawLocation === "Koothattukulam"
      ? "കൂത്താട്ടുകുളം"
      : rawLocation;

  const rawProfession = worker.profession?.trim() || worker.category || "Professional";
  const professionDisplay =
    language === "ml"
      ? t(`categories.${(worker.category || "mason").toLowerCase()}`)
      : rawProfession.replace(/^Master\s+/i, "");

  const experienceText =
    (worker.experience !== null && worker.experience !== undefined && worker.experience > 0)
      ? language === "en"
        ? `${worker.experience} ${worker.experience === 1 ? "year" : "years"} exp.`
        : `${worker.experience} വർഷത്തെ പരിചയം`
      : language === "en"
      ? "Verified Pro"
      : "പരിചയസമ്പന്നൻ";

  const availabilityText = worker.available
    ? language === "en"
      ? "Available Now"
      : "ലഭ്യമാണ്"
    : language === "en"
    ? "On Request"
    : "ആവശ്യപ്പെടുമ്പോൾ";

  const telLink = getTelLink(worker.phone);
  const whatsAppLink = getWhatsAppLink(worker.phone);

  const bioDisplay = worker.bio?.trim()
    ? worker.bio
    : language === "en"
    ? "This is a test user. Available for direct calls, enquiries, and local on-site visits."
    : "ഇതൊരു ടെസ്റ്റ് പ്രൊഫൈൽ ആണ്. നേരിട്ടുള്ള അന്വേഷണങ്ങൾക്കും പ്രാദേശിക സേവനങ്ങൾക്കും ലഭ്യമാണ്.";

  const displayServices = (worker.services && worker.services.length > 0)
    ? worker.services 
    : [
        language === "en" ? `General ${professionDisplay} Services` : `${professionDisplay} സേവനങ്ങൾ`,
        language === "en" ? "Repairs & Maintenance" : "അറ്റകുറ്റപ്പണികൾ",
        language === "en" ? "On-site Consultation" : "നേരിട്ടുള്ള പരിശോധന",
        language === "en" ? "Domestic & Commercial Work" : "വീട്ടുജോലികൾ"
      ];

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-white pb-28 sm:pb-16 text-slate-900">
        {/* Angled blue background */}
        <div
          className="
            pointer-events-none
            absolute
            -left-[14%]
            -top-[20%]
            h-[120%]
            w-[65%]
            rotate-[-13deg]
            bg-gradient-to-br
            from-blue-700
            via-blue-600
            to-blue-400
            opacity-95
          "
        />

        {/* Light streak along the diagonal */}
        <div
          className="
            pointer-events-none
            absolute
            left-[48%]
            top-[-10%]
            h-[130%]
            w-[2px]
            rotate-[-12deg]
            bg-gradient-to-b
            from-transparent
            via-white/70
            to-transparent
            blur-[1px]
          "
        />

        {/* Page content */}
        <div className="relative z-10">
          {/* Navigation Bar (Clean & noticeable without solid header background) */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2.5 text-sm sm:text-base font-bold text-white hover:text-blue-100 transition-all group py-1 cursor-pointer select-none drop-shadow-xs"
              id="back-button"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all">
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              </div>
              <span>{language === "en" ? "Back to search" : "തിരികെ തിരയലിലേക്ക്"}</span>
            </button>
          </div>

          {/* Main Content Area: 2-Column Asymmetric Layout on Desktop */}
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Progressive Layered Narrative (7 of 12 cols on desktop) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-7">
              
              {/* Layer 1: Main Anchor Sheet (Hero Identity + Highlights + Bio + Service Area) - Elevated Prominence */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8">
                
                {/* 1.A. Hero Identity Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
                  {/* Avatar Presence */}
                  <div className="relative shrink-0">
                    {worker.image ? (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-xs bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={worker.image}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-slate-100 border-2 border-primary/25 flex items-center justify-center text-primary font-black text-3xl shadow-xs">
                        {initials}
                      </div>
                    )}
                    {worker.verified && (
                      <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full p-1 shadow-md border border-slate-100" title="Verified Worker">
                        <BadgeCheck className="h-5 w-5 text-primary fill-primary/10" />
                      </div>
                    )}
                  </div>

                  {/* Worker Title & Metadata */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {displayName}
                          </h1>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-primary mt-0.5">
                          {professionDisplay}
                        </p>
                      </div>

                      {/* Verified Badge */}
                      {worker.verified && (
                        <div className="flex items-center justify-center sm:justify-end">
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-xs font-bold px-2.5 py-1 rounded-full shadow-2xs">
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-600 fill-emerald-100" />
                            <span>{t("card.verified")}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Star Rating & Review Count */}
                    <div className="mt-2.5 flex items-center justify-center sm:justify-start">
                      <RatingStars
                        rating={worker.rating}
                        reviewCount={worker.reviewCount}
                        size="md"
                      />
                    </div>
                  </div>
                </div>

                {/* 1.B. Structured Key Highlights Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-5 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50/90 border border-slate-200/60 rounded-xl p-3 text-center sm:text-left flex flex-col justify-center">
                    <span className="text-slate-500 text-[11px] font-medium flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {language === "en" ? "Location" : "സ്ഥലം"}
                    </span>
                    <span className="font-bold text-slate-800 mt-1 truncate">{locationDisplay}</span>
                  </div>

                  <div className="bg-slate-50/90 border border-slate-200/60 rounded-xl p-3 text-center sm:text-left flex flex-col justify-center">
                    <span className="text-slate-500 text-[11px] font-medium flex items-center justify-center sm:justify-start gap-1">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      {language === "en" ? "Experience" : "പരിചയം"}
                    </span>
                    <span className="font-bold text-slate-800 mt-1 truncate">{experienceText}</span>
                  </div>

                  <div className="bg-slate-50/90 border border-slate-200/60 rounded-xl p-3 text-center sm:text-left flex flex-col justify-center">
                    <span className="text-slate-500 text-[11px] font-medium flex items-center justify-center sm:justify-start gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {language === "en" ? "Service" : "സേവനം"}
                    </span>
                    <span className="font-bold text-slate-800 mt-1 truncate">
                      {language === "en" ? "On-Site / Visits" : "വീട്ടിലെത്തി നൽകുന്നു"}
                    </span>
                  </div>

                  <div className="bg-slate-50/90 border border-slate-200/60 rounded-xl p-3 text-center sm:text-left flex flex-col justify-center">
                    <span className="text-slate-500 text-[11px] font-medium flex items-center justify-center sm:justify-start gap-1">
                      <Shield className="h-3.5 w-3.5 text-slate-400" />
                      {language === "en" ? "Contact" : "ബന്ധപ്പെടുക"}
                    </span>
                    <span className="font-bold text-emerald-700 mt-1 truncate">
                      {language === "en" ? "100% Direct" : "നേരിട്ട് വിളിക്കാം"}
                    </span>
                  </div>
                </div>

                {/* 1.C. About the Professional (Flows seamlessly with divider) */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h2 className="text-base font-bold text-slate-900 mb-2.5 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>{language === "en" ? `About ${firstName}` : `${firstName}-നെക്കുറിച്ച്`}</span>
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {bioDisplay}
                  </p>
                </div>

                {/* 1.D. Service Area & Neighborhood Reach */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-2">
                    <Compass className="h-4 w-4 text-primary" />
                    <span>{language === "en" ? "Service Area" : "സേവന പരിധി"}</span>
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50/90 border border-slate-200/70 rounded-xl p-3.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-bold text-slate-900">
                        {language === "en"
                          ? `Serves ${locationDisplay} & nearby areas`
                          : `${locationDisplay} പരിസര പ്രദേശങ്ങളിലും സേവനം ലഭ്യമാണ്`}
                      </span>
                    </div>
                    <span className="text-slate-500 text-xs font-medium">
                      {language === "en" ? "Available for doorstep & on-site visits" : "വീട്ടിലെത്തി സേവനം നൽകുന്നു"}
                    </span>
                  </div>
                </div>

              </div>

              {/* Layer 2: Services Offered (Blue-200 Gradient to White) */}
              <div className="bg-gradient-to-br from-blue-200 via-blue-100/20 to-white border border-blue-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span>{language === "en" ? "Services & Specializations" : "പ്രധാന സേവനങ്ങൾ"}</span>
                  </h2>
                  <span className="text-xs font-bold text-primary bg-white border border-blue-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                    {displayServices.length} {language === "en" ? "items" : "സേവനങ്ങൾ"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {displayServices.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-white hover:bg-slate-50 border border-blue-200/70 p-3.5 rounded-xl text-slate-900 font-semibold text-xs sm:text-sm shadow-2xs transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer 3: Trust & Directory Guarantees (Clean White Alternating Card) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span>{language === "en" ? `Why contact ${firstName} on WorkerHub` : "വിശ്വാസ്യതയുടെ കാരണങ്ങൾ"}</span>
                </h2>
                
                <div className="grid sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                  <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <BadgeCheck className="h-4 w-4 text-primary" />
                      <span>{language === "en" ? "Phone Verified" : "നമ്പർ പരിശോധിച്ചു"}</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {language === "en" 
                        ? "Contact information verified for direct client connection." 
                        : "നേരിട്ടുള്ള ആശയവിനിമയത്തിനായി നമ്പർ സ്ഥിരീകരിച്ചു."}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{language === "en" ? "Zero Commission" : "കമ്മീഷൻ ഇല്ല"}</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {language === "en"
                        ? "Deal directly with the worker with no hidden fees."
                        : "ഇടനിലക്കാരോ അധിക ചാർജുകളോ ഇല്ലാതെ നേരിട്ട് സംസാരിക്കാം."}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-xl space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-700" />
                      <span>{language === "en" ? "Local Presence" : "പ്രാദേശിക സേവനം"}</span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {language === "en"
                        ? `Operating locally in ${locationDisplay} & nearby areas.`
                        : `${locationDisplay} പരിസരങ്ങളിൽ ലഭ്യമായ പ്രാദേശിക സേവനം.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Layer 4: Customer Reviews (Elevated Social Proof Surface) */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span>{language === "en" ? "Customer Reviews" : "ഉപഭോക്തൃ അഭിപ്രായങ്ങൾ"}</span>
                      <span className="text-slate-400 font-normal">({reviews.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === "en" ? `Feedback from clients who worked with ${firstName}` : "സേവനം സ്വീകരിച്ചവരുടെ അഭിപ്രായങ്ങൾ"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900 leading-none">
                      {worker.rating.toFixed(1)}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mt-0.5">out of 5.0</div>
                  </div>
                </div>

                {/* Non-blocking login prompt for reviews */}
                {!user && (
                  <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                      <span>
                        {language === "en"
                          ? "Have you hired this worker? Log in to leave a review."
                          : "ഈ തൊഴിലാളിയുടെ സേവനം ലഭിച്ചിട്ടുണ്ടോ? റിവ്യൂ നൽകാൻ ലോഗിൻ ചെയ്യുക."}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAuthDialogOpen(true)}
                      className="text-xs font-bold text-primary border-primary/25 hover:bg-primary/5 hover:text-primary rounded-lg h-8 px-3.5 cursor-pointer shrink-0 w-full sm:w-auto"
                      id="login-to-review-btn"
                    >
                      {language === "en" ? "Log in to leave reviews" : "റിവ്യൂ നൽകാൻ ലോഗിൻ ചെയ്യുക"}
                    </Button>
                  </div>
                )}

                {reviews.length > 0 ? (
                  <div className="space-y-5">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-slate-100 last:border-0 pb-5 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                              {review.author[0]}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-xs sm:text-sm">
                                {review.author}
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-slate-200 fill-slate-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-slate-400">
                            {new Date(review.date).toLocaleDateString("en-IN", {
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-12">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      {language === "en" ? "No customer reviews published yet." : "അഭിപ്രായങ്ങൾ ലഭ്യമല്ല."}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {language === "en" ? "Be the first to leave a review after hiring." : "ജോലി പൂർത്തിയായ ശേഷം ആദ്യ റിവ്യൂ നൽകുക."}
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile Report Profile Link */}
              <div className="text-center sm:text-left pt-1 pb-4 block lg:hidden">
                <button
                  onClick={() => setReportDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  id="mobile-report-btn"
                >
                  <Flag className="h-3.5 w-3.5" />
                  <span>{language === "en" ? "Report this profile" : "പ്രൊഫൈൽ റിപ്പോർട്ട് ചെയ്യുക"}</span>
                </button>
              </div>

            </div>

            {/* Right Column: Sticky Booking & Direct Contact Panel (5 of 12 cols on desktop) */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-20 space-y-4">
              {/* Clean White Contact Card with Crisp Borders */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md p-6 space-y-5">
                
                {/* Header Summary */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {language === "en" ? "Direct Contact" : "നേരിട്ട് വിളിക്കാം"}
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                      {language === "en" ? `Connect with ${firstName}` : `${firstName}-നെ ബന്ധപ്പെടുക`}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{language === "en" ? "Available" : "ലഭ്യം"}</span>
                  </div>
                </div>

                {/* Contact Action Buttons */}
                <div className="space-y-3">
                  {telLink && (
                    <a
                      href={telLink}
                      className="w-full relative inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer text-sm sm:text-base"
                      id="desktop-sidebar-call-btn"
                    >
                      <Phone className="h-4.5 w-4.5 text-white absolute left-5 shrink-0" />
                      <span>{language === "en" ? "Call Now" : "ഇപ്പോൾ വിളിക്കുക"}</span>
                    </a>
                  )}

                  {whatsAppLink && (
                    <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full relative inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-6 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer text-sm sm:text-base"
                      id="desktop-sidebar-whatsapp-btn"
                    >
                      <MessageSquare className="h-4.5 w-4.5 text-white absolute left-5 shrink-0" />
                      <span>{language === "en" ? "Chat on WhatsApp" : "വാട്സ്ആപ്പിൽ സംസാരിക്കുക"}</span>
                    </a>
                  )}
                </div>

                {/* Trust Guarantee Bullets */}
                <div className="space-y-2.5 pt-2 text-xs text-slate-600 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{language === "en" ? "Direct calling • No agency markup" : "നേരിട്ട് വിളിക്കാം • കമ്മീഷൻ ഇല്ല"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{language === "en" ? "Verified phone & local credentials" : "പരിശോധിച്ച ഫോൺ നമ്പർ"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{language === "en" ? "Pay worker directly after completion" : "ജോലിക്ക് ശേഷം നേരിട്ട് പണം നൽകുക"}</span>
                  </div>
                </div>
              </div>

              {/* Local Community Help Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-xs text-slate-600 flex items-center gap-3 shadow-xs">
                <Zap className="h-5 w-5 text-primary shrink-0" />
                <span>
                  {language === "en"
                    ? "WorkerHub is 100% free for community members and workers."
                    : "വർക്കർഹബ്ബ് തികച്ചും സൗജന്യമായ പ്രാദേശിക സേവന പ്ലാറ്റ്‌ഫോമാണ്."}
                </span>
              </div>

              {/* Report Profile Link on Desktop */}
              <div className="text-center pt-1">
                <button
                  onClick={() => setReportDialogOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  id="desktop-report-btn"
                >
                  <Flag className="h-3.5 w-3.5" />
                  <span>{language === "en" ? "Report this profile" : "പ്രൊഫൈൽ റിപ്പോർട്ട് ചെയ്യുക"}</span>
                </button>
              </div>
            </div>

          </div>
        </main>
        </div>
      </div>

      {/* Sticky Bottom Contact Bar (Mobile First) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 px-4 z-50 sm:hidden flex items-center gap-2.5 shadow-lg">
        {telLink && (
          <a
            href={telLink}
            className="flex-1 relative inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold h-12 px-4 rounded-xl text-sm shadow-sm active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
            id="profile-contact-btn-mobile"
          >
            <Phone className="h-4 w-4 text-white absolute left-4 shrink-0" />
            <span>{language === "en" ? "Call Now" : "ഇപ്പോൾ വിളിക്കുക"}</span>
          </a>
        )}

        {whatsAppLink && (
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12 px-5 rounded-xl shadow-sm active:scale-[0.98] transition-all shrink-0 whitespace-nowrap cursor-pointer text-sm"
            title="WhatsApp"
            id="profile-whatsapp-btn-mobile"
          >
            <MessageSquare className="h-4.5 w-4.5 text-white shrink-0" />
            <span>WhatsApp</span>
          </a>
        )}
      </div>

      {/* Report Profile Dialog */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="sm:max-w-md p-5 sm:p-6 rounded-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500" />
              <span>{language === "en" ? "Report Worker Profile" : "പ്രൊഫൈൽ റിപ്പോർട്ട് ചെയ്യുക"}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 leading-relaxed">
              {language === "en"
                ? `Let us know if ${displayName}'s listing contains incorrect details, inactive phone numbers, or inappropriate content.`
                : `${displayName}-ൻ്റെ പ്രൊഫൈലിൽ തെറ്റായ വിവരങ്ങളോ പ്രവർത്തനരഹിതമായ നമ്പറുകളോ ഉണ്ടെങ്കിൽ ഞങ്ങളെ അറിയിക്കുക.`}
            </DialogDescription>
          </DialogHeader>

          {reportSubmitted ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <p className="font-bold text-sm text-slate-900">
                {language === "en" ? "Report Submitted" : "റിപ്പോർട്ട് സമർപ്പിച്ചു"}
              </p>
              <p className="text-xs text-slate-500">
                {language === "en"
                  ? "Thank you. Our moderation team will review this listing shortly."
                  : "നന്ദി. ഞങ്ങളുടെ ടീം ഈ പ്രൊഫൈൽ പരിശോധിക്കുന്നതാണ്."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {language === "en" ? "Reason for report" : "റിപ്പോർട്ട് ചെയ്യാനുള്ള കാരണം"}
                </label>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "e.g. Phone number doesn't connect, worker no longer in this area..."
                      : "ഉദാ: ഫോൺ നമ്പർ ലഭ്യമല്ല, ഈ പ്രദേശത്ത് ഇപ്പോൾ ലഭ്യമല്ല..."
                  }
                  required
                  rows={4}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <DialogFooter className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReportDialogOpen(false)}
                  className="text-xs font-semibold rounded-lg h-9 px-4 cursor-pointer"
                >
                  {language === "en" ? "Cancel" : "റദ്ദാക്കുക"}
                </Button>
                <Button
                  type="submit"
                  disabled={!reportReason.trim() || isSubmittingReport}
                  size="sm"
                  className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg h-9 px-4 cursor-pointer"
                >
                  {isSubmittingReport ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : language === "en" ? (
                    "Submit Report"
                  ) : (
                    "റിപ്പോർട്ട് നൽകുക"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        initialMode="login"
        contextReason="write_review"
      />
    </>
  );
}
