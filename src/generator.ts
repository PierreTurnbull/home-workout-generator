import type { ExerciseSet, QuantityType } from "./types";

export type CircuitDuration = 15 | 20 | 30;
export type CircuitIntensity = "light" | "moderate" | "intense";

export interface GeneratorOptions {
  duration: CircuitDuration;
  intensity: CircuitIntensity;
}

type SlotKind =
  | "cardio"
  | "lower"
  | "hinge"
  | "upper-push"
  | "pull"
  | "core-static"
  | "core-dynamic"
  | "finisher";

type IntensityLevel = 1 | 2 | 3;

interface ExerciseSpec {
  id: string;
  kinds: SlotKind[];
  impact: "low" | "medium" | "high";
  minIntensity: IntensityLevel;
  maxIntensity: IntensityLevel;
  static: boolean;
  unilateral: boolean;
  quantityType: QuantityType;
  quantities: Record<CircuitIntensity, number>;
}

const INTENSITY_LEVEL: Record<CircuitIntensity, IntensityLevel> = {
  light: 1,
  moderate: 2,
  intense: 3,
};

const MAX_STATIC_PER_CIRCUIT = 2;

const EXERCISE_SPECS: ExerciseSpec[] = [
  // Cardio / locomotion
  { id: "butt-kicks", kinds: ["cardio"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "cross-jacks", kinds: ["cardio"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "fast-feet", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "high-knees", kinds: ["cardio"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "jumping-jacks", kinds: ["cardio"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 30, moderate: 40, intense: 45 } },
  { id: "lateral-hops", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "marching-in-place", kinds: ["cardio"], impact: "low", minIntensity: 1, maxIntensity: 2, static: false, unilateral: false, quantityType: "duration", quantities: { light: 40, moderate: 45, intense: 50 } },
  { id: "mountain-climbers", kinds: ["cardio", "finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 25, moderate: 35, intense: 40 } },
  { id: "punch-jacks", kinds: ["cardio"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "side-shuffles", kinds: ["cardio"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "skaters", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 25, moderate: 35, intense: 40 } },
  { id: "toe-taps", kinds: ["cardio"], impact: "low", minIntensity: 1, maxIntensity: 2, static: false, unilateral: false, quantityType: "duration", quantities: { light: 30, moderate: 35, intense: 40 } },
  { id: "bear-crawl", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 20, moderate: 25, intense: 30 } },
  { id: "crab-walk", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 20, moderate: 25, intense: 30 } },
  { id: "inchworms", kinds: ["cardio"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "squat-to-overhead-reach", kinds: ["cardio"], impact: "low", minIntensity: 1, maxIntensity: 2, static: false, unilateral: false, quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },

  // Squat / lunge patterns
  { id: "calf-raises", kinds: ["lower"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 15, moderate: 20, intense: 25 } },
  { id: "curtsy-lunges", kinds: ["lower"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: true, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "front-lunges", kinds: ["lower"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: true, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 16 } },
  { id: "lateral-lunges", kinds: ["lower"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: true, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "reverse-lunges", kinds: ["lower"], impact: "medium", minIntensity: 1, maxIntensity: 3, static: false, unilateral: true, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "squats", kinds: ["lower"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 20 } },
  { id: "step-ups", kinds: ["lower"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: true, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 14 } },
  { id: "sumo-squats", kinds: ["lower"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "wall-sit", kinds: ["lower"], impact: "low", minIntensity: 1, maxIntensity: 3, static: true, unilateral: false, quantityType: "duration", quantities: { light: 30, moderate: 40, intense: 50 } },

  // Hinge / posterior chain
  { id: "fire-hydrants", kinds: ["hinge"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: true, quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "glute-bridges", kinds: ["hinge"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "single-leg-glute-bridge", kinds: ["hinge"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: true, quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "superman-hold", kinds: ["hinge"], impact: "low", minIntensity: 1, maxIntensity: 3, static: true, unilateral: false, quantityType: "duration", quantities: { light: 25, moderate: 30, intense: 35 } },

  // Push
  { id: "decline-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "diamond-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "dive-bomber-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 5, moderate: 6, intense: 8 } },
  { id: "knee-pushups", kinds: ["upper-push"], impact: "low", minIntensity: 1, maxIntensity: 2, static: false, unilateral: false, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 15 } },
  { id: "pike-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 14 } },
  { id: "tricep-dips", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "walk-out-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "wall-pushups", kinds: ["upper-push"], impact: "low", minIntensity: 1, maxIntensity: 2, static: false, unilateral: false, quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "wide-pushups", kinds: ["upper-push"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },

  // Pull / scapular
  { id: "reverse-snow-angels", kinds: ["pull"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 18 } },
  { id: "swimmers", kinds: ["pull"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 20 } },
  { id: "ytw-raises", kinds: ["pull"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 15 } },

  // Static core / stability
  { id: "bear-hold", kinds: ["core-static"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: true, unilateral: false, quantityType: "duration", quantities: { light: 20, moderate: 25, intense: 30 } },
  { id: "hollow-hold", kinds: ["core-static"], impact: "low", minIntensity: 2, maxIntensity: 3, static: true, unilateral: false, quantityType: "duration", quantities: { light: 25, moderate: 35, intense: 45 } },
  { id: "plank", kinds: ["core-static"], impact: "low", minIntensity: 1, maxIntensity: 3, static: true, unilateral: false, quantityType: "duration", quantities: { light: 30, moderate: 45, intense: 60 } },
  { id: "side-plank", kinds: ["core-static"], impact: "low", minIntensity: 2, maxIntensity: 3, static: true, unilateral: false, quantityType: "duration", quantities: { light: 25, moderate: 35, intense: 45 } },

  // Dynamic core
  { id: "bicycle-crunches", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 16, moderate: 20, intense: 24 } },
  { id: "bird-dog", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: true, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 16 } },
  { id: "crunches", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 15, moderate: 18, intense: 22 } },
  { id: "dead-bug", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 16 } },
  { id: "flutter-kicks", kinds: ["core-dynamic"], impact: "low", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "leg-raises", kinds: ["core-dynamic"], impact: "low", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 15 } },
  { id: "plank-shoulder-taps", kinds: ["core-dynamic"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 16, moderate: 20, intense: 24 } },
  { id: "russian-twists", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 16, moderate: 20, intense: 24 } },
  { id: "sit-ups", kinds: ["core-dynamic"], impact: "low", minIntensity: 1, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 12, moderate: 15, intense: 20 } },

  // High-effort finishers
  { id: "box-step-burpees", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "broad-jumps", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "burpees", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
  { id: "jump-squats", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 10, moderate: 12, intense: 15 } },
  { id: "plank-jacks", kinds: ["finisher"], impact: "medium", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "duration", quantities: { light: 25, moderate: 30, intense: 35 } },
  { id: "sprawls", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "squat-thrusts", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "star-jumps", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 8, moderate: 10, intense: 12 } },
  { id: "tuck-jumps", kinds: ["finisher"], impact: "high", minIntensity: 2, maxIntensity: 3, static: false, unilateral: false, quantityType: "reps", quantities: { light: 6, moderate: 8, intense: 10 } },
];

const SPEC_BY_ID = new Map(EXERCISE_SPECS.map((spec) => [spec.id, spec]));

// Movement-pattern slot order (replaces duplicate lower slots).
const SLOT_PLANS: Record<CircuitDuration, SlotKind[]> = {
  15: ["cardio", "lower", "upper-push", "pull", "core-static"],
  20: ["cardio", "lower", "hinge", "upper-push", "core-static", "core-dynamic"],
  30: ["cardio", "lower", "hinge", "upper-push", "pull", "core-dynamic", "finisher"],
};

const DURATION_CONFIG: Record<
  CircuitDuration,
  { rounds: number; restSeconds: number; restInput: string }
> = {
  15: { rounds: 3, restSeconds: 30, restInput: "0:30" },
  20: { rounds: 3, restSeconds: 45, restInput: "0:45" },
  30: { rounds: 4, restSeconds: 60, restInput: "1:00" },
};

interface PickContext {
  usedExerciseIds: Set<string>;
  avoidExerciseId?: string;
  previousSpec?: ExerciseSpec;
  staticCount: number;
}

function slotKindsFor(options: GeneratorOptions): SlotKind[] {
  const base = [...SLOT_PLANS[options.duration]];

  // Light sessions skip high-effort finishers; use static core instead.
  if (options.duration === 30 && options.intensity === "light") {
    return base.map((kind) => (kind === "finisher" ? "core-static" : kind));
  }

  return base;
}

function pickOne<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("No exercise candidates available for slot");
  }
  return items[Math.floor(Math.random() * items.length)];
}

function jitterReps(value: number): number {
  const delta = Math.floor(Math.random() * 3) - 1;
  return Math.max(4, value + delta);
}

function jitterDuration(value: number): number {
  const deltas = [-5, 0, 0, 5];
  return Math.max(15, value + pickOne(deltas));
}

function formatQuantityInput(quantityType: QuantityType, value: number): string {
  if (quantityType === "reps") return String(value);

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function isAllowedForIntensity(spec: ExerciseSpec, intensity: CircuitIntensity): boolean {
  const level = INTENSITY_LEVEL[intensity];
  if (level < spec.minIntensity || level > spec.maxIntensity) return false;
  if (intensity === "light" && spec.impact === "high") return false;

  if (intensity === "moderate" && spec.kinds.includes("finisher") && spec.impact === "high") {
    return Math.random() < 0.5;
  }

  return true;
}

function candidatesForSlot(kind: SlotKind, intensity: CircuitIntensity): ExerciseSpec[] {
  return EXERCISE_SPECS.filter(
    (spec) => spec.kinds.includes(kind) && isAllowedForIntensity(spec, intensity),
  );
}

function applyPickConstraints(pool: ExerciseSpec[], context: PickContext): ExerciseSpec[] {
  let filtered = pool.filter(
    (spec) =>
      !context.usedExerciseIds.has(spec.id) && spec.id !== context.avoidExerciseId,
  );

  if (filtered.length === 0) {
    filtered = pool.filter((spec) => spec.id !== context.avoidExerciseId);
  }

  if (filtered.length === 0) {
    filtered = pool;
  }

  const withStaticLimit =
    context.staticCount >= MAX_STATIC_PER_CIRCUIT
      ? filtered.filter((spec) => !spec.static)
      : filtered;

  const withoutConsecutiveStatic =
    context.previousSpec?.static === true
      ? withStaticLimit.filter((spec) => !spec.static)
      : withStaticLimit;

  const withoutConsecutiveUnilateral =
    context.previousSpec?.unilateral === true
      ? withoutConsecutiveStatic.filter((spec) => !spec.unilateral)
      : withoutConsecutiveStatic;

  if (withoutConsecutiveUnilateral.length > 0) return withoutConsecutiveUnilateral;
  if (withoutConsecutiveStatic.length > 0) return withoutConsecutiveStatic;
  if (withStaticLimit.length > 0) return withStaticLimit;
  return filtered;
}

function buildExerciseSet(spec: ExerciseSpec, intensity: CircuitIntensity): ExerciseSet {
  const baseQuantity = spec.quantities[intensity];
  const quantity =
    spec.quantityType === "reps" ? jitterReps(baseQuantity) : jitterDuration(baseQuantity);

  return {
    id: crypto.randomUUID(),
    exerciseId: spec.id,
    quantityType: spec.quantityType,
    reps: spec.quantityType === "reps" ? quantity : 10,
    durationSeconds: spec.quantityType === "duration" ? quantity : 60,
    quantityInput: formatQuantityInput(spec.quantityType, quantity),
  };
}

function pickExerciseForSlot(
  kind: SlotKind,
  intensity: CircuitIntensity,
  context: PickContext,
): ExerciseSpec {
  const pool = candidatesForSlot(kind, intensity);
  if (pool.length === 0) {
    throw new Error(`No exercises configured for ${kind} at ${intensity} intensity`);
  }

  return pickOne(applyPickConstraints(pool, context));
}

function buildCircuitSets(
  slotKinds: SlotKind[],
  intensity: CircuitIntensity,
): ExerciseSet[] {
  const usedExerciseIds = new Set<string>();
  const specs: ExerciseSpec[] = [];
  let staticCount = 0;

  for (const kind of slotKinds) {
    const spec = pickExerciseForSlot(kind, intensity, {
      usedExerciseIds,
      previousSpec: specs[specs.length - 1],
      staticCount,
    });
    specs.push(spec);
    usedExerciseIds.add(spec.id);
    if (spec.static) staticCount += 1;
  }

  return specs.map((spec) => buildExerciseSet(spec, intensity));
}

export function generateCircuit(options: GeneratorOptions): {
  sets: ExerciseSet[];
  rounds: number;
  restBetweenRoundsSeconds: number;
  restBetweenRoundsInput: string;
} {
  const slotKinds = slotKindsFor(options);
  const config = DURATION_CONFIG[options.duration];

  return {
    sets: buildCircuitSets(slotKinds, options.intensity),
    rounds: config.rounds,
    restBetweenRoundsSeconds: config.restSeconds,
    restBetweenRoundsInput: config.restInput,
  };
}

export function regenerateExerciseAtIndex(
  index: number,
  sets: ExerciseSet[],
  options: GeneratorOptions,
): ExerciseSet {
  const slotKinds = slotKindsFor(options);
  const kind = slotKinds[Math.min(index, slotKinds.length - 1)];
  const currentExerciseId = sets[index]?.exerciseId;
  const usedExerciseIds = new Set(
    sets.filter((_, setIndex) => setIndex !== index).map((set) => set.exerciseId),
  );

  const previousSet = sets[index - 1];
  const previousSpec = previousSet ? SPEC_BY_ID.get(previousSet.exerciseId) : undefined;
  const staticCount = sets.reduce((count, set, setIndex) => {
    if (setIndex === index) return count;
    const spec = SPEC_BY_ID.get(set.exerciseId);
    return spec?.static ? count + 1 : count;
  }, 0);

  const spec = pickExerciseForSlot(kind, options.intensity, {
    usedExerciseIds,
    avoidExerciseId: currentExerciseId,
    previousSpec,
    staticCount,
  });

  return buildExerciseSet(spec, options.intensity);
}
