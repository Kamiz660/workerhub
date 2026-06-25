/**
 * Workers API — Centralized data layer for all Supabase CRUD + storage operations.
 *
 * All database access must go through this file.
 * No direct Supabase calls in UI components.
 */

import { z } from "zod";
import { supabase } from "@/lib/supabase";
import type { Worker } from "@/lib/types";

// ─── Validation Schema ─────────────────────────────────────────────

const VALID_CATEGORIES = [
  "electrician",
  "plumber",
  "carpenter",
  "painter",
  "technician",
  "cleaner",
  "mason",
  "welder",
] as const;

export const InsertWorkerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  profession: z.string().optional().default(""),
  category: z.enum(VALID_CATEGORIES, "Select a valid category"),
  location: z.string().min(2, "Location is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .refine((val) => {
      const numbers = val.replace(/\D/g, "");
      // Block obvious repeated dummy digits like 9999999999
      if (/^(\d)\1{7,}$/.test(numbers)) return false;
      // Block sequential numbers like 1234567890
      if ("1234567890".includes(numbers) || "0123456789".includes(numbers)) return false;
      return true;
    }, "Please enter a valid phone number"),
  email: z.string().email("Invalid email").or(z.literal("")).optional(),
  hourlyRate: z.number().min(0, "Rate cannot be negative").max(50000).nullable().optional(),
  experience: z.number().min(0).max(60).nullable().optional(),
  bio: z.string().max(500).optional().default(""),
  services: z.array(z.string()).optional().default([]),
  image: z.string().optional().default(""),
  hp_website: z.string().optional().default(""),
});

export type InsertWorkerInput = z.infer<typeof InsertWorkerSchema>;

// ─── File Upload Validation ─────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateProfilePic(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, and WebP images are allowed";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Image must be smaller than 5MB";
  }
  return null;
}

// ─── Storage ────────────────────────────────────────────────────────

export async function uploadProfilePic(file: File): Promise<string> {
  const validationError = validateProfilePic(file);
  if (validationError) throw new Error(validationError);

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fileName, file);

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(fileName);

  return publicUrl;
}

// ─── Queries ────────────────────────────────────────────────────────

export async function getWorkers(): Promise<Worker[]> {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .order("rating", { ascending: false });

  if (error) throw new Error(`Failed to fetch workers: ${error.message}`);
  return (data ?? []) as Worker[];
}

export async function getWorkerById(
  id: string
): Promise<Worker | undefined> {
  const { data, error } = await supabase
    .from("workers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return undefined;
  return data as Worker;
}

export async function searchWorkers(
  locationQuery: string,
  jobQuery: string
): Promise<Worker[]> {
  let query = supabase.from("workers").select("*");

  if (locationQuery.trim()) {
    query = query.ilike("location", `%${locationQuery.trim()}%`);
  }

  if (jobQuery.trim()) {
    const search = `%${jobQuery.trim()}%`;
    query = query.or(
      `name.ilike.${search},profession.ilike.${search},category.ilike.${search}`
    );
  }

  query = query.order("rating", { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(`Search failed: ${error.message}`);
  return (data ?? []) as Worker[];
}

// ─── Mutations ──────────────────────────────────────────────────────

export async function addWorker(
  input: InsertWorkerInput
): Promise<Worker> {
  const parsed = InsertWorkerSchema.parse(input);

  // Honeypot check
  if (parsed.hp_website) {
    throw new Error("Invalid submission.");
  }

  // Smart defaults
  const profession = parsed.profession
    ? parsed.profession
    : parsed.category.charAt(0).toUpperCase() + parsed.category.slice(1);

  const services = parsed.services.length > 0
    ? parsed.services
    : [`General ${profession} Services`];

  const { data, error } = await supabase
    .from("workers")
    .insert({
      name: parsed.name,
      profession,
      category: parsed.category,
      location: parsed.location,
      phone: parsed.phone,
      email: parsed.email || null,
      hourlyRate: parsed.hourlyRate ?? null,
      experience: parsed.experience ?? null,
      bio: parsed.bio,
      services,
      image: parsed.image,
      rating: 5.0,
      reviewCount: 0,
      jobsCompleted: 0,
      verified: false,
      available: true,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to add worker: ${error.message}`);
  return data as Worker;
}
