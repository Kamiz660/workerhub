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
  Loader2,
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
    return () => { isActive = false; };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-gray-500">{t("common.loading")}</span>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {language === "en" ? "Worker not found" : "തൊഴിലാളിയെ കണ്ടെത്താനായില്ല"}
          </h1>
          <p className="text-gray-500 mb-4">
            {language === "en" 
              ? "The worker you're looking for doesn't exist." 
              : "നിങ്ങൾ തിരയുന്ന പ്രൊഫൈൽ നിലവിലില്ല."}
          </p>
          <Link href="/">
            <Button>{language === "en" ? "Browse Workers" : "തേടുക"}</Button>
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

  // Localize parameters
  const locationDisplay = language === "ml" && worker.location === "Koothattukulam" 
    ? "കൂത്താട്ടുകുളം"
    : worker.location;

  const professionDisplay = language === "ml"
    ? t(`categories.${worker.category.toLowerCase()}`)
    : worker.profession.replace(/^Master\s+/i, '');

  const firstName = worker.name.split(" ")[0];

  const experienceSubtext = worker.experience !== null && worker.experience !== undefined
    ? language === "en"
      ? `${worker.experience} ${worker.experience === 1 ? "year" : "years"} experience`
      : `${worker.experience} വർഷത്തെ പരിചയം`
    : "";

  const jobsCompletedSubtext = language === "en"
    ? `${worker.jobsCompleted} jobs completed`
    : `${worker.jobsCompleted} ജോലികൾ പൂർത്തിയാക്കി`;

  const contactButtonLabel = language === "en"
    ? `Contact ${firstName}`
    : `${firstName}-നെ ബന്ധപ്പെടുക`;

  const contactMobileLabel = language === "en"
    ? `Contact ${firstName} - Call Now`
    : `${firstName}-നെ വിളിക്കുക`;

  return (
    <>
      <div className="min-h-screen bg-gray-50/30 pb-24 sm:pb-0">
        {/* Back nav */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors min-h-[44px] -ml-2 pl-2 pr-3 cursor-pointer"
              id="back-button"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === "en" ? "Back" : "തിരികെ"}
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8">
            <div className="flex flex-row items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {worker.image ? (
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={worker.image}
                      alt={worker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold text-xl sm:text-3xl">
                    {initials}
                  </div>
                )}
                {worker.verified && (
                  <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 bg-white rounded-full p-0.5 sm:p-1 shadow-sm">
                    <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                        {worker.name}
                      </h1>
                      {worker.verified && (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold px-2 py-0.5 rounded-full">
                          {t("card.verified")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-gray-650 mt-1 font-semibold">
                      {professionDisplay}
                    </p>
                    <div className="mt-2">
                      <RatingStars
                        rating={worker.rating}
                        reviewCount={worker.reviewCount}
                        size="md"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className="text-2xl font-bold text-slate-900">
                      {worker.hourlyRate !== null && worker.hourlyRate !== undefined ? (
                        <>
                          ₹{worker.hourlyRate}
                          <span className="text-base text-gray-400 font-normal ml-0.5">
                            /hr
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-gray-600 block">
                          {language === "en" ? "Contact for rates" : "നിരക്കുകൾക്കായി വിളിക്കുക"}
                        </span>
                      )}
                    </div>
                    <Badge
                      variant={worker.available ? "default" : "secondary"}
                      className={
                        worker.available
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-bold px-2.5 py-0.5 rounded-full"
                          : "font-semibold px-2.5 py-0.5 rounded-full"
                      }
                    >
                      {worker.available ? t("card.availableNow") : t("card.unavailable")}
                    </Badge>
                  </div>
                </div>

                {/* Meta stats */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {locationDisplay}
                  </span>
                  {worker.experience !== null && worker.experience !== undefined && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      {experienceSubtext}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {jobsCompletedSubtext}
                  </span>
                </div>

                {/* CTA (hidden on mobile) */}
                <div className="mt-6 hidden sm:block">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-8 font-bold rounded-xl cursor-pointer"
                    onClick={() => setContactOpen(true)}
                    id="profile-contact-btn"
                  >
                    {contactButtonLabel}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-6">
            <h2 className="text-base font-bold text-gray-900 mb-3">
              {language === "en" ? "About" : "വിശദവിവരങ്ങൾ"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{worker.bio}</p>
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              {language === "en" ? "Services" : "പ്രധാന സേവനങ്ങൾ"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {worker.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-6">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              {language === "en" ? "Reviews" : "അഭിപ്രായങ്ങൾ"} ({reviews.length})
            </h2>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                        {review.author[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {review.author}
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-200 fill-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(review.date).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-650 ml-11 leading-relaxed">
                      {review.comment}
                    </p>
                    <Separator className="mt-6" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                {language === "en" ? "No reviews yet." : "അഭിപ്രായങ്ങൾ ലഭ്യമല്ല."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 px-4 z-50 sm:hidden">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => setContactOpen(true)}
          id="profile-contact-btn-mobile"
        >
          <Phone className="h-4 w-4" />
          {contactMobileLabel}
        </Button>
      </div>

      <ContactModal
        worker={worker}
        open={contactOpen}
        onOpenChange={setContactOpen}
      />
    </>
  );
}
