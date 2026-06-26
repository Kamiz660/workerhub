"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  BadgeCheck,
  UserSearch,
} from "lucide-react";

const categoriesList = [
  { id: "electrician", label: "Electrician", icon: "🔌" },
  { id: "plumber", label: "Plumber", icon: "🔧" },
  { id: "carpenter", label: "Carpenter", icon: "🪚" },
  { id: "painter", label: "Painter", icon: "🎨" },
  { id: "technician", label: "Technician", icon: "🛠️" },
  { id: "cleaner", label: "Cleaner", icon: "🧹" },
  { id: "mason", label: "Mason", icon: "🧱" },
  { id: "welder", label: "Welder", icon: "🔥" },
];

const popularTowns = [
  "Koothattukulam", "Muvattupuzha", "Piravom", "Thodupuzha", "Perumbavoor", "Kolenchery",
];

interface HeroSearchProps {
  locationQuery: string;
  setLocationQuery: (value: string) => void;
  jobQuery: string;
  setJobQuery: (value: string) => void;
  showLocationDropdown: boolean;
  setShowLocationDropdown: (value: boolean) => void;
  showJobDropdown: boolean;
  setShowJobDropdown: (value: boolean) => void;
  placeholderIndex: number;
  placeholderVisible: boolean;
  isLocating: boolean;
  onGetCurrentLocation: () => void;
  onScrollToResults: () => void;
}

const locationExamples = ["Koothattukulam", "Muvattupuzha", "Piravom", "Thodupuzha", "Perumbavoor"];
const jobExamples = ["Plumber", "Electrician", "Carpenter", "Painter", "Mechanic"];

/**
 * Mobile Hero + Search Card
 *
 * Contains the hero headline, map illustration, and the search card
 * with location + job inputs and their autocomplete dropdowns.
 */
