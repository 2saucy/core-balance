import z from "zod";
import { MealPlansFormSchema } from "../validation/meal-plans-schema";

interface MealItem {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Meal {
  mealName: string;
  items: MealItem[];
}

interface DayPlan {
  day: string;
  meals: Meal[];
}

interface SavedMealPlan {
  id: string;
  name: string;
  plan: DayPlan[];
  preferences: z.infer<typeof MealPlansFormSchema>;
  createdAt: string;
  isFavorite: boolean;
  tags: string[];
}

type MealPlansFormValues = z.infer<typeof MealPlansFormSchema>;

export type { MealItem, Meal, DayPlan, SavedMealPlan, MealPlansFormValues };
