// app/meal-plans/page.tsx
"use client";

import { MealPlanForm } from "@/components/forms/meal-plan-form";
import { LoadingOverlay } from "@/components/loading-overlay";
import { MealPlanDisplay } from "@/components/meal-plan-display";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Array of loading messages
const loadingMessages = [
  "Looking for dishes...",
  "Calculating macros...",
  "Generating recipes...",
  "Putting it all together...",
];

export default function MealPlansPage() {
  const [mealPlan, setMealPlan] = useState<any | null>(null);
  const [calories, setCalories] = useState<number | undefined>(2000);
  const [loading, setLoading] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);

  // Form state
  const [dietType, setDietType] = useState("");
  const [preferredFoods, setPreferredFoods] = useState("");
  const [excludedFoods, setExcludedFoods] = useState("");
  const [protein, setProtein] = useState<number | undefined>();
  const [carbs, setCarbs] = useState<number | undefined>();
  const [fats, setFats] = useState<number | undefined>();
  const [cost, setCost] = useState(""); // New state for cost

  // Loading message interval
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentLoadingMessage((prevMessage) => {
          const currentIndex = loadingMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setMealPlan(null);
    setCurrentLoadingMessage(loadingMessages[0]);
    try {
      const response = await fetch("/api/generate-meal-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calories,
          gender: "male",
          age: 30,
          goal: "maintain",
          dietType,
          preferredFoods,
          excludedFoods,
          protein,
          carbs,
          fats,
          cost, // Use the new cost state
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from API.");
      }

      const data = await response.json();
      setMealPlan(data.mealPlan);
      toast.success("Meal plan generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoutine = () => {
    toast.info("Meal plan saved!");
  };

  const calculateTotals = () => {
    if (!mealPlan) return { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 };
    return mealPlan.reduce((totals: any, meal: any) => {
      meal.items.forEach((item: any) => {
        totals.totalCalories += item.calories || 0;
        totals.totalProtein += item.protein || 0;
        totals.totalCarbs += item.carbs || 0;
        totals.totalFats += item.fats || 0;
      });
      return totals;
    }, { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 });
  };

  const totals = calculateTotals();

  return (
    <div className="flex flex-col justify-center py-12 px-4 md:px-12 lg:px-[15%]">
      {loading && <LoadingOverlay message={currentLoadingMessage} />}

      <h2 className="text-4xl font-black whitespace-nowrap mb-8">
        Daily Meal Planner
      </h2>

      <MealPlanForm
        calories={calories}
        setCalories={setCalories}
        dietType={dietType}
        setDietType={setDietType}
        preferredFoods={preferredFoods}
        setPreferredFoods={setPreferredFoods}
        excludedFoods={excludedFoods}
        setExcludedFoods={setExcludedFoods}
        protein={protein}
        setProtein={setProtein}
        carbs={carbs}
        setCarbs={setCarbs}
        fats={fats}
        setFats={setFats}
        cost={cost}
        setCost={setCost}
        handleGeneratePlan={handleGeneratePlan}
        loading={loading}
      />

      {mealPlan ? (
        <MealPlanDisplay
          mealPlan={mealPlan}
          totals={totals}
          handleSaveRoutine={handleSaveRoutine}
          loading={loading}
        />
      ) : (
        <div className="text-center text-muted-foreground mt-10">
          {loading ? "Generating your personalized meal plan..." : "Enter your calorie goal and click 'Generate with AI'."}
        </div>
      )}
    </div>
  );
}