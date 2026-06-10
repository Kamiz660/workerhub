export type WorkerCategory =
  | "electrician"
  | "plumber"
  | "carpenter"
  | "painter"
  | "technician"
  | "cleaner"
  | "mason"
  | "welder";

export interface Worker {
  id: string;
  name: string;
  profession: string;
  category: WorkerCategory;
  rating: number;
  reviewCount: number;
  location: string;
  experience: number;
  jobsCompleted: number;
  hourlyRate: number;
  bio: string;
  services: string[];
  verified: boolean;
  available: boolean;
  phone: string;
  email: string;
  image: string;
}

export interface CategoryInfo {
  id: WorkerCategory;
  label: string;
  icon: string;
  description: string;
  workerCount: number;
}

export interface Review {
  id: string;
  workerId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}
