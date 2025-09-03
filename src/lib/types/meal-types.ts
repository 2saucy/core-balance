// types/meal-plans.types.ts
import { z } from "zod";
import { MealPlansFormSchema } from "../validation/meal-plans-schema";


// Tipos base
export interface MealItem {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  mealName: string;
  items: MealItem[];
}

export interface DayPlan {
  day: string;
  meals: Meal[];
}

export interface NutritionalTotals {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

// Tipos derivados
export type MealPlansFormValues = z.infer<typeof MealPlansFormSchema>;

export interface SavedMealPlan {
  id: string;
  name: string;
  plan: DayPlan[];
  preferences: MealPlansFormValues;
  createdAt: string;
  isFavorite: boolean;
  tags: string[];
}

export interface NutritionalInsights {
  dailyTotals: NutritionalTotals[];
  avgDaily: NutritionalTotals;
  proteinPercent: number;
  carbsPercent: number;
  fatsPercent: number;
}

// Tipos para API
export interface RegenerationRequest {
  day_index: number;
  meal_index: number;
  current_meal: Meal;
}

export interface MealPlanAPIRequest extends MealPlansFormValues {
  locked_items?: MealItem[];
  meal_to_regenerate?: RegenerationRequest;
  existing_meal_plan?: DayPlan[];
}

export interface MealPlanAPIResponse {
  mealPlan: DayPlan[];
}

// Estados de UI
export interface UIState {
  loading: boolean;
  regeneratingMeal: string | null;
  expandedMeals: Record<string, boolean>;
  activeDay: string;
  showSavedPlans: boolean;
  saveDialogOpen: boolean;
}

// Hooks personalizados tipos
export interface UseMealPlansReturn {
  // Estado
  currentPlan: DayPlan[] | null;
  savedPlans: SavedMealPlan[];
  loading: boolean;
  lockedItems: MealItem[];
  lastFormValues: MealPlansFormValues | null;
  
  // Acciones
  generateMealPlan: (formData: MealPlansFormValues, locked?: MealItem[]) => Promise<void>;
  regenerateMeal: (dayIndex: number, mealIndex: number, meal: Meal) => Promise<void>;
  saveMealPlan: (name: string, tags?: string[]) => void;
  loadMealPlan: (planId: string) => void;
  deleteMealPlan: (planId: string) => void;
  
  // Utilidades
  calculateDailyTotals: (meals: Meal[]) => NutritionalTotals;
  generateShoppingList: (plan?: DayPlan[]) => string[];
  getNutritionalInsights: (plan?: DayPlan[]) => NutritionalInsights | null;
  
  // Gestión de items bloqueados
  toggleLockItem: (item: MealItem) => void;
  clearLockedItems: () => void;
  isItemLocked: (foodName: string) => boolean;
}