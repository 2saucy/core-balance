"use client";

import * as React from "react";
import IdealWeightForm from "@/components/forms/ideal-weight-form";
import { IdealWeightResult, SavedIdealWeightResult } from "@/lib/types/ideal-weight-types";
import { CalculatorPageLayout } from "@/components/layout/calculator-page-layout";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { useCalculatorHistory } from "@/hooks/use-calculator-history";
import { GenericResultsTable } from "@/components/generic-results-table";


export default function IdealWeightPage() {
  const {
    results,
    history,
    isLoading, // <-- Agregado: Se obtiene el estado de carga
    handleCalculate,
    handleDelete,
    handleClearAll,
  } = useCalculatorHistory<IdealWeightResult>("ideal_weight_history");

  const tableHeaders = ["Date", "Ideal Weight", "Current Weight", "Body Frame"];

  const renderCurrentResult = (res: IdealWeightResult) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-5xl font-bold tracking-tight">{res.idealWeight}</span>
        <span className="text-lg text-muted-foreground">{res.units === "metric" ? "kg" : "lbs"}</span>
      </div>
      {res.difference !== undefined && (
        <p className="text-sm text-muted-foreground">
          <span className="font-bold">Difference from Current:</span> {res.difference} {res.units === "metric" ? "kg" : "lbs"}
        </p>
      )}
    </div>
  );

  const infoContent = (
    <div className="space-y-4">
      <p>This calculator estimates your ideal weight using a BMI-based method (target BMI 22). A small adjustment is made based on your body frame (small, medium, large) to give a more personalized result.</p>
      <p>The calculation is then adjusted based on your body frame (small, medium, large) to provide a more personalized result. The weight is adjusted by a small percentage:</p>
      <ul className="list-disc list-inside space-y-1">
        <li><b>Small Frame:</b> The ideal weight is reduced by 5%.</li>
        <li><b>Large Frame:</b> The ideal weight is increased by 5%.</li>
        <li><b>Medium Frame:</b> No adjustment is made.</li>
      </ul>
    </div>
  );

  const renderHistoryRow = (item: SavedIdealWeightResult, index: number) => (
    <TableRow key={index}>
      <TableCell className="font-medium">{item.date}</TableCell>
      <TableCell>{item.idealWeight} {item.units === "metric" ? "kg" : "lbs"}</TableCell>
      <TableCell>{item.formValues.currentWeight || "N/A"} {item.units === "metric" ? "kg" : "lbs"}</TableCell>
      <TableCell><Badge>{item.formValues.bodyFrame}</Badge></TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </TableCell>
    </TableRow>
  );

  // <-- Agregado: Renderizado de carga condicional
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
      title="Ideal Weight Calculator"
      description="This calculator estimates your ideal weight using a BMI-based method (target BMI 22). A small adjustment is made based on your body frame (small, medium, large) to give a more personalized result."
      form={<IdealWeightForm onCalculate={handleCalculate} />}
      infoTitle="How It Works"
      infoDescription="Understanding the Calculation"
      infoContent={infoContent}
      results={
        <GenericResultsTable<SavedIdealWeightResult>
          currentResult={results as SavedIdealWeightResult | null}
          history={history as SavedIdealWeightResult[]}
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