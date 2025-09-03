export const STORAGE_KEYS = {
  BMI: "bmi_history",
  BODY_FAT: "body_fat_history", 
  CALORIES: "calories_history",
  IDEAL_WEIGHT: "ideal_weight_history",
  MACRO_SPLIT: "macro_split_history",
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];


// Meal Plans

export const DIET_OPTIONS = [
  { label: "Vegan", value: "vegan" },
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Keto", value: "keto" },
  { label: "Paleo", value: "paleo" },
  { label: "Mediterranean", value: "mediterranean" },
] as const;

export const PLAN_DURATION_OPTIONS = [
  { label: "1 Day", value: "1" },
  { label: "3 Days", value: "3" },
  { label: "7 Days", value: "7" },
  { label: "14 Days", value: "14" },
] as const;

export const DAILY_COST_OPTIONS = [
  { label: "Low ($10-15)", value: "low" },
  { label: "Medium ($15-25)", value: "medium" },
  { label: "High ($25+)", value: "high" },
] as const;

export const MEAL_PLAN_CONSTANTS = {
  MIN_CALORIES: 1000,
  MAX_CALORIES: 5000,
  MIN_MEALS: 1,
  MAX_MEALS: 8,
  DEFAULT_PLAN_DURATION: 7,
  MAX_PLAN_DURATION: 30,
  
  LOADING_MESSAGES: [
    "Buscando platos...",
    "Calculando macros...",
    "Generando recetas...",
    "Armando tu plan...",
  ],

  MACRO_CALORIES_PER_GRAM: {
    PROTEIN: 4,
    CARBS: 4,
    FATS: 9,
  },

  TOLERANCE_RANGES: {
    CALORIES: 0.05, // ±5%
    MACROS: 0.1,    // ±10%
  },
} as const;