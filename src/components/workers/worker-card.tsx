"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, BadgeCheck, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { ContactModal } from "@/components/shared/contact-modal";
import type { Worker } from "@/lib/types";

interface WorkerCardProps {
  worker: Worker;
}

const getColorClasses = (category: string) => {
  const c = category.toLowerCase();
  if (c.includes("electrician")) {
    return {
      avatarBg: "bg-primary/20 text-primary",
      btn: "bg-primary/10 text-primary hover:bg-primary/20",
      iconColor: "text-primary"
    };
  } else if (c.includes("plumber")) {
    return {
      avatarBg: "bg-emerald-100 text-emerald-700",
      btn: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
      iconColor: "text-emerald-600"
    };
  } else if (c.includes("carpenter")) {
    return {
      avatarBg: "bg-purple-100 text-purple-700",
      btn: "bg-purple-50 text-purple-600 hover:bg-purple-100",
      iconColor: "text-purple-600"
    };
  } else if (c.includes("painter")) {
    return {
      avatarBg: "bg-orange-100 text-orange-700",
      btn: "bg-orange-50 text-orange-600 hover:bg-orange-100",
      iconColor: "text-orange-600"
    };
  } else {
    return {
      avatarBg: "bg-primary/20 text-primary",
      btn: "bg-primary/10 text-primary hover:bg-primary/20",
      iconColor: "text-primary"
    };
  }
};

export function WorkerCard({ worker }: WorkerCardProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const initials = worker.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const colors = getColorClasses(worker.category);

  return (
    <>
      <Card
        className="group hover:shadow-md hover:bg-primary/[0.02] hover:border-primary/30 transition-all duration-300 border border-gray-150 overflow-hidden bg-white rounded-2xl"
        id={`worker-card-${worker.id}`}
      >
        <CardContent className="p-0">
          <Link href={`/workers/${worker.id}`} className="block">
            <div className="p-5 pb-3">
              {/* Header: Avatar + Info */}
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className={`w-14 h-14 rounded-full ${colors.avatarBg} flex items-center justify-center font-bold text-lg`}>
                    {initials}
                  </div>
                  {worker.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                        {worker.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {worker.profession.replace(/^Master\s+/i, '')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {!worker.available && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-500 hover:bg-gray-100">
                          Unavailable
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    <RatingStars
                      rating={worker.rating}
                      reviewCount={worker.reviewCount}
                    />
                  </div>
                </div>
              </div>

              {/* Meta details */}
              <div className="flex items-center gap-4 mt-4 pt-2 border-t border-gray-50">
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  {worker.location}
                </span>
              </div>
            </div>
          </Link>

          {/* Call Now Action Button */}
          <div className="px-5 pb-5 pt-1">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 py-5 shadow-sm border-0"
              onClick={(e) => {
                e.preventDefault();
                setContactOpen(true);
              }}
              id={`contact-btn-${worker.id}`}
            >
              <Phone className="h-4 w-4" />
              Call Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <ContactModal
        worker={worker}
        open={contactOpen}
        onOpenChange={setContactOpen}
      />
    </>
  );
}
