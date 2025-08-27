// src/lib/calculations/calories.ts

import { CaloriesResult } from "../types/calories.types";
import { macroSplitFormValues as CaloriesFormValues } from "../types/ms-and-calories-types";


// Activity level multipliers for TDEE calculation
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
} as const;

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
 */
export function calculateBMR(values: CaloriesFormValues): number {
  const { units, gender, age, height, weight } = values;

  // Convert to metric if needed
  const weightKg = units === "imperial" ? weight * 0.453592 : weight;
  const heightCm = units === "imperial" ? height * 2.54 : height;

  // Mifflin-St Jeor Equation
  const baseValue = (10 * weightKg) + (6.25 * heightCm) - (5 * age);

  switch (gender) {
    case "male":
      return baseValue + 5;
    case "female":
      return baseValue - 161;
    case "other":
    default:
      // Use average of male and female values
      return baseValue - 78;
  }
}

/**
 * Calculate Total Daily Energy Expenditure
 */
export function calculateTDEE(bmr: number, activityLevel: keyof typeof ACTIVITY_MULTIPLIERS): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
}

/**
 * Calculate calorie target based on goal
 */
export function calculateCalorieTarget(tdee: number, goal: "maintain" | "lose" | "gain"): number {
  switch (goal) {
    case "lose":
      return tdee - 500; // 500 calorie deficit
    case "gain":
      return tdee + 500; // 500 calorie surplus
    case "maintain":
    default:
      return tdee;
  }
}

/**
 * Main calculation function for calories
 */
export function calculateCalories(values: CaloriesFormValues): CaloriesResult {
  const bmr = calculateBMR(values);
  const tdee = calculateTDEE(bmr, values.activity_level);
  const calorieTarget = calculateCalorieTarget(tdee, values.goal);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget: Math.round(calorieTarget),
    formValues: values,
  };
}

/**
 * Calculate macronutrient split based on diet preference
 */
export function calculateMacroSplit(calories: number, dietPreference: string = "balanced") {
  let proteinRatio: number;
  let fatRatio: number;
  let carbsRatio: number;

  switch (dietPreference) {
    case "high_protein":
      proteinRatio = 0.35;
      fatRatio = 0.25;
      carbsRatio = 0.40;
      break;
    case "low_carb":
      proteinRatio = 0.30;
      fatRatio = 0.45;
      carbsRatio = 0.25;
      break;
    case "high_carb":
      proteinRatio = 0.15;
      fatRatio = 0.20;
      carbsRatio = 0.65;
      break;
    case "balanced":
    default:
      proteinRatio = 0.30;
      fatRatio = 0.25;
      carbsRatio = 0.45;
      break;
  }

  return {
    protein: Math.round((calories * proteinRatio) / 4), // 4 cal/g
    fat: Math.round((calories * fatRatio) / 9), // 9 cal/g
    carbs: Math.round((calories * carbsRatio) / 4), // 4 cal/g
  };
}