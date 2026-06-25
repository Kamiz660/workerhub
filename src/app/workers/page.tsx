"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/workers/search-bar";
import { WorkerGrid } from "@/components/workers/worker-grid";
import { getWorkers } from "@/services/workers";
import { EVENTS } from "@/lib/constants";
import type { Worker } from "@/lib/types";

function WorkersContent() {
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("rating");

  // Page owns the workers list state
  const [allWorkers, setAllWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllWorkers = async () => {
    setIsLoading(true);
    try {
      const data = await getWorkers();
      setAllWorkers(data);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
      setAllWorkers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    async function load() {
      setIsLoading(true);
      try {
        const data = await getWorkers();
        if (isActive) setAllWorkers(data);
      } catch (err) {
        console.error("Failed to fetch workers:", err);
        if (isActive) setAllWorkers([]);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    load();
    return () => { isActive = false; };
  }, []);

  // Listen for WORKER_ADDED to refresh locally
  useEffect(() => {
    const handler = () => fetchAllWorkers();
    window.addEventListener(EVENTS.WORKER_ADDED, handler);
    return () => window.removeEventListener(EVENTS.WORKER_ADDED, handler);
  }, []);

  const filteredWorkers = useMemo(() => {
    let result = [...allWorkers];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(query) ||
          w.profession.toLowerCase().includes(query) ||
          w.location.toLowerCase().includes(query) ||
          w.services.some((s) => s.toLowerCase().includes(query)) ||
          w.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((w) => w.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        result.sort((a, b) => (b.experience ?? 0) - (a.experience ?? 0));
        break;
      case "price-low":
        result.sort((a, b) => (a.hourlyRate ?? Infinity) - (b.hourlyRate ?? Infinity));
        break;
      case "price-high":
        result.sort((a, b) => (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0));
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [allWorkers, searchQuery, selectedCategory, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <p className="text-gray-500">Loading workers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={filteredWorkers.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WorkerGrid workers={filteredWorkers} />
      </div>
    </div>
  );
}

export default function WorkersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <p className="text-gray-500">Loading workers...</p>
      </div>
    }>
      <WorkersContent />
    </Suspense>
  );
}
