import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NutritionalTotals } from "@/lib/types/meal-types";
import { BarChart3 } from "lucide-react";

interface NutritionSummaryProps {
  dayName: string;
  totals: NutritionalTotals;
}

export function NutritionSummary({ dayName, totals }: NutritionSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          {dayName} - Totales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Calorías</span>
          <span className="font-bold">{Math.round(totals.totalCalories)} kcal</span>
        </div>
        <Separator />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Proteína</span>
          <span className="font-bold">{totals.totalProtein.toFixed(1)}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Carbohidratos</span>
          <span className="font-bold">{totals.totalCarbs.toFixed(1)}g</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Grasas</span>
          <span className="font-bold">{totals.totalFats.toFixed(1)}g</span>
        </div>
      </CardContent>
    </Card>
  );
}