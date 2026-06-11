"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  Briefcase,
  BadgeCheck,
  Users,
  BookOpen,
  Gift,
  ShieldCheck,
  Timer,
  Phone,
  X,
  ChevronRight,
  Zap,
  Droplet,
  Hammer,
  Paintbrush,
  Wrench,
  Sparkles,
  Landmark,
  LayoutGrid,
  UserSearch,
  ScanSearch,
  Plus
} from "lucide-react";
import { WorkerCard } from "@/components/workers/worker-card";
import { workers } from "@/data/mock-workers";

const categoriesList = [
  { id: "electrician", label: "Electrician", icon: "🔌" },
  { id: "plumber", label: "Plumber", icon: "🚰" },
  { id: "carpenter", label: "Carpenter", icon: "🪚" },
  { id: "painter", label: "Painter", icon: "🎨" },
  { id: "technician", label: "Technician", icon: "🛠️" },
  { id: "cleaner", label: "Cleaner", icon: "🧹" },
  { id: "mason", label: "Mason", icon: "🧱" },
  { id: "welder", label: "Welder", icon: "🔥" }
];

const categoryButtons = [
  { id: "electrician", label: "Electrician", icon: Zap },
  { id: "plumber", label: "Plumber", icon: Droplet },
  { id: "carpenter", label: "Carpenter", icon: Hammer },
  { id: "painter", label: "Painter", icon: Paintbrush },
  { id: "mechanic", label: "Mechanic", icon: Wrench },
  { id: "cleaner", label: "Cleaner", icon: Sparkles },
  { id: "mason", label: "Mason", icon: Landmark },
  { id: "more", label: "More", icon: LayoutGrid }
];

const popularTowns = [
  "Koothattukulam", "Muvattupuzha", "Piravom", "Thodupuzha", "Perumbavoor", "Kolenchery"
];

