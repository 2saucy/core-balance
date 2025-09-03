import { Meal, NutritionalTotals, DayPlan, NutritionalInsights } from "../types/meal-types";


export class NutritionCalculator {
  static calculateMealTotals(meal: Meal): NutritionalTotals {
    return meal.items.reduce(
      (acc, item) => ({
        totalCalories: acc.totalCalories + item.calories,
        totalProtein: acc.totalProtein + item.protein,
        totalCarbs: acc.totalCarbs + item.carbs,
        totalFats: acc.totalFats + item.fats,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 }
    );
  }

  static calculateDayTotals(meals: Meal[]): NutritionalTotals {
    return meals.reduce(
      (acc, meal) => {
        const mealTotals = this.calculateMealTotals(meal);
        return {
          totalCalories: acc.totalCalories + mealTotals.totalCalories,
          totalProtein: acc.totalProtein + mealTotals.totalProtein,
          totalCarbs: acc.totalCarbs + mealTotals.totalCarbs,
          totalFats: acc.totalFats + mealTotals.totalFats,
        };
      },
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 }
    );
  }

  static calculatePlanInsights(plan: DayPlan[]): NutritionalInsights | null {
    if (!plan.length) return null;

    const dailyTotals = plan.map(day => this.calculateDayTotals(day.meals));
    
    const avgDaily = dailyTotals.reduce(
      (acc, day) => ({
        totalCalories: acc.totalCalories + day.totalCalories / plan.length,
        totalProtein: acc.totalProtein + day.totalProtein / plan.length,
        totalCarbs: acc.totalCarbs + day.totalCarbs / plan.length,
        totalFats: acc.totalFats + day.totalFats / plan.length,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 }
    );

    return {
      dailyTotals,
      avgDaily,
      proteinPercent: (avgDaily.totalProtein * 4 / avgDaily.totalCalories) * 100,
      carbsPercent: (avgDaily.totalCarbs * 4 / avgDaily.totalCalories) * 100,
      fatsPercent: (avgDaily.totalFats * 9 / avgDaily.totalCalories) * 100,
    };
  }

  static generateShoppingList(plan: DayPlan[]): string[] {
    const allFoods = plan.flatMap(day =>
      day.meals.flatMap(meal => 
        meal.items.map(item => item.food)
      )
    );
    return [...new Set(allFoods)].sort();
  }

  static isWithinTargetRange(actual: number, target: number, tolerance = 0.1): boolean {
    const lowerBound = target * (1 - tolerance);
    const upperBound = target * (1 + tolerance);
    return actual >= lowerBound && actual <= upperBound;
  }
}