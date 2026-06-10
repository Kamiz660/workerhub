"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/workers/search-bar";
import { WorkerGrid } from "@/components/workers/worker-grid";
import { workers } from "@/data/mock-workers";

function WorkersContent() {
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("rating");

  const filteredWorkers = useMemo(() => {
    let result = [...workers];

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
        result.sort((a, b) => b.experience - a.experience);
        break;
      case "price-low":
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case "price-high":
        result.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

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
