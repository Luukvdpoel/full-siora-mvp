export type { LeadMagnetIdea } from "@/types/leadMagnet";

const STORAGE_KEY = "latestLeadMagnetIdea";

export function saveLeadMagnetIdea(idea: import("@/types/leadMagnet").LeadMagnetIdea) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(idea));
  } catch (err) {
    console.error("Failed to save lead magnet idea", err);
  }
}

export function loadLeadMagnetIdea(): import("@/types/leadMagnet").LeadMagnetIdea | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as import("@/types/leadMagnet").LeadMagnetIdea;
  } catch (err) {
    console.error("Failed to load lead magnet idea", err);
  }
  return null;
}
