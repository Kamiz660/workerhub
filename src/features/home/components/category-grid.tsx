"use client";

import {
  Zap,
  Droplet,
  Hammer,
  Paintbrush,
  Wrench,
  Sparkles,
  Landmark,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface CategoryButton {
  id: string;
  icon: LucideIcon;
}

const categoryButtons: CategoryButton[] = [
  { id: "electrician", icon: Zap },
  { id: "plumber", icon: Droplet },
  { id: "carpenter", icon: Hammer },
  { id: "painter", icon: Paintbrush },
  { id: "mechanic", icon: Wrench },
  { id: "cleaner", icon: Sparkles },
  { id: "mason", icon: Landmark },
  { id: "more", icon: LayoutGrid },
];

interface CategoryGridProps {
  /** Callback when a category is selected (receives category label) */
  onCategorySelect: (label: string) => void;
  /** Callback when "More" is tapped - focuses the job input */
  onMoreClick: () => void;
  /** Whether a location has been set (guards category selection) */
  hasLocation: boolean;
  /** Callback when category tapped without a location set */
  onLocationRequired: () => void;
}

/**
 * Popular Services - Mobile Category Grid
 */
export function MobileCategoryGrid({
  onCategorySelect,
  onMoreClick,
  hasLocation,
  onLocationRequired,
}: CategoryGridProps) {
  const { t, language } = useLanguage();

  return (
    <div className="mt-8 mb-4">
      <h2 className="text-sm font-bold text-gray-900 tracking-tight mb-3">
        {language === "en" ? "Popular Services" : "പ്രധാന സേവനങ്ങൾ"}
      </h2>
      <div className="grid grid-cols-4 gap-2">
        {categoryButtons.map((cat) => {
          const isMore = cat.id === "more";
          const label = isMore 
            ? (language === "en" ? "More" : "കൂടുതൽ")
            : t(`categories.${cat.id}`);

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (isMore) {
                  onMoreClick();
                } else {
                  if (!hasLocation) {
                    onLocationRequired();
                    return;
                  }
                  onCategorySelect(label);
                }
              }}
              className="bg-white border border-gray-150 rounded-2xl shadow-sm active:scale-95 transition-all p-2 flex flex-col items-center justify-center gap-2 h-24 cursor-pointer"
            >
              <cat.icon className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-extrabold text-gray-700 leading-tight text-center">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Categories Row - Desktop
 */
export function DesktopCategoryRow({
  onCategorySelect,
  onMoreClick,
  hasLocation,
  onLocationRequired,
}: CategoryGridProps) {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 relative z-10">
      <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-nowrap sm:justify-between">
        {categoryButtons.map((cat) => {
          const isMore = cat.id === "more";
          const label = isMore 
            ? (language === "en" ? "More" : "കൂടുതൽ")
            : t(`categories.${cat.id}`);

          return (
            <button
              key={cat.id}
              onClick={() => {
                if (isMore) {
                  onMoreClick();
                } else {
                  if (!hasLocation) {
                    onLocationRequired();
                    return;
                  }
                  onCategorySelect(label);
                }
              }}
              className="bg-white border border-gray-150 rounded-xl hover:border-slate-300 transition-all duration-200
                p-3 sm:p-4
                flex flex-col items-center gap-1.5
                sm:flex-1
                cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <cat.icon className="h-4.5 w-4.5 sm:h-4 sm:w-4" />
              </div>
              <span className="text-[11px] sm:text-[12px] font-extrabold text-gray-700 tracking-wide text-center">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
