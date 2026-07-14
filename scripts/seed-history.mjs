import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const HISTORY_STORAGE_KEY = "workout-circuit-history";
const ENTRY_COUNT = 50;

const CIRCUIT_TEMPLATES = [
  {
    label: "light-15",
    rounds: 3,
    rest: 30,
    durationMs: [11 * 60 * 1000, 14 * 60 * 1000],
    earlyChance: 0.35,
    sets: [
      { exerciseId: "marching-in-place", quantityType: "duration", reps: 10, durationSeconds: 35 },
      { exerciseId: "squats", quantityType: "reps", reps: 12, durationSeconds: 60 },
      { exerciseId: "knee-pushups", quantityType: "reps", reps: 10, durationSeconds: 60 },
      { exerciseId: "reverse-snow-angels", quantityType: "reps", reps: 12, durationSeconds: 60 },
      { exerciseId: "plank", quantityType: "duration", reps: 10, durationSeconds: 30 },
    ],
  },
  {
    label: "moderate-20",
    rounds: 3,
    rest: 45,
    durationMs: [16 * 60 * 1000, 20 * 60 * 1000],
    earlyChance: 0.2,
    sets: [
      { exerciseId: "jumping-jacks", quantityType: "duration", reps: 10, durationSeconds: 40 },
      { exerciseId: "reverse-lunges", quantityType: "reps", reps: 12, durationSeconds: 60 },
      { exerciseId: "glute-bridges", quantityType: "reps", reps: 15, durationSeconds: 60 },
      { exerciseId: "pushups", quantityType: "reps", reps: 10, durationSeconds: 60 },
      { exerciseId: "dead-bug-hold", quantityType: "duration", reps: 10, durationSeconds: 25 },
      { exerciseId: "bird-dog", quantityType: "reps", reps: 12, durationSeconds: 60 },
    ],
  },
  {
    label: "intense-30",
    rounds: 4,
    rest: 60,
    durationMs: [24 * 60 * 1000, 32 * 60 * 1000],
    earlyChance: 0.1,
    sets: [
      { exerciseId: "mountain-climbers", quantityType: "duration", reps: 10, durationSeconds: 40 },
      { exerciseId: "squats", quantityType: "reps", reps: 18, durationSeconds: 60 },
      { exerciseId: "glute-bridges", quantityType: "reps", reps: 18, durationSeconds: 60 },
      { exerciseId: "wide-pushups", quantityType: "reps", reps: 12, durationSeconds: 60 },
      { exerciseId: "swimmers", quantityType: "reps", reps: 18, durationSeconds: 60 },
      { exerciseId: "bicycle-crunches", quantityType: "reps", reps: 22, durationSeconds: 60 },
      { exerciseId: "burpees", quantityType: "reps", reps: 8, durationSeconds: 60 },
    ],
  },
];

function pickTemplate(index) {
  const progress = index / (ENTRY_COUNT - 1);
  if (progress < 0.35) return CIRCUIT_TEMPLATES[0];
  if (progress < 0.7) return CIRCUIT_TEMPLATES[1];
  return CIRCUIT_TEMPLATES[2];
}

function scaleTemplate(template, index) {
  const progress = index / (ENTRY_COUNT - 1);
  const repBoost = Math.floor(progress * 6);
  const durationBoost = Math.floor(progress * 10);

  return {
    ...template,
    earlyChance: Math.max(0.05, template.earlyChance - progress * 0.2),
    sets: template.sets.map((set) => ({
      ...set,
      reps: set.quantityType === "reps" ? set.reps + repBoost : set.reps,
      durationSeconds:
        set.quantityType === "duration"
          ? set.durationSeconds + durationBoost
          : set.durationSeconds,
    })),
  };
}

function buildEntry(index) {
  const template = scaleTemplate(pickTemplate(index), index);
  const progress = index / (ENTRY_COUNT - 1);
  const daysAgo = Math.round((ENTRY_COUNT - 1 - index) * 2.1);
  const completedAt = Date.now() - daysAgo * 24 * 60 * 60 * 1000 - (index % 3) * 3_600_000;

  const [minDuration, maxDuration] = template.durationMs;
  const durationSpan = maxDuration - minDuration;
  const workoutDuration = Math.round(minDuration + durationSpan * (0.35 + progress * 0.55));
  const startedAt = completedAt - workoutDuration;

  const finishedEarly = Math.random() < template.earlyChance;
  const plannedRounds = template.rounds;

  let roundsCompleted = plannedRounds;
  let stoppedAtRound;
  let stoppedAtExerciseId;

  if (finishedEarly) {
    const partialRounds = Math.max(1, Math.floor(plannedRounds * (0.45 + progress * 0.35)));
    roundsCompleted = Math.min(plannedRounds - 1, partialRounds);
    stoppedAtRound = roundsCompleted + 1;
    stoppedAtExerciseId = template.sets[Math.min(template.sets.length - 1, 1 + (index % 3))].exerciseId;
  }

  return {
    id: randomUUID(),
    startedAt,
    completedAt,
    finishedEarly,
    roundsCompleted,
    plannedRounds,
    stoppedAtRound: finishedEarly ? stoppedAtRound : undefined,
    stoppedAtExerciseId: finishedEarly ? stoppedAtExerciseId : undefined,
    circuit: {
      sets: template.sets,
      rounds: plannedRounds,
      restBetweenRoundsSeconds: template.rest,
    },
  };
}

const entries = Array.from({ length: ENTRY_COUNT }, (_, index) => buildEntry(index)).sort(
  (a, b) => b.completedAt - a.completedAt,
);

const outputPath = new URL("./seed-history-data.json", import.meta.url);
writeFileSync(outputPath, JSON.stringify(entries, null, 2));

console.log(`Wrote ${entries.length} entries to ${outputPath.pathname}`);
console.log(`Storage key: ${HISTORY_STORAGE_KEY}`);
console.log(
  "Load in browser (dev): visit http://localhost:5173/?seedHistory or run seedWorkoutHistory() in the console.",
);
