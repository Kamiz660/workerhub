"use client";

import { useState, useEffect, useCallback } from "react";
import { searchWorkers } from "@/services/workers";
import { useGeolocation } from "@/hooks/use-geolocation";
import { EVENTS } from "@/lib/constants";
import type { Worker } from "@/lib/types";

// Feature components
import { MobileHeroSearch, DesktopHeroSearch } from "@/features/search/components/hero-search";
import { MobileCtaBanner, DesktopCtaBanner } from "@/features/home/components/cta-banner";
import { HowToUseMobile, HowToUseDesktop } from "@/features/home/components/how-to-use";
import { MobileCategoryGrid, DesktopCategoryRow } from "@/features/home/components/category-grid";
import { WorkerResults } from "@/features/home/components/worker-results";
import { ValueProps } from "@/features/home/components/value-props";

export default function HomePage() {
  // ─── Search State ───
  const [locationQuery, setLocationQuery] = useState("");
  const [jobQuery, setJobQuery] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showJobDropdown, setShowJobDropdown] = useState(false);

  // ─── Workers State (page owns this) ───
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Animated Placeholder State ───
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);

  // ─── Hooks ───
  const { isLocating, getCurrentLocation } = useGeolocation();

  // ─── Fetch workers from Supabase ───
  const fetchWorkers = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await searchWorkers(locationQuery, jobQuery);
      setWorkers(results);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
      setWorkers([]);
    } finally {
      setIsLoading(false);
    }
  }, [locationQuery, jobQuery]);

  useEffect(() => {
    let isActive = true;

    async function load() {
      setIsLoading(true);
      try {
        const results = await searchWorkers(locationQuery, jobQuery);
        if (isActive) setWorkers(results);
      } catch (err) {
        console.error("Failed to fetch workers:", err);
        if (isActive) setWorkers([]);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    load();
    return () => { isActive = false; };
  }, [locationQuery, jobQuery]);

  // ─── Listen for WORKER_ADDED to refresh locally ───
  useEffect(() => {
    const handler = () => fetchWorkers();
    window.addEventListener(EVENTS.WORKER_ADDED, handler);
    return () => window.removeEventListener(EVENTS.WORKER_ADDED, handler);
  }, [fetchWorkers]);

  // ─── Placeholder rotation effect ───
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % 5);
        setPlaceholderVisible(true);
      }, 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // ─── Handlers ───
  const scrollToResults = useCallback(() => {
    const el = document.getElementById("results-section");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const handleGetCurrentLocation = async () => {
    const city = await getCurrentLocation();
    if (city) {
      setLocationQuery(city);
      setShowLocationDropdown(false);
    }
  };

  const handleCategorySelect = (label: string) => {
    setJobQuery(label);
    scrollToResults();
  };

  const handleClearFilters = () => {
    setJobQuery("");
    setLocationQuery("Koothattukulam");
  };

  // ─── Shared search props ───
  const searchProps = {
    locationQuery,
    setLocationQuery,
    jobQuery,
    setJobQuery,
    showLocationDropdown,
    setShowLocationDropdown,
    showJobDropdown,
    setShowJobDropdown,
    placeholderIndex,
    placeholderVisible,
    isLocating,
    onGetCurrentLocation: handleGetCurrentLocation,
    onScrollToResults: scrollToResults,
  };

  return (
    <div className="bg-[#f5f8fc] min-h-screen">
      {/* ── MOBILE ONLY ── */}
      <div className="sm:hidden">
        <MobileHeroSearch {...searchProps} />
        <div className="px-4">
          <MobileCtaBanner />
          <HowToUseMobile />
          <MobileCategoryGrid
            onCategorySelect={handleCategorySelect}
            onMoreClick={() => {
              setShowJobDropdown(true);
              document.getElementById("job-input-mobile")?.focus();
            }}
            hasLocation={!!locationQuery.trim()}
            onLocationRequired={() => setShowLocationDropdown(true)}
          />
        </div>
      </div>

      {/* ── DESKTOP/TABLET ONLY ── */}
      <div className="hidden sm:block">
        <DesktopHeroSearch {...searchProps} />
        <DesktopCategoryRow
          onCategorySelect={handleCategorySelect}
          onMoreClick={() => {
            setShowJobDropdown(true);
            document.getElementById("job-input")?.focus();
          }}
          hasLocation={!!locationQuery.trim()}
          onLocationRequired={() => {
            const locInput = document.getElementById("location-input");
            if (locInput) {
              locInput.focus();
              locInput.classList.add("ring-2", "ring-red-500", "border-red-500");
              setTimeout(() => {
                locInput.classList.remove("ring-2", "ring-red-500", "border-red-500");
              }, 1500);
            }
          }}
        />
        <DesktopCtaBanner />
      </div>

      {/* ── SHARED SECTIONS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <WorkerResults
          workers={workers}
          locationQuery={locationQuery}
          jobQuery={jobQuery}
          onClearFilters={handleClearFilters}
          isLoading={isLoading}
        />
        <HowToUseDesktop />
      </div>

      <ValueProps />
    </div>
  );
}
