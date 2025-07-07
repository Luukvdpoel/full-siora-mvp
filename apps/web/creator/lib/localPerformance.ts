import type { PerformanceData } from "@creator/types/performance";

const STORAGE_KEY = "performanceMetrics";

export function savePerformance(data: PerformanceData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save performance metrics", err);
  }
}

export function loadPerformance(): PerformanceData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as PerformanceData;
  } catch (err) {
    console.error("Failed to load performance metrics", err);
  }
  return null;
}
