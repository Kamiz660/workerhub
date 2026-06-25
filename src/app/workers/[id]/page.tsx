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

interface WorkerProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function WorkerProfilePage({ params }: WorkerProfilePageProps) {
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
          // Reviews are still static from mock data for now
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
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-500">Loading profile...</span>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Worker not found
          </h1>
          <p className="text-gray-500 mb-4">
            The worker you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/workers">
            <Button>Browse Workers</Button>
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

  return (
    <>
      <div className="min-h-screen bg-gray-50/30 pb-24 sm:pb-0">
        {/* Back nav */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors min-h-[44px] -ml-2 pl-2 pr-3"
              id="back-button"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
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
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl sm:text-3xl">
                    {initials}
                  </div>
                )}
                {worker.verified && (
                  <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 bg-white rounded-full p-0.5 sm:p-1 shadow-sm">
                    <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {worker.name}
                      </h1>
                      {worker.verified && (
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mt-1">
                      {worker.profession}
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
                    <div className="text-2xl font-bold text-gray-900">
                      {worker.hourlyRate !== null && worker.hourlyRate !== undefined ? (
                        <>
                          ₹{worker.hourlyRate}
                          <span className="text-base text-gray-400 font-normal">
                            /hr
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold text-gray-600 mt-1 block">
                          Contact for rates
                        </span>
                      )}
                    </div>
                    <Badge
                      variant={worker.available ? "default" : "secondary"}
                      className={
                        worker.available
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : ""
                      }
                    >
                      {worker.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>

                {/* Meta stats */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {worker.location}
                  </span>
                  {worker.experience !== null && worker.experience !== undefined && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {worker.experience} {worker.experience === 1 ? "year" : "years"} experience
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {worker.jobsCompleted} jobs completed
                  </span>
                </div>

                {/* CTA (hidden on mobile — sticky bar handles it) */}
                <div className="mt-6 hidden sm:block">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                    onClick={() => setContactOpen(true)}
                    id="profile-contact-btn"
                  >
                    Contact {worker.name.split(" ")[0]}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{worker.bio}</p>
          </div>

          {/* Services */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {worker.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Reviews ({reviews.length})
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
                        <div className="font-medium text-gray-900 text-sm">
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
                    <p className="text-sm text-gray-600 ml-11">
                      {review.comment}
                    </p>
                    <Separator className="mt-6" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 px-4 z-50 sm:hidden">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          onClick={() => setContactOpen(true)}
          id="profile-contact-btn-mobile"
        >
          <Phone className="h-4 w-4" />
          Contact {worker.name.split(" ")[0]} — Call Now
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
