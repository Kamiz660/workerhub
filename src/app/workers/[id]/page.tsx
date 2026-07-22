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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RatingStars } from "@/components/shared/rating-stars";
import { ContactModal } from "@/components/shared/contact-modal";
import { getWorkerById, getReviewsByWorkerId } from "@/services/workers";
import type { Worker, Review } from "@/lib/types";
import { useLanguage } from "@/context/language-context";

interface WorkerProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function WorkerProfilePage({ params }: WorkerProfilePageProps) {
  const { t, language } = useLanguage();
  const { id } = use(params);
  const router = useRouter();
  const [contactOpen, setContactOpen] = useState(false);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            {language === "en" ? "Worker Profile Not Found" : "തൊഴിലാളിയെ കണ്ടെത്താനായില്ല"}
          </h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            {language === "en"
              ? "The worker profile you're looking for doesn't exist or has been removed."
              : "നിങ്ങൾ തിരയുന്ന പ്രൊഫൈൽ നിലവിലില്ല."}
          </p>
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6">
              {language === "en" ? "Browse Local Workers" : "തൊഴിലാളികളെ തിരയുക"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const initials = worker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const locationDisplay =
    language === "ml" && worker.location === "Koothattukulam"
      ? "കൂത്താട്ടുകുളം"
      : worker.location;

  const professionDisplay =
    language === "ml"
      ? t(`categories.${worker.category.toLowerCase()}`)
      : worker.profession.replace(/^Master\s+/i, "");

  const firstName = worker.name.split(" ")[0];

  const experienceSubtext =
    worker.experience !== null && worker.experience !== undefined
      ? language === "en"
        ? `${worker.experience} ${worker.experience === 1 ? "year" : "years"} experience`
        : `${worker.experience} വർഷത്തെ പരിചയം`
      : null;

  const jobsCompletedSubtext =
    language === "en"
      ? `${worker.jobsCompleted} jobs completed`
      : `${worker.jobsCompleted} ജോലികൾ പൂർത്തിയാക്കി`;

  const cleanPhone = worker.phone.replace(/\D/g, "");

  return (
    <>
      <div className="min-h-screen bg-slate-50/50 pb-24 sm:pb-12 text-slate-900">
        {/* Sticky Nav Header (Airbnb standard minimalist back bar) */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors py-2 pr-3 cursor-pointer"
              id="back-button"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{language === "en" ? "Back" : "തിരികെ"}</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{worker.available ? t("card.availableNow") : t("card.unavailable")}</span>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
          {/* 1. Worker Hero Section (Trust & Authority Focus) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-7">
              {/* Profile Avatar */}
              <div className="relative shrink-0 mx-auto sm:mx-0">
                {worker.image ? (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={worker.image}
                      alt={worker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-3xl">
                    {initials}
                  </div>
                )}
                {worker.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md border border-slate-100" title="Verified Worker">
                    <BadgeCheck className="h-6 w-6 text-primary fill-primary/10" />
                  </div>
                )}
              </div>

              {/* Identity & Rating Info */}
              <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {worker.name}
                      </h1>
                      {worker.verified && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {t("card.verified")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-base sm:text-lg font-bold text-primary mt-0.5">
                      {professionDisplay}
                    </p>
                    <div className="mt-2 flex items-center justify-center sm:justify-start">
                      <RatingStars
                        rating={worker.rating}
                        reviewCount={worker.reviewCount}
                        size="md"
                      />
                    </div>
                  </div>

                  {/* Hourly Rate Badge */}
                  <div className="text-center sm:text-right mt-1 sm:mt-0">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {worker.hourlyRate !== null && worker.hourlyRate !== undefined ? (
                        <>
                          ₹{worker.hourlyRate}
                          <span className="text-xs font-medium text-slate-500 ml-1">
                            /hr
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full inline-block">
                          {language === "en" ? "Contact for rates" : "നിരക്കുകൾക്കായി വിളിക്കുക"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Trust Key Chips */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4 text-xs font-medium text-slate-600 border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {locationDisplay}
                  </span>

                  {experienceSubtext && (
                    <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl">
                      <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                      {experienceSubtext}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {jobsCompletedSubtext}
                  </span>
                </div>

                {/* Desktop Primary Action CTAs */}
                <div className="mt-6 hidden sm:flex items-center gap-3">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-7 h-11 flex items-center gap-2 cursor-pointer shadow-sm"
                    onClick={() => setContactOpen(true)}
                    id="profile-contact-btn"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{language === "en" ? `Call ${firstName}` : `${firstName}-നെ വിളിക്കുക`}</span>
                  </Button>

                  <a
                    href={`https://wa.me/91${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold h-11 px-6 rounded-xl transition-all shadow-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 2. About Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              {language === "en" ? `About ${firstName}` : "വിശദവിവരങ്ങൾ"}
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {worker.bio || (language === "en" 
                ? `${worker.name} is a experienced ${professionDisplay} serving clients in ${locationDisplay} and nearby regions. Available for direct calls and enquiries.`
                : `${worker.name} ${locationDisplay} പ്രദേശത്ത് പ്രവർത്തിക്കുന്ന അനുഭവസമ്പന്നനായ ഒരു ${professionDisplay} ആണ്.`)}
            </p>
          </div>

          {/* 3. Services Offered Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              {language === "en" ? "Services Offered" : "പ്രധാന സേവനങ്ങൾ"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {worker.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2.5 bg-slate-50/70 border border-slate-200/60 p-3 rounded-xl text-slate-800 font-medium text-xs sm:text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Trust & Safety Information (Airbnb Trust Standard) */}
          <div className="bg-gradient-to-br from-primary/5 via-slate-50 to-emerald-50/40 rounded-2xl border border-slate-200/80 p-6 sm:p-8">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              {language === "en" ? `Why hire ${firstName} with confidence` : "വിശ്വാസ്യതയുടെ കാരണങ്ങൾ"}
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="bg-white/90 backdrop-blur-xs border border-slate-200/60 p-4 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-primary" />
                  Phone Verified
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Contact details verified for direct client communications.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs border border-slate-200/60 p-4 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  100% Direct Calls
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  No middleman agency fees or hidden booking charges.
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs border border-slate-200/60 p-4 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-700" />
                  Local Community Member
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Operating locally in {locationDisplay} for neighborhood jobs.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Customer Reviews Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  {language === "en" ? "Customer Reviews" : "അഭിപ്രായങ്ങൾ"} ({reviews.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Feedback from clients who hired {firstName}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900 leading-none">
                  {worker.rating.toFixed(1)}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">out of 5.0</div>
              </div>
            </div>

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
              <p className="text-xs sm:text-sm text-slate-500">
                {language === "en" ? "No customer reviews published yet." : "അഭിപ്രായങ്ങൾ ലഭ്യമല്ല."}
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Sticky Bottom Contact Bar (Mobile First - Airbnb standard bottom action sheet) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 px-4 z-50 sm:hidden flex items-center gap-2 shadow-lg">
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer h-12 text-sm shadow-xs border-0"
          onClick={() => setContactOpen(true)}
          id="profile-contact-btn-mobile"
        >
          <Phone className="h-4 w-4" />
          <span>{language === "en" ? `Call ${firstName}` : `${firstName}-നെ വിളിക്കുക`}</span>
        </Button>

        <a
          href={`https://wa.me/91${cleanPhone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 w-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
          title="WhatsApp"
        >
          <MessageSquare className="h-5 w-5" />
        </a>
      </div>

      <ContactModal
        worker={worker}
        open={contactOpen}
        onOpenChange={setContactOpen}
      />
    </>
  );
}
