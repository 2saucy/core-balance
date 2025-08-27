"use client";

import * as React from "react";
import BodyFatCalculatorForm from "@/components/forms/body-fat-form";
import { BodyFatResult, SavedBodyFatResult } from "@/lib/types/body-fat-types";
import { CalculatorPageLayout } from "@/components/layout/calculator-page-layout";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { GenericResultsTable } from "@/components/generic-results-table";
import { useCalculatorHistory } from "@/hooks/use-calculator-history";

export default function BodyFatPage() {
  const {
    results,
    history,
    isLoading, // Agregado: Obtiene el estado de carga
    handleCalculate,
    handleDelete,
    handleClearAll
  } = useCalculatorHistory<BodyFatResult>("body_fat_history");

  const getBodyFatClassification = (bodyFat: number) => {
    if (bodyFat < 14) return "Low";
    if (bodyFat >= 14 && bodyFat <= 20) return "Healthy";
    return "High";
  };

  const tableHeaders = ["Date", "Body Fat %", "Classification", "Fat Mass", "Lean Mass", "Weight", "Height"];

  const renderCurrentResult = (res: BodyFatResult) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-5xl font-bold tracking-tight">
          {res.bodyFatPercentage}%
        </span>
        <span className="text-lg text-muted-foreground">
          <Badge>{getBodyFatClassification(res.bodyFatPercentage)}</Badge>
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-bold">Lean Body Mass:</span> {res.leanBodyMass}{" "}
          {res.units === "metric" ? "kg" : "lbs"}
        </p>
      </div>
    </div>
  );

  const infoContent = (
    <div className="space-y-4">
      <h3>
        <b>What is Body Fat Percentage?</b>
      </h3>
      <p>
        Body fat percentage is a measure of the amount of fat on your body,
        compared to your total body mass. It is a more accurate indicator of
        fitness than BMI.
      </p>
      <h3>
        <b>How it&apos;s calculated:</b>
      </h3>
      <p>
        This calculator uses the{" "}
        <span className="font-bold">U.S. Navy Method</span>, which is a simple
        and effective way to estimate body fat using a tape measure. It&apos;s based
        on the circumference measurements of different body parts and your
        height and weight.
      </p>
      <h3>
        <b>How to take your measurements:</b>
      </h3>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <b>Neck</b>: Measure at the narrowest point of the neck, just below
          the Adam’s apple. Keep the tape measure horizontal.
        </li>
        <li>
          <b>Waist</b>: For men, measure at the naval. For women, measure at the
          narrowest point of the torso. Breathe normally and do not pull in your
          stomach.
        </li>
        <li>
          <b>Hips <i>(Women only)</i></b>: Measure at the largest circumference of
          your hips, with your feet together.
        </li>
        <li>
          <b>Height and Weight</b>: Measure your height and weight in the morning
          on an empty stomach for the most accurate results.
        </li>
      </ul>
      <h3>
        <b>Classification:</b>
      </h3>
      <ul className="list-disc list-inside">
        <li>
          <b>Low</b>: Body Fat &lt; 14%
        </li>
        <li>
          <b>Healthy</b>: Body Fat 14%–20%
        </li>
        <li>
          <b>High</b>: Body Fat &gt; 20%
        </li>
      </ul>
      <p>
        These are general guidelines and may vary by age and gender. Always
        consult a healthcare professional for a complete health assessment.
      </p>
    </div>
  );

  const renderHistoryRow = (item: SavedBodyFatResult, index: number) => (
    <TableRow key={index}>
      <TableCell className="font-medium">{item.date}</TableCell>
      <TableCell>{item.bodyFatPercentage}%</TableCell>
      <TableCell>
        <Badge>{getBodyFatClassification(item.bodyFatPercentage)}</Badge>
      </TableCell>
      <TableCell>{item.fatMass} {item.units === "metric" ? "kg" : "lbs"}</TableCell>
      <TableCell>{item.leanBodyMass} {item.units === "metric" ? "kg" : "lbs"}</TableCell>
      <TableCell>{item.weight} {item.units === "metric" ? "kg" : "lbs"}</TableCell>
      <TableCell>{item.height} {item.units === "metric" ? "cm" : "in"}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );

  // Agregado: Renderizado de carga condicional
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

  return (
    <CalculatorPageLayout
      title="Body Fat"
      description="This calculator estimates your body fat percentage using the Navy Method."
      form={<BodyFatCalculatorForm onCalculate={handleCalculate} />}
      infoTitle="What is Body Fat Percentage?"
      infoDescription="Understanding Body Fat and the Navy Method"
      infoContent={infoContent}
      results={
        <GenericResultsTable<SavedBodyFatResult>
          currentResult={results as SavedBodyFatResult | null}
          history={history as SavedBodyFatResult[]}
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