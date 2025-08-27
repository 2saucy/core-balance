"use client";

import * as React from "react";
import MSAndCaloriesForm from "@/components/forms/ms-and-calories-form";
import { CaloriesResult, SavedCaloriesResult } from "@/lib/types/calories.types";
import { useCalculatorHistory } from "@/hooks/use-calculator-history";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CalculatorPageLayout } from "@/components/layout/calculator-page-layout";
import { GenericResultsTable } from "@/components/generic-results-table";

export default function CaloriesPage() {
  const {
    results,
    history,
    isLoading,
    handleCalculate,
    handleDelete,
    handleClearAll
  } = useCalculatorHistory<CaloriesResult>("calories_history");

  const renderCurrentResult = (res: CaloriesResult) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-4xl font-bold tracking-tight">{res.calorieTarget}</span>
        <span className="text-xl text-muted-foreground">kcal/day</span>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold">BMR:</span> {res.bmr.toFixed(0)} kcal
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-bold">TDEE:</span> {res.tdee.toFixed(0)} kcal
        </p>
      </div>
    </div>
  );

  const tableHeaders = ["Date", "Calorie Target", "BMR", "TDEE", "Activity Level", "Goal"];

  const renderHistoryRow = (item: SavedCaloriesResult, index: number) => (
    <TableRow key={index}>
      <TableCell className="font-medium">{item.date}</TableCell>
      <TableCell>{item.calorieTarget.toFixed(0)} kcal</TableCell>
      <TableCell>{item.bmr.toFixed(0)} kcal</TableCell>
      <TableCell>{item.tdee.toFixed(0)} kcal</TableCell>
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

  // Contenido del formulario de Calorías
  const caloriesFormContent = <MSAndCaloriesForm onCalculate={handleCalculate} />;

  // Contenido de la información sobre Calorías
  const caloriesInfoContent = (
    <div className="space-y-4">
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
  );

  return (
    <CalculatorPageLayout
      title="Calories Calculator"
      description="This calculator estimates your daily calorie needs: Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), and a suggested calorie target based on your goals."
      form={caloriesFormContent}
      infoTitle="What are Calorie Needs?"
      infoDescription="Understanding BMR, TDEE, and Calorie Targets"
      infoContent={caloriesInfoContent}
      results={
        <GenericResultsTable<SavedCaloriesResult>
          currentResult={results as SavedCaloriesResult | null}
          history={history as SavedCaloriesResult[]}
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