export function MobileHeroSearch({
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
  onGetCurrentLocation,
  onScrollToResults,
}: HeroSearchProps) {
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const jobDropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (jobDropdownRef.current && !jobDropdownRef.current.contains(event.target as Node)) {
        setShowJobDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowLocationDropdown, setShowJobDropdown]);

  return (
    <div className="sm:hidden px-4 pt-4 pb-4 bg-gradient-to-b from-primary/10/40 to-[#f5f8fc]">
      {/* Hero Area */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 text-left">
          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-tighter leading-[1.1]">
            Find trusted local <br />
            <span className="text-primary">workers</span> near you
          </h1>
          <p className="mt-2 text-[13px] text-gray-500 font-medium">
            Quick. Reliable. Local.
          </p>
        </div>

        {/* Map Illustration */}
        <div className="w-[120px] h-[120px] relative flex-shrink-0 self-center">
          <img
            src="/mobile_map_illustration.png"
            alt="Local Workers"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Search Card */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 -mt-1 relative z-40 flex flex-col gap-4">
        
        {/* Location Field */}
        <div>
          <label htmlFor="location-input-mobile" className="block text-[13px] font-bold text-gray-800 mb-2">
            Your Location
          </label>
          <div className="relative w-full" ref={locationDropdownRef}>
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-primary/80 z-10" />
            <input
              id="location-input-mobile"
              type="text"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
              placeholder=" "
              className="w-full bg-white border border-gray-200/90 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl pl-11 pr-[145px] py-3.5 text-sm font-semibold text-gray-900 outline-none transition-all shadow-sm"
              autoComplete="off"
            />
            {!locationQuery && (
              <span
                className="absolute left-11 top-0 bottom-0 flex items-center text-sm text-gray-400 font-medium pointer-events-none transition-all duration-700 ease-in-out"
                style={{ opacity: placeholderVisible ? 1 : 0, transform: `translateY(${placeholderVisible ? '0px' : '-6px'})` }}
              >
                {locationExamples[placeholderIndex]}
              </span>
            )}

            {/* Current Location Capsule */}
            <button
              onClick={onGetCurrentLocation}
              disabled={isLocating}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-bold hover:bg-emerald-100 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLocating ? "Locating..." : "Current Location"}
            </button>
            
            {/* Location Suggestions Dropdown */}
            {showLocationDropdown && locationQuery.trim().length > 0 && popularTowns.filter(t => t.toLowerCase().includes(locationQuery.toLowerCase())).length > 0 && (
              <div className="absolute top-[105%] left-0 right-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto mt-1">
                {popularTowns
                  .filter(t => t.toLowerCase().includes(locationQuery.toLowerCase()))
                  .map((town) => (
                    <button
                      key={town}
                      onClick={() => { setLocationQuery(town); setShowLocationDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-primary/10 transition-colors text-xs font-bold text-gray-700 border-b border-gray-50 last:border-b-0 flex items-center gap-2"
                    >
                      <MapPin className="h-3.5 w-3.5 text-gray-400" /> {town}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Job Field */}
        <div>
          <label htmlFor="job-input-mobile" className="block text-[13px] font-bold text-gray-800 mb-2">
            What do you need?
          </label>
          <div className="relative w-full" ref={jobDropdownRef}>
            <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-primary/80" />
            <input
              id="job-input-mobile"
              type="text"
              value={jobQuery}
              onChange={(e) => {
                setJobQuery(e.target.value);
                setShowJobDropdown(true);
              }}
              onFocus={() => setShowJobDropdown(true)}
              placeholder=" "
              className="w-full bg-white border border-gray-200/90 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold text-gray-900 outline-none transition-all shadow-sm"
              autoComplete="off"
            />
            {!jobQuery && (
              <span
                className="absolute left-11 top-0 bottom-0 flex items-center text-sm text-gray-400 font-medium pointer-events-none transition-all duration-700 ease-in-out"
                style={{ opacity: placeholderVisible ? 1 : 0, transform: `translateY(${placeholderVisible ? '0px' : '-6px'})` }}
              >
                {jobExamples[placeholderIndex]}
              </span>
            )}

            {/* Job Suggestions Dropdown */}
            {showJobDropdown && jobQuery.trim().length > 0 && categoriesList.filter(cat => cat.label.toLowerCase().includes(jobQuery.toLowerCase()) || cat.id.toLowerCase().includes(jobQuery.toLowerCase())).length > 0 && (
              <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto z-50 mt-1">
                {categoriesList
                  .filter(cat => cat.label.toLowerCase().includes(jobQuery.toLowerCase()) || cat.id.toLowerCase().includes(jobQuery.toLowerCase()))
                  .map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => { setJobQuery(category.label.split(" ")[0]); setShowJobDropdown(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-primary/10 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                    >
                      <span className="text-lg flex-shrink-0">{category.icon}</span>
                      <span className="font-semibold text-gray-800 text-sm">{category.label}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onScrollToResults}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl text-[15px] transition-all shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] active:scale-[0.98] flex items-center justify-center gap-2 border-0 cursor-pointer"
        >
          <Search className="h-4.5 w-4.5" />
          Search Workers
        </button>
      </div>
    </div>
  );
}

/**
 * Desktop Hero + Search Section
 *
 * Split layout with heading + search inputs on the left
 * and illustration + trust badge on the right.
 */
export function DesktopHeroSearch({
  locationQuery,
  setLocationQuery,
  jobQuery,
  setJobQuery,
  showLocationDropdown,
  setShowLocationDropdown,
  showJobDropdown,
  setShowJobDropdown,
  onScrollToResults,
}: HeroSearchProps) {
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const jobDropdownRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (jobDropdownRef.current && !jobDropdownRef.current.contains(event.target as Node)) {
        setShowJobDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowLocationDropdown, setShowJobDropdown]);

  return (
    <section className="bg-gradient-to-b from-primary/10/70 to-[#fcfdff] border-b border-gray-100/60 relative pt-4 sm:pt-10 pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative">

        {/* Left: Heading & Search Box */}
        <div className="lg:col-span-7 text-left">
          <h1 className="text-3xl sm:text-[3rem] font-extrabold text-slate-900 tracking-tighter leading-[1.1] flex flex-wrap items-center">
            Find Trusted Local <span className="text-primary mx-1 sm:mx-2">Workers</span> Near You
            <span className="inline-flex items-center justify-center ml-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary shadow-sm border border-primary/20">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
          </h1>
          <p className="hidden sm:block mt-3 text-sm sm:text-lg font-light text-gray-500 max-w-xl text-left">
            Select your town, choose the work you need, and call them directly. Simple, fast & free.
          </p>

          {/* Search inputs row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 mt-6 sm:mt-8 max-w-3xl relative z-40">

            {/* Field 1: Location */}
            <div className="flex-1 flex flex-col items-start gap-1.5 relative z-20" ref={locationDropdownRef}>
              <label htmlFor="location-input" className="text-sm font-semibold text-gray-700 ml-1 mt-1 sm:mt-0">
                Location
              </label>
              <div className="relative w-full">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-primary/80" />
                <input
                  id="location-input"
                  type="text"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setShowLocationDropdown(true);
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="e.g. Koothattukulam"
                  className="w-full bg-white border border-gray-200/90 hover:border-gray-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold text-gray-900 outline-none transition-all shadow-md"
                  autoComplete="off"
                />
              </div>

              {/* Location Suggestions */}
              {showLocationDropdown && locationQuery.trim().length > 0 && popularTowns.filter(t => t.toLowerCase().includes(locationQuery.toLowerCase())).length > 0 && (
                <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto z-50 mt-1">
                  {popularTowns
                    .filter(t => t.toLowerCase().includes(locationQuery.toLowerCase()))
                    .map((town) => (
                      <button
                        key={town}
                        onClick={() => { setLocationQuery(town); setShowLocationDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-primary/10 transition-colors text-sm font-semibold text-gray-700 border-b border-gray-50 last:border-b-0 flex items-center gap-2"
                      >
                        <MapPin className="h-3.5 w-3.5 text-gray-400" /> {town}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Field 2: Job/Profession */}
            <div className="flex-1 flex flex-col items-start gap-1.5 relative z-10" ref={jobDropdownRef}>
              <label htmlFor="job-input" className="text-sm font-semibold text-gray-700 ml-1">
                What do you need?
              </label>
              <div className="relative w-full">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-primary/80" />
                <input
                  id="job-input"
                  type="text"
                  value={jobQuery}
                  onChange={(e) => {
                    setJobQuery(e.target.value);
                    setShowJobDropdown(true);
                  }}
                  onFocus={() => setShowJobDropdown(true)}
                  placeholder="e.g. Electrician, Plumber"
                  className="w-full bg-white border border-gray-200/90 hover:border-gray-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-xl pl-11 pr-4 py-3.5 text-sm font-semibold text-gray-900 outline-none transition-all shadow-md"
                  autoComplete="off"
                />
              </div>

              {/* Job Suggestions */}
              {showJobDropdown && jobQuery.trim().length > 0 && categoriesList.filter(cat => cat.label.toLowerCase().includes(jobQuery.toLowerCase()) || cat.id.toLowerCase().includes(jobQuery.toLowerCase())).length > 0 && (
                <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto z-50 mt-1">
                  {categoriesList
                    .filter(cat => cat.label.toLowerCase().includes(jobQuery.toLowerCase()) || cat.id.toLowerCase().includes(jobQuery.toLowerCase()))
                    .map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => { setJobQuery(category.label.split(" ")[0]); setShowJobDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-primary/10 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
                      >
                        <span className="text-lg flex-shrink-0">{category.icon}</span>
                        <span className="font-semibold text-gray-800 text-sm">{category.label}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={onScrollToResults}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3.5 rounded-xl text-[15px] transition-all shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-2 cursor-pointer h-[52px] border-0 mt-4 sm:mt-0"
            >
              <UserSearch className="h-5 w-5" />
              Search Workers
            </button>
          </div>

        </div>

        {/* Right: Cartoon Illustration + City Background */}
        <div className="hidden lg:flex lg:col-span-5 relative h-[280px] items-end justify-center z-10">
          {/* 1st Image: City Background */}
          <img
            src="/city-bg.png"
            alt="City Skyline"
            className="absolute inset-0 w-full h-[120%] object-cover object-bottom opacity-80 mix-blend-multiply pointer-events-none -z-10"
          />
          {/* 2nd Image: Workers */}
          <img
            src="/workers_hero_illustration.png"
            alt="Local Workers"
            className="w-full h-full object-contain relative z-10 scale-[1.02] origin-bottom"
          />
          {/* Trust badges overlay */}
          <div className="absolute bottom-16 right-2 flex flex-col gap-2.5 z-20 items-end">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500/95">
              <span>Free to list</span>
              <span className="text-emerald-600 font-extrabold text-sm">✓</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500/95">
              <span>No signup</span>
              <span className="text-emerald-600 font-extrabold text-sm">✓</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500/95">
              <span>Contact workers directly</span>
              <span className="text-emerald-600 font-extrabold text-sm">✓</span>
            </div>
          </div>
          {/* Trusted badge overlay */}
          <div className="absolute bottom-4 right-0 bg-white border border-gray-150 shadow-lg rounded-2xl p-2.5 px-3 flex items-center gap-2 z-20 hover:scale-[1.02] transition-transform">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <BadgeCheck className="h-4.5 w-4.5" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Trusted by</p>
              <p className="text-xs text-primary font-extrabold mt-0.5">Local Community</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
