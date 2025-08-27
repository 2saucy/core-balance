"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { MacroSplitResult } from "@/app/calculators/macro-split-calculator/page";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { MacroSplitResultsProps } from "@/lib/types/macro-split.types";


export function MacroSplitResults({ results, history, onDelete, onClearAll }: MacroSplitResultsProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = history.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginationItems = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pages.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      pages.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    return pages;
  };

  return (
    <div className="space-y-8">
      {/* Current Result Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Daily Macronutrient Needs</CardTitle>
          <CardDescription>Your most recent calculated macro targets.</CardDescription>
        </CardHeader>
        <CardContent>
          {results ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold tracking-tight">{results.calorieTarget}</span>
                <span className="text-lg text-muted-foreground">kcal/day</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">Protein:</span> {results.protein} g/day
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">Fat:</span> {results.fat} g/day
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">Carbs:</span> {results.carbs} g/day
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
              <CardTitle>Macro Split History</CardTitle>
              <CardDescription>
                A list of your past macro calculations. Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, history.length)} of {history.length} records.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClearAll}>Clear All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Protein</TableHead>
                  <TableHead>Fat</TableHead>
                  <TableHead>Carbs</TableHead>
                  <TableHead>Goal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.calorieTarget} kcal</TableCell>
                    <TableCell>{item.protein} g</TableCell>
                    <TableCell>{item.fat} g</TableCell>
                    <TableCell>{item.carbs} g</TableCell>
                    <TableCell>
                      <Badge>{item.formValues.goal}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => onDelete(startIndex + index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination className="mt-4 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                </PaginationItem>
                {getPaginationItems()}
                <PaginationItem>
                  <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      )}
    </div>
  );
}