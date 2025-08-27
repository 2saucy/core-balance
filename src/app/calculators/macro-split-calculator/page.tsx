"use client";

import * as React from "react";
import MacroSplitForm from "@/components/forms/macro-split-form";
import { MacroSplitResults } from "@/components/results/macrosplit-results";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { macroSplitFormValues } from "@/lib/validation/macro-split-schema";
import { toast } from "sonner";
import { MacroSplitResult, SavedMacroSplitResult } from "@/lib/types/macro-split.types";


const MACRO_SPLIT_STORAGE_KEY = "macro_split_history";

export default function MacroSplitPage() {
  const [results, setResults] = React.useState<MacroSplitResult | null>(null);
  const [history, setHistory] = React.useState<SavedMacroSplitResult[]>([]);

  React.useEffect(() => {
    const savedHistory = localStorage.getItem(MACRO_SPLIT_STORAGE_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleCalculate = (res: MacroSplitResult) => {
    // Definir las proporciones de macronutrientes aquí.
    // Puedes obtenerlas de formValues.dietPreference si está disponible
    // o usar un valor predeterminado.
    const proteinRatio = 0.3; // 30%
    const fatRatio = 0.25; // 25%
    const carbsRatio = 0.45; // 45%

    // Calcular los gramos de cada macro
    const proteinGrams = Math.round((res.calorieTarget * proteinRatio) / 4);
    const fatGrams = Math.round((res.calorieTarget * fatRatio) / 9);
    const carbsGrams = Math.round((res.calorieTarget * carbsRatio) / 4);

    const newResult: MacroSplitResult = {
      ...res,
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbsGrams,
    };

    setResults(newResult);
    
    const newEntry: SavedMacroSplitResult = {
      ...newResult,
      date: new Date().toISOString().split('T')[0],
    };
    
    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory];
      localStorage.setItem(MACRO_SPLIT_STORAGE_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const handleDelete = (indexToDelete: number) => {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.filter((_, index) => index !== indexToDelete);
      localStorage.setItem(MACRO_SPLIT_STORAGE_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
    toast.success("Record deleted successfully!");
  };

  const handleClearAll = () => {
    localStorage.removeItem(MACRO_SPLIT_STORAGE_KEY);
    setHistory([]);
    toast.success("All records cleared!");
  };

  return (
    <div className="flex justify-center py-12 px-4 md:px-12 lg:px-[15%]">
      <div className="flex-1 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Macro Split Calculator</h1>
          <p className="text-sm text-muted-foreground">
            This Macro Split Calculator estimates your daily calorie needs (TDEE) and macronutrient targets based on your personal data, activity level, goal, and diet preference.
          </p>
        </div>

        {/* Top Section: Form and Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Calculator Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your Macro Split</CardTitle>
              <CardDescription>Enter your information below.</CardDescription>
            </CardHeader>
            <CardContent>
              <MacroSplitForm onCalculate={handleCalculate} />
            </CardContent>
          </Card>

          {/* Right Column: Information Card */}
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Understanding the Calculation</CardDescription>
            </CardHeader>
            <ScrollArea className="text-sm text-muted-foreground p-0 max-h-[420px]">
              <div className="p-6 space-y-4">
                <p>
                  This calculator uses the Mifflin-St Jeor equation to estimate your Basal Metabolic Rate (BMR), which is the number of calories your body burns at rest.
                </p>
                <p>
                  Then, it multiplies your BMR by an activity factor to determine your Total Daily Energy Expenditure (TDEE), the total calories you burn each day, including exercise.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <b>Sedentary:</b> Little or no exercise (x 1.2)
                  </li>
                  <li>
                    <b>Lightly Active:</b> Exercise/sports 1-3 days/week (x 1.375)
                  </li>
                  <li>
                    <b>Moderately Active:</b> Exercise/sports 3-5 days/week (x 1.55)
                  </li>
                  <li>
                    <b>Active:</b> Exercise/sports 6-7 days a week (x 1.725)
                  </li>
                  <li>
                    <b>Very Active:</b> Very hard exercise/physical job or training twice a day (x 1.9)
                  </li>
                </ul>
                <p>
                  Finally, it adjusts your TDEE based on your goal (maintain, lose, or gain weight) and calculates your macronutrient split based on your diet preference.
                </p>
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Bottom Section: Results Card */}
        <div className="space-y-8">
          <MacroSplitResults results={results} history={history} onDelete={handleDelete} onClearAll={handleClearAll} />
        </div>
      </div>
    </div>
  );
}