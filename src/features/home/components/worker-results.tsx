"use client";

import { Users, X, ChevronRight, Plus, Loader2 } from "lucide-react";
import { WorkerCard } from "@/components/workers/worker-card";
import { EVENTS } from "@/lib/constants";
import type { Worker } from "@/lib/types";

interface WorkerResultsProps {
  workers: Worker[];
  locationQuery: string;
  jobQuery: string;
  onClearFilters: () => void;
  isLoading?: boolean;
}

/**
 * Worker Results Section
 *
 * Displays the filtered worker grid with a header showing counts,
 * clear filters action, and an empty state when no results match.
 * Also includes a trailing "List Your Service" CTA card.
 */
export function WorkerResults({
  workers,
  locationQuery,
  jobQuery,
  onClearFilters,
  isLoading = false,
}: WorkerResultsProps) {
  const openModal = () =>
    window.dispatchEvent(new CustomEvent(EVENTS.OPEN_ADD_WORKER_MODAL));

  if (isLoading) {
    return (
      <section className="lg:col-span-9 flex flex-col gap-5" id="results-section">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-gray-500">Loading workers...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:col-span-9 flex flex-col gap-5" id="results-section">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 sm:pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-2xl font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="hidden sm:inline">Available Local Workers</span>
            <span className="sm:hidden">{workers.length} Workers</span>
          </h2>
          <span className="hidden sm:inline text-xs sm:text-sm text-gray-500">
            - Showing {workers.length} in {locationQuery || "any location"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {(jobQuery || locationQuery !== "Koothattukulam") && (
            <button
              onClick={onClearFilters}
              className="text-xs font-semibold text-primary hover:text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
          <span className="hidden sm:flex text-xs sm:text-sm font-bold text-primary hover:text-primary items-center gap-1 cursor-pointer">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      {workers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}

          {/* Extra 'List Your Service' card as the tail card of the grid */}
          <button
            type="button"
            className="bg-white border border-dashed border-slate-200 hover:border-primary/30 hover:bg-primary/[0.02] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] active:duration-75
              p-6 flex flex-col items-center justify-center gap-3
              min-h-[220px] w-full h-full
              cursor-pointer group"
            onClick={openModal}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <span className="text-sm font-extrabold text-gray-900 group-hover:text-primary transition-colors inline-flex items-center gap-1.5 justify-center w-full">
                List Your Service
                <span className="text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100/50">Always Free</span>
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
            onClick={onClearFilters}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <X className="h-4 w-4" />
            Reset Search
          </button>
        </div>
      )}
    </section>
  );
}
