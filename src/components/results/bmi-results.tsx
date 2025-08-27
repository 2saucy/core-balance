"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { BMIResultsProps } from "@/lib/types/bmi-types";


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

export function BMIResults({ results, history, onDelete, onClearAll }: BMIResultsProps) {
  return (
    <div className="space-y-8">
      {/* Current Result Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your BMI</CardTitle>
          <CardDescription>Your most recent calculated BMI result.</CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold tracking-tight">{results.bmi}</span>
                <Badge className={cn("text-base font-semibold px-3 py-1 rounded-full", getClassificationColor(results.classification))}>
                  {results.classification}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Please enter your values to calculate your BMI.</p>
          )}
        </CardContent>
      </Card>

      {/* History Table */}
      {history.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="space-y-1">
              <CardTitle>BMI History</CardTitle>
              <CardDescription>A list of your past BMI results.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClearAll}>Clear All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>BMI</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Height</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.bmi}</TableCell>
                    <TableCell>
                      <Badge className={getClassificationColor(item.classification)}>
                        {item.classification}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.formValues.weight.toFixed(2)} {item.units === "metric" ? "kg" : "lbs"}</TableCell>
                    <TableCell>{item.formValues.height.toFixed(2)} {item.units === "metric" ? "cm" : "in"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onDelete(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}