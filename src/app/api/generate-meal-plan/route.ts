// app/api/generate-meal-plan/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export async function POST(request: Request) {
  try {
    const { 
      calorie_target, type_of_diet, plan_duration, meals_per_day, prefered_foods, 
      excluded_foods, protein, carbs, fats, daily_cost, allergic_and_intolerances, 
      locked_items, meal_to_regenerate, existing_meal_plan 
    } = await request.json();

    if (!calorie_target) {
      return NextResponse.json({ error: "Calorie target is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    if (meal_to_regenerate && existing_meal_plan) {
      // Logic for regenerating a single meal
      const { current_meal } = meal_to_regenerate;
      const mealName = current_meal.mealName;
      const mealCalories = current_meal.items.reduce((sum: number, item: { calories: number }) => sum + item.calories, 0);
      const mealProtein = current_meal.items.reduce((sum: number, item: { protein: number }) => sum + item.protein, 0);
      const mealCarbs = current_meal.items.reduce((sum: number, item: { carbs: number }) => sum + item.carbs, 0);
      const mealFats = current_meal.items.reduce((sum: number, item: { fats: number }) => sum + item.fats, 0);

      prompt = `
          Regenerate only the following meal for an existing meal plan. The new meal should be similar in nutritional values and respect the user's preferences and exclusions.

          **Existing Meal Plan (for context):**
          ${JSON.stringify(existing_meal_plan)}
          
          **Meal to regenerate:**
          - Meal Name: ${mealName}
          - Target Calories: ${mealCalories} kcal
          - Target Protein: ${mealProtein}g
          - Target Carbs: ${mealCarbs}g
          - Target Fats: ${mealFats}g
          
          **User Details:**
          - Diet Type: ${type_of_diet || "not specified"}
          - Preferred Foods: ${prefered_foods || "none"}
          - Excluded Foods: ${excluded_foods || "none"}
          - Allergies and intolerances: ${allergic_and_intolerances || "none"}
          
          **STRICT REQUIREMENTS:**
          1. The new meal must have an identical meal name: "${mealName}".
          2. The nutritional values (calories, protein, carbs, fats) of the new meal must be within ±10% of the target values.
          3. The response must be a valid JSON object with the following structure, containing **only** the regenerated meal object. Do not add any other text.

          {
            "mealName": "${mealName}",
            "items": [
              { "food": "New Food 1", "calories": 250, "protein": 15, "carbs": 2, "fats": 20 }
            ]
          }
      `;
    } else {
      // Logic for generating a complete plan
      prompt = `
          Generate a **complete and detailed** ${plan_duration}-day meal plan for a user with the following details:
          - Daily calorie target: ${calorie_target} kcal
          - Diet type: ${type_of_diet || "not specified"}
          - Preferred foods to include: ${prefered_foods || "none"}
          - Foods to exclude: ${excluded_foods || "none"}
          - Macronutrient goals (grams): Protein ${protein || "not specified"}, Carbs ${carbs || "not specified"}, Fats ${fats || "not specified"}
          - Daily cost range (USD): ${daily_cost || "not specified"}
          - Allergies and intolerances: ${allergic_and_intolerances || "none"}
          - Number of meals per day: ${meals_per_day || "not specified"}
          
          **LOCKED FOODS YOU MUST KEEP EXACTLY AS THEY ARE:**
          ${locked_items && locked_items.length > 0 ? JSON.stringify(locked_items) : "None"}

          STRICT REQUIREMENTS:
          1. The **total daily calories must not deviate more than ±5% (or ±100 kcal, whichever is smaller)** from the target of ${calorie_target} kcal.  
          2. Macronutrients must closely match the specified goals (if provided). Distribute them across meals realistically.  
          3. Foods excluded and allergies must never appear in the plan.  
          4. Preferred foods should appear regularly (at least several times per week).  
          5. Costs must stay within the given daily cost range if specified.  
          6. Each meal item must have realistic nutritional values (calories, protein, carbs, fats).  
          7. The meal items listed in "LOCKED FOODS" must be included exactly as they are.

          The response must be a valid JSON object with the following structure. **Do not add any additional text, notes, or explanations outside of the JSON block.** The "mealPlan" array must contain a plan for every single one of the ${plan_duration} days requested.

          {
            "mealPlan": [
              {
                "day": "Day 1",
                "meals": [
                  {
                    "mealName": "Breakfast",
                    "items": [
                      { "food": "Scrambled eggs", "calories": 250, "protein": 15, "carbs": 2, "fats": 20 }
                    ]
                  }
                ]
              }
            ]
          }

          Ensure each day's totals stay within the strict calorie deviation range and that macronutrients, diet preferences, exclusions, allergies, and cost constraints are respected.
          `;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '');
    const jsonStartIndex = cleanText.indexOf('{');
    const jsonEndIndex = cleanText.lastIndexOf('}') + 1;
    const finalJsonString = cleanText.substring(jsonStartIndex, jsonEndIndex);
    
    // Add a check to prevent parsing empty strings
    if (!finalJsonString) {
      throw new Error("Invalid JSON response from the AI model.");
    }
    
    const parsedResponse = JSON.parse(finalJsonString);

    if (meal_to_regenerate && existing_meal_plan) {
      const newMeal = parsedResponse;
      const updatedMealPlan = JSON.parse(JSON.stringify(existing_meal_plan));
      updatedMealPlan[meal_to_regenerate.day_index].meals[meal_to_regenerate.meal_index] = newMeal;
      return NextResponse.json({ mealPlan: updatedMealPlan });
    }

    return NextResponse.json({ mealPlan: parsedResponse.mealPlan });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return NextResponse.json({ error: "Failed to generate meal plan. Please try again." }, { status: 500 });
  }
}