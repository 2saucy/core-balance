"use client";

import * as React from "react";
import MSAndCaloriesForm from "@/components/forms/ms-and-calories-form";
import { MacroSplitResult, SavedMacroSplitResult } from "@/lib/types/ms-and-calories-types";
import { useCalculatorHistory } from "@/hooks/use-calculator-history";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CalculatorPageLayout } from "@/components/layout/calculator-page-layout";
import { GenericResultsTable } from "@/components/generic-results-table";

export default function MacroSplitPage() {
  const {
    results,
    history,
    isLoading,
    handleCalculate: baseHandleCalculate,
    handleDelete,
    handleClearAll
  } = useCalculatorHistory<MacroSplitResult>("macro_split_history");

  const handleCalculate = React.useCallback((res: Omit<MacroSplitResult, 'protein' | 'fat' | 'carbs'>) => {
    const proteinRatio = 0.3;
    const fatRatio = 0.25;
    const carbsRatio = 0.45;

    const proteinGrams = Math.round((res.calorieTarget * proteinRatio) / 4);
    const fatGrams = Math.round((res.calorieTarget * fatRatio) / 9);
    const carbsGrams = Math.round((res.calorieTarget * carbsRatio) / 4);

    const newResult: MacroSplitResult = {
      ...res,
      protein: proteinGrams,
      fat: fatGrams,
      carbs: carbsGrams,
    };

    baseHandleCalculate(newResult);
  }, [baseHandleCalculate]);

  const renderCurrentResult = (res: MacroSplitResult) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-4xl font-bold tracking-tight">{res.calorieTarget.toFixed(0)}</span>
        <span className="text-xl text-muted-foreground">kcal/day</span>
      </div>
      <div className="space-y-1 mt-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold">Protein:</span> {res.protein} g
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-bold">Fat:</span> {res.fat} g
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-bold">Carbs:</span> {res.carbs} g
        </p>
      </div>
    </div>
  );

  const tableHeaders = ["Date", "Calorie Target", "Protein", "Fat", "Carbs", "Activity Level", "Goal"];

  const renderHistoryRow = (item: SavedMacroSplitResult, index: number) => (
    <TableRow key={index}>
      <TableCell className="font-medium">{item.date}</TableCell>
      <TableCell>{item.calorieTarget.toFixed(0)} kcal</TableCell>
      <TableCell>{item.protein} g</TableCell>
      <TableCell>{item.fat} g</TableCell>
      <TableCell>{item.carbs} g</TableCell>
      <TableCell>{item.formValues.activity_level}</TableCell>
      <TableCell>{item.formValues.goal}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12 px-4 md:px-12 lg:px-[15%]">
        <div className="flex-1 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Contenido del formulario de Macro Split
  const macroFormContent = <MSAndCaloriesForm onCalculate={handleCalculate} />;

  // Contenido de la información sobre Macro Split
  const macroInfoContent = (
    <div className="space-y-4">
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
  );

  return (
    <CalculatorPageLayout
      title="Macro Split Calculator"
      description="This Macro Split Calculator estimates your daily calorie needs (TDEE) and macronutrient targets based on your personal data, activity level, goal, and diet preference."
      form={macroFormContent}
      infoTitle="How It Works"
      infoDescription="Understanding the Calculation"
      infoContent={macroInfoContent}
      results={
        <GenericResultsTable<SavedMacroSplitResult>
          currentResult={results as SavedMacroSplitResult | null}
          history={history as SavedMacroSplitResult[]}
          tableHeaders={tableHeaders}
          renderCurrentResult={renderCurrentResult}
          renderHistoryRow={renderHistoryRow}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />
      }
    />
  );
}