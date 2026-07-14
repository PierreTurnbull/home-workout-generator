import type { CompletedWorkout } from "./types";

export const HISTORY_STORAGE_KEY = "workout-circuit-history";

export async function seedWorkoutHistory(): Promise<CompletedWorkout[]> {
  const response = await fetch("/seed-history-data.json");
  if (!response.ok) {
    throw new Error("Could not load seed history data");
  }

  const entries = (await response.json()) as CompletedWorkout[];
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
  return entries;
}

export function shouldSeedWorkoutHistoryFromQuery(): boolean {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).has("seedHistory");
}

export function clearSeedHistoryQueryParam(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("seedHistory");
  window.history.replaceState({}, "", url);
}
