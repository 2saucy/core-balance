"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { BodyFatResultsProps } from "@/lib/types/body-fat-types";


const getClassificationColor = (classification: string) => {
  switch (classification) {
    case "Low":
      return "bg-sky-500 text-white";
    case "Healthy":
    case "Normal":
      return "bg-green-500 text-white";
    case "High":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export function BodyFatResults({ results, history, onDelete, onClearAll }: BodyFatResultsProps) {
  const getClassification = (bodyFatPercentage: number) => {
    if (bodyFatPercentage < 14) return "Low";
    if (bodyFatPercentage <= 20) return "Healthy";
    return "High";
  };

  return (
    <div className="space-y-8">
      {/* Current Result Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Body Fat Percentage</CardTitle>
          <CardDescription>Your most recent calculated body fat result.</CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold tracking-tight">{results.bodyFatPercentage}%</span>
                <Badge className={cn("text-base font-semibold px-3 py-1 rounded-full", getClassificationColor(getClassification(results.bodyFatPercentage)))}>
                  {getClassification(results.bodyFatPercentage)}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">Fat Mass:</span> {results.fatMass.toFixed(2)} {results.units === "metric" ? "kg" : "lbs"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">Lean Mass:</span> {results.leanBodyMass.toFixed(2)} {results.units === "metric" ? "kg" : "lbs"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Your results will appear here after calculation.</p>
          )}
        </CardContent>
      </Card>

      {/* History Table */}
      {history.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="space-y-1">
              <CardTitle>Body Fat History</CardTitle>
              <CardDescription>A list of your past body fat results.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClearAll}>Clear All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>BF %</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Fat Mass</TableHead>
                  <TableHead>Lean Mass</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Height</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.bodyFatPercentage.toFixed(2)}%</TableCell>
                    <TableCell>
                      <Badge className={getClassificationColor(getClassification(item.bodyFatPercentage))}>
                        {getClassification(item.bodyFatPercentage)}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.fatMass.toFixed(2)} {item.units === "metric" ? "kg" : "lbs"}</TableCell>
                    <TableCell>{item.leanBodyMass.toFixed(2)} {item.units === "metric" ? "kg" : "lbs"}</TableCell>
                    <TableCell>{item.weight.toFixed(2)} {item.units === "metric" ? "kg" : "lbs"}</TableCell>
                    <TableCell>{item.height.toFixed(2)} {item.units === "metric" ? "cm" : "in"}</TableCell>
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