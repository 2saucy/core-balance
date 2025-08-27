import z from "zod";

export const MSAndCaloriesFormSchema = z.object({
  units: z.enum(["metric", "imperial"]),
  gender: z.enum(["male", "female", "other"]),
  age: z.coerce.number().min(0).max(120),
  height: z.coerce.number().min(100).max(250), // cm o in
  weight: z.coerce.number().min(30).max(300),  // kg o lbs
  activity_level: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  goal: z.enum(["maintain", "lose", "gain"]),
  bodyfat_percentage: z.coerce.number().min(0).max(100).optional(),
  diet_preference: z.enum(["balanced", "high_protein", "low_carb", "keto", "custom"]).optional()
});