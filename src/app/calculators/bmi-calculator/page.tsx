"use client";

import * as React from "react";
import BMIForm from "@/components/forms/bmi-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BMIResult, SavedBMIResult } from "@/lib/types/bmi-types";
import { BMIResults } from "@/components/results/bmi-results";


const BMI_STORAGE_KEY = "bmi_history";

export default function BMIPage() {
  const [results, setResults] = React.useState<BMIResult | null>(null);
  const [history, setHistory] = React.useState<SavedBMIResult[]>([]);

  // Load history from localStorage on mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem(BMI_STORAGE_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleCalculate = (res: BMIResult) => {
    setResults(res);
    const newEntry: SavedBMIResult = {
      ...res,
      date: new Date().toLocaleDateString(),
    };
    const updatedHistory = [newEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(BMI_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedHistory = history.filter((_, index) => index !== indexToDelete);
    setHistory(updatedHistory);
    localStorage.setItem(BMI_STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const handleClearAll = () => {
    setHistory([]);
    setResults(null);
    localStorage.removeItem(BMI_STORAGE_KEY);
  };

  return (
    <div className="flex justify-center py-8 px-4 md:px-12 lg:px-[15%]">
      <div className="flex-1 max-w-4xl space-y-8">
        <h1 className="text-3xl font-semibold mb-12">BMI Calculator</h1>

        {/* Top Section: Form and Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Calculator Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Calculate Your BMI</CardTitle>
              <CardDescription>Enter your information below.</CardDescription>
            </CardHeader>
            <CardContent className="h-full">
              <BMIForm onCalculate={handleCalculate} />
            </CardContent>
          </Card>

          {/* Right Column: Information Card */}
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle>What is BMI?</CardTitle>
              <CardDescription>Understanding Body Mass Index</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
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
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: Results Card */}
        <div className="space-y-8">
          <BMIResults results={results} history={history} onDelete={handleDelete} onClearAll={handleClearAll} />
        </div>
      </div>
    </div>
  );
}