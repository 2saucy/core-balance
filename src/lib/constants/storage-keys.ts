export const STORAGE_KEYS = {
  BMI: "bmi_history",
  BODY_FAT: "body_fat_history", 
  CALORIES: "calories_history",
  IDEAL_WEIGHT: "ideal_weight_history",
  MACRO_SPLIT: "macro_split_history",
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];