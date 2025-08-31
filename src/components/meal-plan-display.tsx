// components/MealPlanDisplay.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NotepadText, Download, ChevronDown, ChevronUp, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function MealPlanDisplay({ mealPlan, totals, handleSaveRoutine, loading }: {
  mealPlan: any;
  totals: any;
  handleSaveRoutine: () => void;
  loading: boolean;
}) {
  const [isMealOpen, setIsMealOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      {/* Main Meal Plan Column */}
      <div className="flex-1 space-y-4">
        {mealPlan.map((meal: any, index: number) => (
          <Collapsible key={index} open={isMealOpen} onOpenChange={setIsMealOpen} className="bg-card text-card-foreground shadow-sm rounded-lg border">
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 font-semibold text-lg">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 opacity-50" />
                {meal.mealName}
              </div>
              {isMealOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-4 space-y-3">
              <ul className="list-none space-y-2">
                {meal.items.map((item: any, i: number) => (
                  <li key={i} className="flex flex-col p-3 gap-2 rounded-md bg-muted/50">
                    <p className="font-medium text-base">{item.food}</p>
                    <div className="space-x-2">
                      <Badge className="bg-red-600/50 dark:text-red-400 text-red-800">Protein {item.protein}g</Badge>
                      <Badge className="bg-blue-600/50 dark:text-blue-400 text-blue-800">Carbs {item.carbs}g</Badge>
                      <Badge className="bg-green-600/50 dark:text-green-400 text-green-800">Fat {item.fats}g</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Daily Totals and Save Button Column */}
      <div className="w-full md:w-1/4 space-y-4">
        <Card className="h-fit top-4">
          <CardHeader>
            <CardTitle>Daily Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Calories</p>
              <p className="text-lg font-bold ml-4">{totals.totalCalories.toFixed(0)} kcal</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Protein</p>
              <p className="text-lg font-bold ml-4">{totals.totalProtein.toFixed(1)}g</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Carbs</p>
              <p className="text-lg font-bold ml-4">{totals.totalCarbs.toFixed(1)}g</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Fats</p>
              <p className="text-lg font-bold ml-4">{totals.totalFats.toFixed(1)}g</p>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          onClick={handleSaveRoutine}
          disabled={loading}
          className="w-full"
        >
          <NotepadText className="mr-2 h-4 w-4" />
          Save Meal Plan
        </Button>
        <Button className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download as PDF
        </Button>
      </div>
    </div>
  );
}