// app/api/generate-meal-plan/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export async function POST(request: Request) {
  try {
    const { calories, gender, age, goal, dietType, preferredFoods, excludedFoods, protein, carbs, fats, cost } = await request.json();

    if (!calories) {
      return NextResponse.json({ error: "Calories are required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Generate a one-day meal plan for a user with the following details:
    - Daily calorie target: ${calories} kcal
    - Gender: ${gender || "not specified"}
    - Age: ${age || "not specified"}
    - Goal: ${goal || "not specified"}
    - Diet type: ${dietType || "not specified"}
    - Preferred foods to include: ${preferredFoods || "none"}
    - Foods to exclude: ${excludedFoods || "none"}
    - Macronutrient goals (grams): Protein ${protein || "not specified"}, Carbs ${carbs || "not specified"}, Fats ${fats || "not specified"}
    - Daily cost range (USD): ${cost || "not specified"}

    The meal plan should include breakfast, lunch, dinner, and 1-2 snacks.
    The total calories for the day must be close to the target.
    
    The response must be a valid JSON object with the following structure:
    {
      "mealPlan": [
        {
          "mealName": "Breakfast",
          "items": [
            { "food": "Scrambled eggs", "calories": 250, "protein": 15, "carbs": 2, "fats": 20 },
            { "food": "Avocado toast", "calories": 200, "protein": 5, "carbs": 25, "fats": 10 }
          ]
        },
        // ... (example structure)
      ]
    }
    
    Please ensure the total calories for the day is close to the target, and that the food items and calorie counts are realistic. Also, consider the user's diet preferences, preferred/excluded foods, macronutrient goals, and daily cost range.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const mealPlan = JSON.parse(jsonString);

    return NextResponse.json(mealPlan, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to generate meal plan." }, { status: 500 });
  }
}