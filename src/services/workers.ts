/**
 * Workers Service
 *
 * Abstract data access layer for worker and review data.
 * Delegates to workers-api.ts for database operations with a local-first
 * instant cache layer for the validation phase.
 *
 * UI components interact exclusively with this service.
 */

import {
  getWorkers as apiGetWorkers,
  getWorkerById as apiGetWorkerById,
  searchWorkers as apiSearchWorkers,
} from "@/lib/workers-api";
import { workers as localSeedWorkers, categories, reviews } from "@/data/workers";
import type { Worker, CategoryInfo, Review } from "@/lib/types";

/**
 * Validation Phase Feature Flag:
 * - When `true`: Search and profile resolution resolve instantly from local seed cache
 *   with graceful background Supabase merge & timeout resilience.
 * - When `false`: All queries go directly to Supabase.
 */
export const USE_LOCAL_CACHE_FIRST = true;

const malayalamToEnglishMap: Record<string, string> = {
  // Towns
  "കൂത്താട്ടുകുളം": "Koothattukulam",
  "മൂവാറ്റുപുഴ": "Muvattupuzha",
  "പിറവം": "Piravom",
  "തൊടുപുഴ": "Thodupuzha",
  "പെരുമ്പാവൂർ": "Perumbavoor",
  "കോലഞ്ചേരി": "Kolenchery",
  
  // Jobs/Categories
  "ഇലക്ട്രീഷ്യൻ": "electrician",
  "പ്ലംബർ": "plumber",
  "കാർപെന്റർ": "carpenter",
  "പെയിന്റർ": "painter",
  "ടെക്നീഷ്യൻ": "technician",
  "ക്ലീനർ": "cleaner",
  "മേസൺ": "mason",
  "വെൽഡർ": "welder",
  "മെക്കാനിക്": "mechanic",
  "മറ്റുള്ളവ": "more"
};

/** Utility to race a promise against a timeout */
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Supabase request timed out")), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

/** Check if a worker entry is a test record */
function isTestWorker(worker: Worker): boolean {
  const name = worker.name?.toLowerCase().trim() || "";
  return (
    name.includes("testuser") ||
    name.includes("test user") ||
    name === "test" ||
    name === "test worker" ||
    name.startsWith("test ") ||
    name.endsWith(" test")
  );
}

/** Synchronous local-first filter for instant search */
function filterLocalWorkers(locationQuery: string, jobQuery: string): Worker[] {
  const loc = locationQuery.toLowerCase().trim();
  const job = jobQuery.toLowerCase().trim();

  return localSeedWorkers
    .filter((w) => !isTestWorker(w))
    .filter((w) => {
      const matchLoc = !loc || w.location.toLowerCase().includes(loc);
      const matchJob =
        !job ||
        w.name.toLowerCase().includes(job) ||
        w.profession.toLowerCase().includes(job) ||
        w.category.toLowerCase().includes(job) ||
        (w.services && w.services.some((s) => s.toLowerCase().includes(job))) ||
        (w.bio ? w.bio.toLowerCase().includes(job) : false);
      return matchLoc && matchJob;
    });
}

/** Get all workers (local-first with Supabase background merge). */
export async function getWorkers(): Promise<Worker[]> {
  if (!USE_LOCAL_CACHE_FIRST) {
    const raw = await apiGetWorkers();
    return raw.filter((w) => !isTestWorker(w));
  }

  try {
    const remote = await withTimeout(apiGetWorkers(), 1500);
    if (remote && remote.length > 0) {
      const workerMap = new Map<string, Worker>();
      for (const w of localSeedWorkers) {
        if (!isTestWorker(w)) workerMap.set(w.id, w);
      }
      for (const w of remote) {
        if (!isTestWorker(w)) workerMap.set(w.id, w);
      }
      return Array.from(workerMap.values()).sort(
        (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
      );
    }
  } catch {
    // Silently fallback to local seed data on Supabase timeout/error
  }

  return localSeedWorkers.filter((w) => !isTestWorker(w));
}

/** Find a single worker by ID (Supabase first with instant local seed fallback). */
export async function getWorkerById(
  id: string
): Promise<Worker | undefined> {
  if (!USE_LOCAL_CACHE_FIRST) {
    const remote = await apiGetWorkerById(id);
    if (remote && !isTestWorker(remote)) return remote;
    return undefined;
  }

  try {
    const remote = await withTimeout(apiGetWorkerById(id), 1500);
    if (remote && !isTestWorker(remote)) return remote;
  } catch {
    // Silently fallback on Supabase error/offline
  }

  const local = localSeedWorkers.find((w) => w.id === id);
  if (local && !isTestWorker(local)) return local;
  return undefined;
}

/** Get all service categories (static data). */
export function getCategories(): CategoryInfo[] {
  return categories;
}

/**
 * Search/filter workers by location and job query.
 * Fast instant local resolution with background Supabase merge.
 */
export async function searchWorkers(
  locationQuery: string,
  jobQuery: string
): Promise<Worker[]> {
  const normalizedLocation = locationQuery.trim();
  const normalizedJob = jobQuery.trim();

  // Map Malayalam search values back to English equivalents
  const mappedLocation = malayalamToEnglishMap[normalizedLocation] || normalizedLocation;
  const mappedJob = malayalamToEnglishMap[normalizedJob] || normalizedJob;

  if (!USE_LOCAL_CACHE_FIRST) {
    const raw = await apiSearchWorkers(mappedLocation, mappedJob);
    return raw.filter((w) => !isTestWorker(w));
  }

  const localMatches = filterLocalWorkers(mappedLocation, mappedJob);

  try {
    const remoteWorkers = await withTimeout(
      apiSearchWorkers(mappedLocation, mappedJob),
      1500
    );

    if (remoteWorkers && remoteWorkers.length > 0) {
      const workerMap = new Map<string, Worker>();
      for (const w of localMatches) {
        if (!isTestWorker(w)) workerMap.set(w.id, w);
      }
      for (const w of remoteWorkers) {
        if (!isTestWorker(w)) workerMap.set(w.id, w);
      }
      return Array.from(workerMap.values()).sort(
        (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
      );
    }
  } catch {
    // Silently fallback to local seed matches on network timeout / offline
  }

  return localMatches;
}

/** Get all reviews for a specific worker (static mock data for now). */
export async function getReviewsByWorkerId(workerId: string): Promise<Review[]> {
  return reviews.filter((r) => r.workerId === workerId);
}
