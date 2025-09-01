// meal-plans-schema.ts
import z from "zod";

export const MealPlansFormSchema = z.object({
  // Campos opcionales de texto
  type_of_diet: z.string().optional(),
  prefered_foods: z.string().max(1500).optional(),
  excluded_foods: z.string().max(1500).optional(),
  allergic_and_intolerances: z.string().max(1500).optional(),
  daily_cost: z.string().optional(),

  // Campos numéricos requeridos
  meals_per_day: z.coerce
    .number({
      error: "Por favor, ingresa un número para las comidas.",
    })
    .min(1, { message: "Necesitas al menos 1 comida por día." })
    .max(10, { message: "No puedes tener más de 10 comidas por día." }),

  calorie_target: z.coerce
    .number({
      error: "Por favor, ingresa un número para las calorías.",
    })
    .min(500, { message: "El objetivo de calorías es obligatorio." }),

  // Campos numéricos opcionales
  protein: z.coerce
    .number({
      error: "La proteína debe ser un número.",
    })
    .optional(),
  carbs: z.coerce
    .number({
      error: "Los carbohidratos deben ser un número.",
    })
    .optional(),
  fats: z.coerce
    .number({
      error: "Las grasas deben ser un número.",
    })
    .optional(),

  // Campo de duración de plan requerido
  plan_duration: z.string().min(1, { message: "Por favor, selecciona una duración." }),
});