export default function HomePage() {
  const [locationQuery, setLocationQuery] = useState("");
  const [jobQuery, setJobQuery] = useState("");
  
  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const jobDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Scroll to worker results section
  const scrollToResults = useCallback(() => {
    const el = document.getElementById("results-section");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  // Handle outside clicks for both dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (jobDropdownRef.current && !jobDropdownRef.current.contains(event.target as Node)) {
        setShowJobDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const locMatch = worker.location.toLowerCase().includes(locationQuery.trim().toLowerCase());
      const jobSearch = jobQuery.trim().toLowerCase();
      if (!jobSearch) return locMatch;
      
      const jobMatch = 
        worker.name.toLowerCase().includes(jobSearch) ||
        worker.profession.toLowerCase().includes(jobSearch) ||
        worker.category.toLowerCase().includes(jobSearch) ||
        worker.services.some(s => s.toLowerCase().includes(jobSearch));
        
      return locMatch && jobMatch;
    });
  }, [locationQuery, jobQuery]);

  return (
    <div className="bg-[#fcfdff] min-h-screen">
      {/* 1. Hero & Search Console */}
      <section className="bg-gradient-to-b from-blue-50/40 to-[#fcfdff] border-b border-gray-100/60 relative pt-8 sm:pt-10 pb-10 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-40">
          
          {/* Left: Heading & Search Box */}
          <div className="lg:col-span-7 text-left">
            <h1 className="text-2xl sm:text-[2.75rem] font-extrabold text-gray-900 tracking-tight leading-tight flex flex-wrap items-center">
              Find Trusted Local <span className="text-blue-600 mx-1 sm:mx-2">Workers</span> Near You
              <span className="inline-flex items-center justify-center ml-1 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-blue-50 text-blue-600 shadow-sm border border-blue-100">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-lg font-light text-gray-500 max-w-xl text-left">
              Select your town, choose the work you need, and call them directly. Simple, fast & free.
            </p>

            {/* Search inputs row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mt-6 sm:mt-8 max-w-3xl relative z-40">
              
              {/* Field 1: Location with working dropdown */}
              <div className="flex-1 flex flex-col items-start gap-1 relative z-20" ref={locationDropdownRef}>
                <label htmlFor="location-input" className="text-sm font-semibold text-gray-700 ml-1 mt-2 sm:mt-0">
                  Location
                </label>
                <div className="relative w-full">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-blue-500" />
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
                    className="w-full bg-white border border-gray-200/90 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl pl-11 pr-10 py-3 text-sm font-semibold text-gray-900 outline-none transition-all shadow-md cursor-pointer"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowLocationDropdown(!showLocationDropdown);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-all cursor-pointer z-30"
                    aria-label="Toggle location dropdown"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showLocationDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {/* Location Dropdown */}
                {showLocationDropdown && (
                  <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto z-50 mt-1">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Popular Towns
                    </div>
                    {popularTowns
                      .filter(t => t.toLowerCase().includes(locationQuery.toLowerCase()))
                      .map((town) => (
                        <button
                          key={town}
                          onClick={() => { setLocationQuery(town); setShowLocationDropdown(false); }}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors text-sm font-semibold text-gray-700 border-b border-gray-50 last:border-b-0 flex items-center gap-2"
                        >
                          <MapPin className="h-3.5 w-3.5 text-gray-400" /> {town}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Field 2: Job/Profession with working dropdown */}
              <div className="flex-1 flex flex-col items-start gap-1 relative z-10" ref={jobDropdownRef}>
                <label htmlFor="job-input" className="text-sm font-semibold text-gray-700 ml-1">
                  What do you need?
                </label>
                <div className="relative w-full">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-blue-500" />
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
                    className="w-full bg-white border border-gray-200/90 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl pl-11 pr-10 py-3 text-sm font-semibold text-gray-900 outline-none transition-all shadow-md cursor-pointer"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowJobDropdown(!showJobDropdown);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-all cursor-pointer z-30"
                    aria-label="Toggle job dropdown"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showJobDropdown ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Job Dropdown */}
                {showJobDropdown && (
                  <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto z-50 mt-1">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Quick Select
                    </div>
                    {categoriesList
                      .filter(cat => cat.label.toLowerCase().includes(jobQuery.toLowerCase()) || cat.id.toLowerCase().includes(jobQuery.toLowerCase()))
                      .map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => { setJobQuery(category.label.split(" ")[0]); setShowJobDropdown(false); }}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-b-0"
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
                onClick={scrollToResults}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-750 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer h-[48px] border-0 mt-4 sm:mt-0"
              >
                <UserSearch className="h-5 w-5" />
                Search Workers
              </button>
            </div>

            {/* Compact inline trust signals to save space */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-3 gap-y-1 mt-2 text-[11px] sm:text-xs text-gray-400 font-normal">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-blue-500/80" /> 100% Free</span>
              <span className="flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5 text-emerald-500/80" /> Local Workers</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-purple-500/80" /> Call Directly</span>
            </div>

          </div>

          {/* Right: Cartoon Illustration + City Background */}
          <div className="hidden lg:flex lg:col-span-5 relative h-[280px] items-end justify-center">
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
            {/* Trusted badge overlay */}
            <div className="absolute bottom-4 right-0 bg-white border border-gray-150 shadow-lg rounded-2xl p-2.5 px-3 flex items-center gap-2 z-20 hover:scale-[1.02] transition-transform">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <BadgeCheck className="h-4.5 w-4.5" />
              </div>
              <div className="text-left leading-tight">
                <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Trusted by</p>
                <p className="text-xs text-blue-600 font-extrabold mt-0.5">Local Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 sm:-mt-6 relative z-30">
        {/* Mobile: horizontal scroll (hidden scrollbar); Desktop: spread evenly */}
        <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible sm:flex-nowrap sm:justify-between hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categoryButtons.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === "more") {
                  setShowJobDropdown(true);
                  document.getElementById("job-input")?.focus();
                } else {
                  setJobQuery(cat.label);
                  scrollToResults();
                }
              }}
              className="bg-white border border-gray-150 rounded-xl shadow-sm hover:shadow-md transition-all duration-200
                flex-shrink-0
                p-3 sm:p-4
                flex flex-col items-center gap-1.5
                min-w-[80px] sm:flex-1
                cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <cat.icon className="h-4.5 w-4.5 sm:h-4 sm:w-4" />
              </div>
              <span className="text-[11px] sm:text-[12px] font-extrabold text-gray-700 tracking-wide">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Split Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Worker Grid (Expanded to col-span-9 for 3 cards) */}
        <section className="lg:col-span-9 flex flex-col gap-5" id="results-section">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Available Local Workers
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Showing {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? "s" : ""} in {locationQuery || "any location"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {(jobQuery || locationQuery !== "Koothattukulam") && (
                <button
                  onClick={() => {
                    setJobQuery("");
                    setLocationQuery("Koothattukulam");
                  }}
                  className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear Filters
                </button>
              )}
              <span className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          {filteredWorkers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredWorkers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}

              {/* Extra 'List Your Service' card as the tail card of the grid */}
              <button
                type="button"
                className="bg-white border border-dashed border-blue-200 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200
                  p-6 flex flex-col items-center justify-center gap-3
                  min-h-[220px] w-full h-full
                  cursor-pointer group hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors block">
                    List Your Service
                  </span>
                  <p className="text-xs text-gray-500 mt-1 max-w-[180px] mx-auto leading-normal">
                    Join WorkerHub and start receiving local calls today.
                  </p>
                </div>
              </button>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200/80 shadow-sm">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                No workers found
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto mb-4">
                We couldn&apos;t find anyone matching &quot;{jobQuery}&quot; in &quot;{locationQuery}&quot;.
              </p>
              <button
                onClick={() => {
                  setJobQuery("");
                  setLocationQuery("Koothattukulam");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <X className="h-4 w-4" />
                Reset Search
              </button>
            </div>
          )}
        </section>

        {/* Right Column: "How to Use" Sidebar — show FIRST on mobile, sidebar on desktop */}
        <aside className="order-first lg:order-none lg:col-span-3" id="how-to-use">
          <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-sm flex flex-col gap-5 sticky top-24">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2.5">
              <BookOpen className="h-4 w-4 text-blue-600" />
              How to Use
            </h2>

            {/* Vertical Flow Steps */}
            <div className="flex flex-col gap-4 relative">
              {/* Vertical connector line */}
              <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-gray-100" />

              {/* Step 1 */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-100 shadow-sm">
                  1
                </div>
                <div className="pt-0.5">
                  <h3 className="font-extrabold text-[13px] text-gray-900 leading-tight flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" /> Select Your Town
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                    Choose your location to find local workers.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center border border-emerald-100 shadow-sm">
                  2
                </div>
                <div className="pt-0.5">
                  <h3 className="font-extrabold text-[13px] text-gray-900 leading-tight flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-emerald-500" /> Choose the Work
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                    Select the type of work you need help with.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-purple-50 text-purple-600 font-bold text-xs flex items-center justify-center border border-purple-100 shadow-sm">
                  3
                </div>
                <div className="pt-0.5">
                  <h3 className="font-extrabold text-[13px] text-gray-900 leading-tight flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-purple-500" /> Call Directly
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                    Contact the worker directly and discuss.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 relative z-10">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-50 text-orange-600 font-bold text-xs flex items-center justify-center border border-orange-100 shadow-sm">
                  4
                </div>
                <div className="pt-0.5">
                  <h3 className="font-extrabold text-[13px] text-gray-900 leading-tight flex items-center gap-1.5">
                    <BadgeCheck className="h-3.5 w-3.5 text-orange-500" /> Hire & Get it Done
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                    Hire the best worker and get the job done.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 4. Bottom Value Proposition Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white border border-gray-150 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 shadow-sm">
          {/* Badge 1 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0 border border-orange-100">
              <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">100% Free</p>
              <p className="text-[10px] sm:text-[11px] text-gray-500">No hidden charges</p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 border border-blue-100">
              <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">Local & Trusted</p>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Verified workers</p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 border border-emerald-100">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">Call Directly</p>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Talk & hire directly</p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0 border border-purple-100">
              <Timer className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-extrabold text-gray-900">Quick & Easy</p>
              <p className="text-[10px] sm:text-[11px] text-gray-500">Save time & effort</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
