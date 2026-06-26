/**
 * Workers Service
 *
 * Abstract data access layer for worker and review data.
 * Delegates to workers-api.ts for all database operations.
 *
 * This is the single owner for worker data boundaries.
 * UI components should never import from `@/data/mock-workers` directly.
 */

import {
  getWorkers as apiGetWorkers,
  getWorkerById as apiGetWorkerById,
  searchWorkers as apiSearchWorkers,
} from "@/lib/workers-api";
import { categories, reviews } from "@/data/mock-workers";
import type { Worker, CategoryInfo, Review } from "@/lib/types";

/** Get all workers (async - fetches from Supabase). */
export async function getWorkers(): Promise<Worker[]> {
  return apiGetWorkers();
}

/** Find a single worker by ID. Returns undefined if not found. */
export async function getWorkerById(
  id: string
): Promise<Worker | undefined> {
  return apiGetWorkerById(id);
}

/** Get all service categories (static data). */
export function getCategories(): CategoryInfo[] {
  return categories;
}

/**
 * Search/filter workers by location and job query.
 * Fetches from Supabase with server-side filtering.
 */
export async function searchWorkers(
  locationQuery: string,
  jobQuery: string
): Promise<Worker[]> {
  return apiSearchWorkers(locationQuery, jobQuery);
}

/** Get all reviews for a specific worker (static mock data for now). */
export async function getReviewsByWorkerId(workerId: string): Promise<Review[]> {
  return reviews.filter((r) => r.workerId === workerId);
}
