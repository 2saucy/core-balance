import { Day } from "./types/routine-builder-types";

export const generateDaysForSplit = (split: string): Day[] => {
  switch (split) {
    case "Full Body":
      return Array.from({ length: 3 }).map((_, i) => ({
        name: `Day ${i + 1} (Full Body)`,
        exercises: [],
        category: "FullBody"
      }));
    case "Push-Pull-Legs":
      return [
        { name: "Day 1 (Push)", exercises: [], category: "Push" },
        { name: "Day 2 (Pull)", exercises: [], category: "Pull" },
        { name: "Day 3 (Legs)", exercises: [], category: "Legs" }
      ];
    case "Weider":
      return [
        { name: "Day 1 (Chest)", exercises: [], category: "Chest" },
        { name: "Day 2 (Back)", exercises: [], category: "Back" },
        { name: "Day 3 (Legs)", exercises: [], category: "Legs" },
        { name: "Day 4 (Shoulders)", exercises: [], category: "Shoulders" },
        { name: "Day 5 (Arms)", exercises: [], category: "Arms" }
      ];
    case "Upper/Lower":
      return [
        { name: "Day 1 (Upper Body)", exercises: [], category: "Upper" },
        { name: "Day 2 (Lower Body)", exercises: [], category: "Lower" }
      ];
    case "Arnold Split":
      return [
        { name: "Day 1 (Chest & Back)", exercises: [], category: "ChestBack" },
        { name: "Day 2 (Shoulders & Arms)", exercises: [], category: "ShouldersArms" },
        { name: "Day 3 (Legs & Core)", exercises: [], category: "LegsCore" }
      ];
    case "Bro Split":
      return [
        { name: "Day 1 (Chest)", exercises: [], category: "Chest" },
        { name: "Day 2 (Back)", exercises: [], category: "Back" },
        { name: "Day 3 (Shoulders)", exercises: [], category: "Shoulders" },
        { name: "Day 4 (Arms)", exercises: [], category: "Arms" },
        { name: "Day 5 (Legs)", exercises: [], category: "Legs" },
      ];
    default:
      return [{ name: "Day 1", exercises: [] }];
  }
};
export const splits = ["Full Body", "Push-Pull-Legs", "Weider", "Upper/Lower", "Arnold Split", "Bro Split"];

export const categoryMap: Record<string, string[]> = {
  Push: ["Chest", "Shoulders", "Arms"],
  Pull: ["Back", "Arms"],
  Legs: ["Legs"],
  Chest: ["Chest"],
  Back: ["Back"],
  Shoulders: ["Shoulders"],
  Arms: ["Arms"],
  Core: ["Core"],
  FullBody: ["Chest", "Back", "Legs", "Arms", "Shoulders", "Core"],
  Upper: ["Chest", "Back", "Shoulders", "Arms"],
  Lower: ["Legs", "Core"],
  ChestBack: ["Chest", "Back"],
  ShouldersArms: ["Shoulders", "Arms"],
  LegsCore: ["Legs", "Core"],
};

export const exercisesByCategory: Record<string, string[]> = {
  Chest: ["Push-up", "Bench Press", "Chest Fly", "Incline Bench Press", "Cable Crossover", "Dumbbell Pullover"],
  Back: ["Pull-up", "Deadlift", "Row", "Lat Pulldown", "Seated Cable Row", "T-Bar Row"],
  Legs: ["Squat", "Lunge", "Leg Press", "Leg Extension", "Leg Curl", "Glute Bridge", "Calf Raise"],
  Arms: ["Bicep Curl", "Tricep Dip", "Hammer Curl", "Tricep Pushdown", "Concentration Curl", "Overhead Tricep Extension"],
  Shoulders: ["Overhead Press", "Lateral Raise", "Front Raise", "Rear Delt Fly", "Arnold Press", "Shrugs"],
  Core: ["Plank", "Russian Twist", "Sit-up", "Leg Raise", "Bicycle Crunch", "Mountain Climber", "Hanging Knee Raise"]
};
