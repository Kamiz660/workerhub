"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}

export function RatingStars({
  rating,
  reviewCount,
  size = "sm",
}: RatingStarsProps) {
  const starSize = size === "sm" ? 14 : 18;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const partial = !filled && star === Math.ceil(rating);
          const fillPercent = partial ? (rating % 1) * 100 : 0;

          return (
            <div key={star} className="relative">
              <Star
                size={starSize}
                className="text-gray-200"
                fill="currentColor"
              />
              {(filled || partial) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: filled ? "100%" : `${fillPercent}%` }}
                >
                  <Star
                    size={starSize}
                    className="text-amber-400"
                    fill="currentColor"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-gray-900">{rating}</span>
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500">({reviewCount})</span>
      )}
    </div>
  );
}
