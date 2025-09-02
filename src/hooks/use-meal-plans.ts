// src/hooks/use-meal-plans.ts
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { MealPlansFormSchema } from "@/lib/validation/meal-plans-schema";
import { DayPlan, SavedMealPlan, MealItem, Meal } from "@/lib/types/meal-types";


const MEAL_PLANS_KEY = "saved_meal_plans";
const CURRENT_MEAL_PLAN_KEY = "current_meal_plan";

export const useMealPlans = () => {
  const [mealPlan, setMealPlan] = useState<DayPlan[] | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [regeneratingMeal, setRegeneratingMeal] = useState<string | null>(null);

  // Load saved plans from localStorage
  const loadSavedPlans = useCallback(() => {
    try {
      const saved = localStorage.getItem(MEAL_PLANS_KEY);
      if (saved) {
        setSavedPlans(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading saved plans:", error);
      toast.error("Failed to load saved meal plans");
    }
  }, []);

  // Save plans to localStorage
  const savePlansToStorage = useCallback((plans: SavedMealPlan[]) => {
    try {
      localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(plans));
      setSavedPlans(plans);
    } catch (error) {
      console.error("Error saving plans:", error);
      toast.error("Failed to save meal plans");
    }
  }, []);

  // Generate meal plan with better error handling
  const generateMealPlan = useCallback(async (
    formData: z.infer<typeof MealPlansFormSchema>,
    lockedItems: MealItem[] = [],
    regenerationData?: { dayIndex: number; mealIndex: number; currentMeal: Meal }
  ) => {
    setLoading(true);

    try {
      const response = await fetch("/api/generate-meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          locked_items: lockedItems,
          ...(regenerationData && {
            meal_to_regenerate: {
              day_index: regenerationData.dayIndex,
              meal_index: regenerationData.mealIndex,
              current_meal: regenerationData.currentMeal
            },
            existing_meal_plan: mealPlan
          })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate meal plan");
      }

      const result = await response.json();

      // Validate the response structure
      if (!result.mealPlan || !Array.isArray(result.mealPlan)) {
        throw new Error("Invalid meal plan format received");
      }

      setMealPlan(result.mealPlan);

      // Auto-save current plan
      localStorage.setItem(CURRENT_MEAL_PLAN_KEY, JSON.stringify({
        plan: result.mealPlan,
        preferences: formData,
        createdAt: new Date().toISOString()
      }));

      toast.success("Meal plan generated successfully!");
      return result.mealPlan;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Meal plan generation error:", error);
      toast.error(error.message || "Failed to generate meal plan");
      throw error;
    } finally {
      setLoading(false);
      setRegeneratingMeal(null);
    }
  }, [mealPlan]);

  // Save current meal plan with name and tags
  const saveMealPlan = useCallback((
    name: string,
    preferences: z.infer<typeof MealPlansFormSchema>,
    tags: string[] = []
  ) => {
    if (!mealPlan) {
      toast.error("No meal plan to save");
      return;
    }

    const newPlan: SavedMealPlan = {
      id: crypto.randomUUID(),
      name: name.trim() || `Meal Plan ${new Date().toLocaleDateString()}`,
      plan: mealPlan,
      preferences,
      createdAt: new Date().toISOString(),
      isFavorite: false,
      tags
    };

    const updatedPlans = [newPlan, ...savedPlans];
    savePlansToStorage(updatedPlans);
    toast.success("Meal plan saved successfully!");
  }, [mealPlan, savedPlans, savePlansToStorage]);

  // Load a saved meal plan
  const loadMealPlan = useCallback((planId: string) => {
    const plan = savedPlans.find(p => p.id === planId);
    if (plan) {
      setMealPlan(plan.plan);
      toast.success(`Loaded "${plan.name}"`);
    } else {
      toast.error("Meal plan not found");
    }
  }, [savedPlans]);

  // Delete a saved meal plan
  const deleteMealPlan = useCallback((planId: string) => {
    const updatedPlans = savedPlans.filter(p => p.id !== planId);
    savePlansToStorage(updatedPlans);
    toast.success("Meal plan deleted");
  }, [savedPlans, savePlansToStorage]);

  // Toggle favorite status
  const toggleFavorite = useCallback((planId: string) => {
    const updatedPlans = savedPlans.map(plan =>
      plan.id === planId ? { ...plan, isFavorite: !plan.isFavorite } : plan
    );
    savePlansToStorage(updatedPlans);
    toast.success("Favorite status updated");
  }, [savedPlans, savePlansToStorage]);

  // Advanced meal regeneration with AI context
  const regenerateMealWithContext = useCallback(async (
    dayIndex: number,
    mealIndex: number,
    currentMeal: Meal,
    preferences: z.infer<typeof MealPlansFormSchema>
  ) => {
    const mealId = `${mealPlan?.[dayIndex]?.day}-${currentMeal.mealName}-${mealIndex}`;
    setRegeneratingMeal(mealId);

    try {
      await generateMealPlan(preferences, [], { dayIndex, mealIndex, currentMeal });
      toast.success("Meal regenerated with improved suggestions!");
    } catch (error) {
      toast.error("Failed to regenerate meal");
    }
  }, [mealPlan, generateMealPlan]);

  // Get nutritional insights
  const getNutritionalInsights = useCallback((plan: DayPlan[]) => {
    if (!plan.length) return null;

    const dailyTotals = plan.map(day => {
      return day.meals.reduce((acc, meal) => {
        meal.items.forEach(item => {
          acc.calories += item.calories;
          acc.protein += item.protein;
          acc.carbs += item.carbs;
          acc.fats += item.fats;
        });
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
    });

    const avgDaily = dailyTotals.reduce((acc, day) => ({
      calories: acc.calories + day.calories / plan.length,
      protein: acc.protein + day.protein / plan.length,
      carbs: acc.carbs + day.carbs / plan.length,
      fats: acc.fats + day.fats / plan.length,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    return {
      dailyTotals,
      avgDaily,
      proteinPercent: (avgDaily.protein * 4 / avgDaily.calories) * 100,
      carbsPercent: (avgDaily.carbs * 4 / avgDaily.calories) * 100,
      fatsPercent: (avgDaily.fats * 9 / avgDaily.calories) * 100,
    };
  }, []);

  useEffect(() => {
    loadSavedPlans();
    try {
      const currentPlan = localStorage.getItem(CURRENT_MEAL_PLAN_KEY);
      if (currentPlan) {
        setMealPlan(JSON.parse(currentPlan).plan);
      }
    } catch (error) {
      console.error("Error loading current plan:", error);
    }
  }, [loadSavedPlans]);

  return {
    // State
    mealPlan,
    savedPlans,
    loading,
    regeneratingMeal,

    // Actions
    generateMealPlan,
    saveMealPlan,
    loadMealPlan,
    deleteMealPlan,
    toggleFavorite,
    regenerateMealWithContext,
    loadSavedPlans,
    getNutritionalInsights,

    // Utilities
    setMealPlan,
    setLoading
  };
};