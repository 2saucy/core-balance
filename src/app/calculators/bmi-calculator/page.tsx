"use client";

import * as React from "react";
import BMIForm from "@/components/forms/bmi-form";
import { BMIResult, SavedBMIResult } from "@/lib/types/bmi-types";
import { useCalculatorHistory } from "@/hooks/use-calculator-history";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { CalculatorPageLayout } from "@/components/layout/calculator-page-layout";
import { GenericResultsTable } from "@/components/generic-results-table";

export default function BMIPage() {
  const {
    results,
    history,
    isLoading,
    handleCalculate,
    handleDelete,
    handleClearAll
  } = useCalculatorHistory<BMIResult>("bmi_history");

  const getClassification = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Underweight":
        return "bg-neutral-500 text-white";
      case "Normal":
        return "bg-green-500 text-white";
      case "Overweight":
        return "bg-orange-500 text-white";
      case "Obese":
        return "bg-red-500 text-white";
      default:
        return "bg-neutral-500 text-white";
    }
  };

  const renderCurrentResult = (res: BMIResult) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-5xl font-bold tracking-tight">{res.bmi.toFixed(2)}</span>
        <Badge className={getClassificationColor(getClassification(res.bmi))}>
          {getClassification(res.bmi)}
        </Badge>
      </div>
    </div>
  );

  const tableHeaders = ["Date", "BMI", "Classification", "Weight", "Height"];

  const renderHistoryRow = (item: SavedBMIResult, index: number) => (
    <TableRow key={index}>
      <TableCell className="font-medium">{item.date}</TableCell>
      <TableCell>{item.bmi.toFixed(2)}</TableCell>
      <TableCell>
        <Badge className={getClassificationColor(item.classification)}>
          {item.classification}
        </Badge>
      </TableCell>
      <TableCell>{item.formValues.weight.toFixed(2)} {item.units === "metric" ? "kg" : "lbs"}</TableCell>
      <TableCell>{item.formValues.height.toFixed(2)} {item.units === "metric" ? "cm" : "in"}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8 px-4 md:px-12 lg:px-[15%]">
        <div className="flex-1 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Contenido del formulario de BMI
  const bmiFormContent = <BMIForm onCalculate={handleCalculate} />;

  // Contenido de la información sobre BMI
  const bmiInfoContent = (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p>
        BMI, or Body Mass Index, is a simple tool used to estimate the amount of body fat. It&apos;s based on your height and weight and is a quick way to screen for weight categories that may lead to health problems.
      </p>
      <h3><b>How it&apos;s calculated: </b></h3>
      <p>
        The formula for BMI is your weight in kilograms divided by the square of your height in meters.
      </p>
      <h3><b>Classification:</b></h3>
      <ul className="list-disc list-inside">
        <li>Underweight: BMI &lt; 18.5</li>
        <li>Normal weight: BMI 18.5–24.9</li>
        <li>Overweight: BMI 25–29.9</li>
        <li>Obesity: BMI ≥ 30</li>
      </ul>
      <p>
        While a great general guide, BMI is not a diagnostic tool. Consult with a healthcare professional for a complete health assessment.
      </p>
    </div>
  );

  return (
    <CalculatorPageLayout
      title="BMI Calculator"
      description="Calculate your body mass index with our comprehensive tool."
      form={bmiFormContent}
      infoTitle="What is BMI?"
      infoDescription="Understanding Body Mass Index"
      infoContent={bmiInfoContent}
      results={
        <GenericResultsTable<SavedBMIResult>
          currentResult={results as SavedBMIResult | null}
          history={history as SavedBMIResult[]}
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