"use client";

import Link from "next/link";
import { MapPin, BadgeCheck, Phone, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getTelLink, getWhatsAppLink } from "@/lib/contact";
import type { Worker } from "@/lib/types";
import { useLanguage } from "@/context/language-context";

interface WorkerCardProps {
  worker: Worker;
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const { t, language } = useLanguage();
  const displayName = worker.name?.trim() || "Worker";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "W";

  // Location display with "· Nearby areas"
  const rawLocation = worker.location?.trim() || "Koothattukulam";
  const locationDisplay = language === "ml"
    ? `${rawLocation === "Koothattukulam" ? "കൂത്താട്ടുകുളം" : rawLocation} · സമീപ പ്രദേശങ്ങൾ`
    : `${rawLocation} · Nearby areas`;

  // Profession display
  const professionDisplay = worker.profession || "Electrician & Plumber";

  // Top services + Others
  const topServices = (worker.services || []).slice(0, 3);

  const telLink = getTelLink(worker.phone);
  const whatsAppLink = getWhatsAppLink(worker.phone);

  return (
    <Card
      className="group relative bg-white border border-slate-200/90 hover:border-primary/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
      id={`worker-card-${worker.id}`}
    >
      <div>
        {/* Top: Avatar + Name + Verified + Location */}
        <div className="flex items-start gap-4">
          <Link href={`/workers/${worker.id}`} className="relative flex-shrink-0 group/avatar">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100/70 border-2 border-primary/20 text-primary font-extrabold text-xl flex items-center justify-center shadow-xs group-hover/avatar:border-primary transition-all">
              {initials}
            </div>
            {worker.verified && (
              <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm" title="Verified Worker">
                <BadgeCheck className="h-5 w-5 text-primary fill-blue-50" />
              </div>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <div>
              <Link href={`/workers/${worker.id}`} className="block group-hover:text-primary transition-colors">
                <h3 className="font-bold text-gray-900 text-lg leading-snug tracking-tight hover:text-primary">
                  {displayName}
                </h3>
              </Link>
              <p className="text-sm font-semibold text-primary mt-0.5">
                {professionDisplay}
              </p>
            </div>

            {/* Location row with "· Nearby areas" */}
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{locationDisplay}</span>
            </div>
          </div>
        </div>

        {/* Live Availability Strip */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-700">
              {language === "en" ? "Available for calls & visits" : "നേരിട്ടുള്ള സേവനങ്ങൾക്ക് ലഭ്യമാണ്"}
            </span>
          </div>
        </div>

        {/* Services Chips with Others */}
        {topServices.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {topServices.map((service) => (
              <span
                key={service}
                className="text-[11px] font-medium bg-slate-50 border border-slate-200/70 text-slate-700 px-2.5 py-1 rounded-lg"
              >
                {service}
              </span>
            ))}
            <span className="text-[11px] font-medium bg-slate-50 border border-slate-200/70 text-slate-700 px-2.5 py-1 rounded-lg">
              {language === "en" ? "+ Others" : "+ മറ്റുള്ളവ"}
            </span>
          </div>
        )}
      </div>

      {/* Verification & Trust Badge Above CTA */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-start gap-2 text-[13px] font-bold text-primary bg-blue-50/90 border border-primary/20 rounded-xl py-1.5 px-3 select-none">
          <BadgeCheck className="h-4.5 w-4.5 text-primary fill-blue-100 flex-shrink-0" />
          <span>{language === "en" ? "Phone & Identity Verified" : "ഫോൺ & തിരിച്ചറിയൽ രേഖകൾ പരിശോധിച്ചത്"}</span>
        </div>

        {/* Action Buttons: Direct Call & WhatsApp */}
        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={telLink}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-sm py-2.5 px-3 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
            id={`call-btn-${worker.id}`}
          >
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{t("card.callNow")}</span>
          </a>
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 px-3 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
            id={`whatsapp-btn-${worker.id}`}
          >
            <MessageCircle className="h-4 w-4 flex-shrink-0" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </Card>
  );
}
