// app/api/generate-meal-plan/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is required');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

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

interface RegenerationRequest {
  day_index: number;
  meal_index: number;
  current_meal: Meal;
}

interface RequestBody {
  calorie_target: number;
  type_of_diet?: string;
  plan_duration?: string;
  meals_per_day: number;
  prefered_foods?: string;
  excluded_foods?: string;
  protein?: number;
  carbs?: number;
  fats?: number;
  daily_cost?: string;
  allergic_and_intolerances?: string;
  locked_items?: MealItem[];
  meal_to_regenerate?: RegenerationRequest;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existing_meal_plan?: any[];
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    
    // Validate required fields
    if (!body.calorie_target) {
      return NextResponse.json({ error: "Calorie target is required" }, { status: 400 });
    }
    
    if (!body.meals_per_day) {
      return NextResponse.json({ error: "Meals per day is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 4096,
      }
    });

    const prompt = body.meal_to_regenerate && body.existing_meal_plan
      ? buildRegenerationPrompt(body)
      : buildFullPlanPrompt(body);

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean and parse JSON response
    const cleanedResponse = cleanJsonResponse(text);
    const parsedResponse = JSON.parse(cleanedResponse);

    // Handle regeneration vs full plan response
    if (body.meal_to_regenerate && body.existing_meal_plan) {
      const updatedPlan = updateMealPlan(
        body.existing_meal_plan,
        body.meal_to_regenerate,
        parsedResponse
      );
      return NextResponse.json({ mealPlan: updatedPlan });
    }

    // Validate full plan response
    if (!parsedResponse.mealPlan || !Array.isArray(parsedResponse.mealPlan)) {
      throw new Error("Invalid meal plan format from AI");
    }

    return NextResponse.json({ mealPlan: parsedResponse.mealPlan });

  } catch (error) {
    console.error("Error generating meal plan:", error);
    
    // Return specific error messages
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid response format from AI. Please try again." }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate meal plan" }, 
      { status: 500 }
    );
  }
}

function buildRegenerationPrompt(body: RequestBody): string {
  const { meal_to_regenerate: regen, existing_meal_plan } = body;
  if (!regen) throw new Error("Missing regeneration data");

  const currentMeal = regen.current_meal;
  const mealCalories = currentMeal.items.reduce((sum, item) => sum + item.calories, 0);
  const mealProtein = currentMeal.items.reduce((sum, item) => sum + item.protein, 0);
  const mealCarbs = currentMeal.items.reduce((sum, item) => sum + item.carbs, 0);
  const mealFats = currentMeal.items.reduce((sum, item) => sum + item.fats, 0);

  return `
Regenerate ONLY the following meal while maintaining similar nutritional values:

**Current Meal Plan Context:**
${JSON.stringify(existing_meal_plan, null, 2)}

**Meal to Replace:**
- Name: ${currentMeal.mealName}
- Target Calories: ${mealCalories} kcal (±10% acceptable)
- Target Protein: ${mealProtein}g (±10% acceptable)
- Target Carbs: ${mealCarbs}g (±10% acceptable)  
- Target Fats: ${mealFats}g (±10% acceptable)

**User Preferences:**
- Diet Type: ${body.type_of_diet || "No restriction"}
- Preferred Foods: ${body.prefered_foods || "None specified"}
- Excluded Foods: ${body.excluded_foods || "None"}
- Allergies/Intolerances: ${body.allergic_and_intolerances || "None"}

**REQUIREMENTS:**
1. Keep the exact meal name: "${currentMeal.mealName}"
2. Stay within ±10% of nutritional targets
3. Avoid foods in exclusion list and allergies
4. Prefer foods from preferred list when possible
5. Create varied, realistic food combinations

Respond with ONLY this JSON structure (no additional text):
{
  "mealName": "${currentMeal.mealName}",
  "items": [
    { "food": "Food Name", "calories": 250, "protein": 20, "carbs": 15, "fats": 12 }
  ]
}`;
}

function buildFullPlanPrompt(body: RequestBody): string {
  const duration = parseInt(body.plan_duration || "7");
  
  return `
Generate a complete ${duration}-day meal plan with these specifications:

**Daily Targets:**
- Calories: ${body.calorie_target} kcal (±5% or ±100 kcal max deviation)
- Meals per day: ${body.meals_per_day}
- Protein: ${body.protein || "balanced"} grams
- Carbs: ${body.carbs || "balanced"} grams  
- Fats: ${body.fats || "balanced"} grams

**Dietary Preferences:**
- Diet Type: ${body.type_of_diet || "No restriction"}
- Preferred Foods: ${body.prefered_foods || "None specified"}
- Excluded Foods: ${body.excluded_foods || "None"}
- Allergies/Intolerances: ${body.allergic_and_intolerances || "None"}
- Daily Cost: ${body.daily_cost || "No limit"}

**Locked Foods (MUST include exactly as shown):**
${body.locked_items && body.locked_items.length > 0 ? 
  JSON.stringify(body.locked_items, null, 2) : "None"}

**STRICT REQUIREMENTS:**
1. Daily calories must stay within ±5% of ${body.calorie_target} kcal
2. Include all locked foods exactly as specified
3. Never use excluded foods or allergens
4. Prioritize preferred foods (use frequently)
5. Distribute macros realistically across meals
6. Use realistic portion sizes and nutritional values
7. Create ${duration} complete days of meals

Respond with ONLY this JSON structure (no additional text):
{
  "mealPlan": [
    {
      "day": "Day 1",
      "meals": [
        {
          "mealName": "Breakfast",
          "items": [
            { "food": "Food Name", "calories": 300, "protein": 25, "carbs": 20, "fats": 15 }
          ]
        }
      ]
    }
  ]
}

Generate ALL ${duration} days with consistent nutrition and variety.`;
}

function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '');
  
  // Find JSON boundaries
  const jsonStart = cleaned.indexOf('{');
  const jsonEnd = cleaned.lastIndexOf('}') + 1;
  
  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error("No valid JSON found in response");
  }
  
  return cleaned.substring(jsonStart, jsonEnd);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateMealPlan(existingPlan: any[], regenerationData: RegenerationRequest, newMeal: Meal): any[] {
  const updatedPlan = JSON.parse(JSON.stringify(existingPlan));
  updatedPlan[regenerationData.day_index].meals[regenerationData.meal_index] = newMeal;
  return updatedPlan;
}