"use client";

import * as React from "react";
import MacroSplitForm from "@/components/forms/macro-split-form";
import { CaloriesResults } from "@/components/results/calories-results";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { CaloriesResult, SavedCaloriesResult } from "@/lib/types/calories.types";


const CALORIES_STORAGE_KEY = "calories_history";

export default function CaloriesPage() {
  const [results, setResults] = React.useState<CaloriesResult | null>(null);
  const [history, setHistory] = React.useState<SavedCaloriesResult[]>([]);

  React.useEffect(() => {
    const savedHistory = localStorage.getItem(CALORIES_STORAGE_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleCalculate = (res: CaloriesResult) => {
    setResults(res);
    handleSave(res);
  };

  const handleSave = (res: CaloriesResult) => {
    const newEntry: SavedCaloriesResult = {
      ...res,
      date: new Date().toISOString().split('T')[0],
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(CALORIES_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedHistory = history.filter((_, index) => index !== indexToDelete);
    setHistory(updatedHistory);
    localStorage.setItem(CALORIES_STORAGE_KEY, JSON.stringify(updatedHistory));
    toast.success("Record deleted successfully!");
  };

  const handleClearAll = () => {
    setHistory([]);
    localStorage.removeItem(CALORIES_STORAGE_KEY);
    toast.success("All records cleared!");
  };

  return (
    <div className="flex justify-center py-12 px-4 md:px-12 lg:px-[15%]">
      <div className="flex-1 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Calories Calculator</h1>
          <p className="text-sm text-muted-foreground">
            This calculator estimates your daily calorie needs: Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and a suggested calorie target based on your goals.
          </p>
        </div>

        {/* Top Section: Form and Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Calculator Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your Calorie Needs</CardTitle>
              <CardDescription>Enter your information below.</CardDescription>
            </CardHeader>
            <CardContent>
              <MacroSplitForm onCalculate={handleCalculate} />
            </CardContent>
          </Card>

          {/* Right Column: Information Card */}
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle>What are Calorie Needs?</CardTitle>
              <CardDescription>Understanding BMR, TDEE, and Calorie Targets</CardDescription>
            </CardHeader>
            <ScrollArea className=" text-sm text-muted-foreground p-0 max-h-[420px]">
              <div className="p-6 space-y-4">
                <h3><b>Basal Metabolic Rate (BMR)</b></h3>
                <p>
                  Your BMR is the number of calories your body burns at rest to maintain basic bodily functions like breathing, circulation, and cell production. It is the minimum amount of energy your body needs to survive.
                </p>
                <h3><b>Total Daily Energy Expenditure (TDEE)</b></h3>
                <p>
                  Your TDEE is an estimate of how many calories you burn per day, including your BMR and the calories burned during physical activity. It&apos;s the total number of calories you need to consume to maintain your current weight.
                </p>
                <h3><b>Calorie Target</b></h3>
                <p>
                  The Calorie Target is your TDEE adjusted for your weight goal (maintenance, loss, or gain).
                  <ul className="list-disc list-inside mt-2">
                    <li>For weight loss, a deficit of 500 kcal is typically suggested.</li>
                    <li>For weight gain, a surplus of 500 kcal is typically suggested.</li>
                  </ul>
                </p>
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Bottom Section: Results Card */}
        <div className="space-y-8">
          <CaloriesResults results={results} history={history} onDelete={handleDelete} onClearAll={handleClearAll} />
        </div>
      </div>
    </div>
  );
}