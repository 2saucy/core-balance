import { MealPlanAPIRequest, MealPlanAPIResponse } from "../types/meal-types";


class MealPlanAPI {
  private baseUrl = '/api/generate-meal-plan';

  async generateMealPlan(data: MealPlanAPIRequest): Promise<MealPlanAPIResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error generating meal plan');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Método específico para regeneración
  async regenerateMeal(data: MealPlanAPIRequest): Promise<MealPlanAPIResponse> {
    return this.generateMealPlan(data);
  }

  // Validación antes de enviar
  private validateRequest(data: MealPlanAPIRequest): void {
    if (!data.calorie_target || data.calorie_target < 1000) {
      throw new Error('Calorie target must be at least 1000');
    }
    if (!data.meals_per_day || data.meals_per_day < 1) {
      throw new Error('Must have at least 1 meal per day');
    }
  }
}

export const mealPlanAPI = new MealPlanAPI();