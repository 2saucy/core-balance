// app/meal-plans/page.tsx
"use client";

import MealPlansForm from "@/components/forms/meal-plans-form";
import { LoadingOverlay } from "@/components/loading-overlay";
import { MealPlanDisplay } from "@/components/meal-plan-display";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { MealPlansFormSchema } from "@/lib/validation/meal-plans-schema";

// Array of loading messages
const loadingMessages = [
  "Buscando platos...",
  "Calculando macros...",
  "Generando recetas...",
  "Armando tu plan...",
];

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

export default function MealPlansPage() {
  const [mealPlan, setMealPlan] = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
  const [formValues, setFormValues] = useState<z.infer<typeof MealPlansFormSchema> | null>(null);
  const [regeneratingMeal, setRegeneratingMeal] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (loading) {
      interval = setInterval(() => {
        setCurrentLoadingMessage(prevMessage => {
          const currentIndex = loadingMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 3000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const fetchMealPlan = async (data: z.infer<typeof MealPlansFormSchema>, lockedItems: MealItem[] = [], mealToRegenerate?: { dayIndex: number, mealIndex: number, currentMeal: Meal }) => {
    setLoading(true);
    setFormValues(data);
    
    try {
      const bodyData: any = { ...data, locked_items: lockedItems };
      if (mealToRegenerate) {
        bodyData.meal_to_regenerate = {
          day_index: mealToRegenerate.dayIndex,
          meal_index: mealToRegenerate.mealIndex,
          current_meal: mealToRegenerate.currentMeal
        };
        bodyData.existing_meal_plan = mealPlan;
      }

      const response = await fetch("/api/generate-meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meal plan.");
      }

      const result = await response.json();
      setMealPlan(result.mealPlan);
      toast.success("¡Plan de comidas generado exitosamente!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Fallo al generar el plan de comidas.");
      setMealPlan(null);
    } finally {
      setLoading(false);
      setRegeneratingMeal(null);
    }
  };

  const handleGeneratePlan = (data: z.infer<typeof MealPlansFormSchema>) => {
    fetchMealPlan(data);
  };

  const handleRegenerate = (lockedItems: MealItem[]) => {
    if (formValues) {
      fetchMealPlan(formValues, lockedItems);
    }
  };
  
  const handleRegenerateMeal = (dayIndex: number, mealIndex: number, currentMeal: Meal) => {
    const mealId = `${mealPlan?.[dayIndex]?.day}-${currentMeal.mealName}-${mealIndex}`;
    setRegeneratingMeal(mealId);
    if (formValues) {
      fetchMealPlan(formValues, [], { dayIndex, mealIndex, currentMeal });
    }
  };

  const handleSaveRoutine = () => {
    toast.success("¡Rutina guardada exitosamente!");
  };

  return (
    <div className="flex flex-col justify-center py-12 px-4 md:px-12 lg:px-[15%]">
      {loading && <LoadingOverlay message={currentLoadingMessage} />}

      <h2 className="text-4xl font-black whitespace-nowrap mb-8">
        Planes de Comidas
      </h2>

      <MealPlansForm onGeneratePlan={handleGeneratePlan} />

      {mealPlan && mealPlan.length > 0 && formValues && (
        <MealPlanDisplay
          mealPlan={mealPlan}
          handleSaveRoutine={handleSaveRoutine}
          loading={loading}
          handleRegenerate={handleRegenerate}
          handleRegenerateMeal={handleRegenerateMeal}
          regeneratingMeal={regeneratingMeal}
          preferences={formValues.prefered_foods || "No especificado"}
          dietType={formValues.type_of_diet || "No especificado"}
          totalCalories={formValues.calorie_target}
        />
      )}
    </div>
  );
}