// meal-plans-schema.ts
import z from "zod";

// Schema de validación mejorado
export const MealPlansFormSchema = z.object({
  // Campos requeridos
  calorie_target: z.coerce.number().min(1000).max(5000),
  meals_per_day: z.coerce.number().min(1).max(8),
  
  // Campos opcionales con valores por defecto
  type_of_diet: z.string().optional(),
  plan_duration: z.string().default("7"),
  prefered_foods: z.string().optional(),
  excluded_foods: z.string().optional(),
  allergic_and_intolerances: z.string().optional(),
  daily_cost: z.enum(["low", "medium", "high"]).optional(),
  
  // Macronutrientes opcionales
  protein: z.coerce.number().optional(),
  carbs: z.coerce.number().optional(),
  fats: z.coerce.number().optional(),
});