import { describe, it, expect, vi, beforeEach } from "vitest";
import React, { Suspense, act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import type { Worker } from "@/lib/types";

// Mock worker service BEFORE importing components
vi.mock("@/services/workers", () => ({
  getWorkerById: vi.fn((id: string) =>
    Promise.resolve({
      id: id || "w1",
      name: "Rajesh Kumar",
      profession: "Master Electrician",
      category: "electrician",
      rating: 4.9,
      reviewCount: 127,
      location: "Koothattukulam",
      experience: 12,
      jobsCompleted: 340,
      hourlyRate: 500,
      bio: "Licensed electrician with over 12 years of experience.",
      services: ["House Wiring", "Panel Upgrades"],
      verified: true,
      available: true,
      phone: "+91 94970 12345",
      email: "rajesh.k@email.com",
      image: "",
    })
  ),
  getReviewsByWorkerId: vi.fn(() => Promise.resolve([])),
}));

// Mock LanguageContext
vi.mock("@/context/language-context", () => ({
  useLanguage: () => ({
    language: "en",
    setLanguage: vi.fn(),
    t: (key: string) => {
      const translations: Record<string, string> = {
        "results.title": "Available Workers",
        "results.countSingular": "Worker",
        "results.countPlural": "Workers",
        "results.clearFilters": "Clear Filters",
        "results.noResults": "No workers found",
        "results.noResultsDesc": "Try selecting another location or category.",
        "results.tailCardTitle": "List Your Service",
        "common.alwaysFree": "Always Free",
        "common.loading": "Loading...",
        "card.experience": "years exp",
        "card.callNow": "Call Now",
        "card.whatsapp": "WhatsApp",
        "card.verified": "Verified",
        "card.availableNow": "Available",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock useRouter for Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

import { WorkerResults } from "@/features/home/components/worker-results";
import { WorkerCard } from "@/components/workers/worker-card";
import WorkerDetailPage from "@/app/workers/[id]/page";
import { workers as mockWorkersData } from "@/data/mock-workers";

describe("Feature 004: Browse Workers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. Worker cards render correctly", () => {
    const sampleWorker: Worker = mockWorkersData[0]; // Rajesh Kumar

    render(<WorkerCard worker={sampleWorker} />);

    expect(screen.getByText("Rajesh Kumar")).toBeInTheDocument();
    expect(screen.getByText("Electrician")).toBeInTheDocument();
    expect(screen.getByText("Koothattukulam")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
  });

  it("2. Search filters workers by location or job query", () => {
    const filteredWorkers = mockWorkersData.filter(
      (w) => w.location === "Piravom"
    );

    render(
      <WorkerResults
        workers={filteredWorkers}
        locationQuery="Piravom"
        jobQuery=""
        onClearFilters={vi.fn()}
      />
    );

    // Should render only Piravom workers
    expect(screen.getByText("Suresh Menon")).toBeInTheDocument();
    expect(screen.queryByText("Rajesh Kumar")).not.toBeInTheDocument();
  });

  it("3. Category filters workers correctly", () => {
    const plumberWorkers = mockWorkersData.filter(
      (w) => w.category === "plumber"
    );

    render(
      <WorkerResults
        workers={plumberWorkers}
        locationQuery="Koothattukulam"
        jobQuery="plumber"
        onClearFilters={vi.fn()}
      />
    );

    // Should render Biju Mathew (Plumber)
    expect(screen.getByText("Biju Mathew")).toBeInTheDocument();
    // Should NOT render Rajesh Kumar (Electrician)
    expect(screen.queryByText("Rajesh Kumar")).not.toBeInTheDocument();
  });

  it("4. Empty state is displayed when no workers match filters", () => {
    render(
      <WorkerResults
        workers={[]}
        locationQuery="NonExistentLocation"
        jobQuery="Astronaut"
        onClearFilters={vi.fn()}
      />
    );

    expect(screen.getByText("No workers found")).toBeInTheDocument();
    expect(screen.getByText("Try selecting another location or category.")).toBeInTheDocument();
  });

  it("5. Worker profile page opens and renders details", async () => {
    const paramsPromise = Promise.resolve({ id: "w1" });

    await act(async () => {
      render(
        <Suspense fallback={<div>Loading profile...</div>}>
          <WorkerDetailPage params={paramsPromise} />
        </Suspense>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Rajesh Kumar")).toBeInTheDocument();
    });

    expect(screen.getByText("Electrician")).toBeInTheDocument();
    expect(screen.getByText("House Wiring")).toBeInTheDocument();
    expect(screen.getByText("Panel Upgrades")).toBeInTheDocument();
  });
});
