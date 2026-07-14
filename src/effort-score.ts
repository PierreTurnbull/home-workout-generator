import type { CompletedWorkout } from "./types";

const EXERCISE_INTENSITY: Record<string, 1 | 2 | 3> = {
  "marching-in-place": 1,
  "toe-taps": 1,
  "squat-to-overhead-reach": 1,
  "side-shuffles": 1,
  "knee-pushups": 1,
  "wall-pushups": 1,
  "calf-raises": 1,
  "crunches": 1,
  "sit-ups": 1,
  "butt-kicks": 2,
  "jumping-jacks": 2,
  "high-knees": 2,
  "squats": 2,
  "glute-bridges": 2,
  "pushups": 2,
  "plank": 2,
  "burpees": 3,
  "tuck-jumps": 3,
  "star-jumps": 3,
  "broad-jumps": 3,
  "mountain-climbers": 3,
  "dive-bomber-pushups": 3,
  "pike-pushups": 3,
  "fast-feet": 3,
  "lateral-hops": 3,
  "skaters": 3,
  "sprawls": 3,
  "squat-thrusts": 3,
  "jump-squats": 3,
  "box-step-burpees": 3,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function durationScore(workout: CompletedWorkout): number {
  const durationMin = (workout.completedAt - workout.startedAt) / 60_000;
  const completionRatio =
    workout.plannedRounds > 0 ? workout.roundsCompleted / workout.plannedRounds : 1;

  const raw = 1 + (durationMin - 8) / 3;
  return clamp(raw * (0.55 + completionRatio * 0.45), 1, 10);
}

function intensityScore(workout: CompletedWorkout): number {
  const { sets } = workout.circuit;
  if (sets.length === 0) return 1;

  const avgExerciseIntensity =
    sets.reduce((sum, set) => sum + (EXERCISE_INTENSITY[set.exerciseId] ?? 2), 0) / sets.length;

  const volume = sets.length * workout.roundsCompleted;
  const volumeFactor = clamp((volume - 8) / 14, 0, 1);
  const exerciseFactor = (avgExerciseIntensity - 1) / 2;

  return clamp(2 + volumeFactor * 4 + exerciseFactor * 4, 1, 10);
}

export function computeEffortScore(workout: CompletedWorkout): number {
  const duration = durationScore(workout);
  const intensity = intensityScore(workout);
  return Math.round(clamp(duration * 0.5 + intensity * 0.5, 1, 10));
}

export function effortScoreClass(score: number): string {
  if (score <= 3) return "effort-low";
  if (score <= 6) return "effort-mid";
  return "effort-high";
}
