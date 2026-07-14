import { generateCircuit } from "../src/generator.ts";

const combos = [
  { duration: 15, intensity: "light" },
  { duration: 15, intensity: "moderate" },
  { duration: 15, intensity: "intense" },
  { duration: 20, intensity: "light" },
  { duration: 20, intensity: "moderate" },
  { duration: 20, intensity: "intense" },
  { duration: 30, intensity: "light" },
  { duration: 30, intensity: "moderate" },
  { duration: 30, intensity: "intense" },
];

let n = 1;
for (const opts of combos) {
  for (let i = 1; i <= 5; i++) {
    const c = generateCircuit(opts);
    const ex = c.sets
      .map((s) => `${s.exerciseId} ${s.quantityInput}${s.quantityType === "reps" ? "r" : ""}`)
      .join(" · ");
    console.log(
      `${n}. ${opts.duration}m/${opts.intensity} #${i} | ${c.rounds}R rest ${c.restBetweenRoundsInput} | ${ex}`,
    );
    n++;
  }
}
