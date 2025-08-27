import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface GenericResultsTableProps<T> {
  // Resultado actual a mostrar
  currentResult: T | null;
  // Renderiza el contenido de la tarjeta del resultado actual
  renderCurrentResult: (result: T) => React.ReactNode;
  // Datos del historial
  history: T[];
  // Encabezados de la tabla
  tableHeaders: string[];
  // Renderiza cada fila de la tabla del historial
  renderHistoryRow: (item: T, index: number) => React.ReactNode;
  // Funciones para manejar acciones del historial
  onDelete: (index: number) => void;
  onClearAll: () => void;
}

export function GenericResultsTable<T extends { date?: string }>({
  currentResult,
  renderCurrentResult,
  history,
  tableHeaders,
  renderHistoryRow,
  onDelete,
  onClearAll,
}: GenericResultsTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = history.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

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
          <CardTitle>Your Results</CardTitle>
          <CardDescription>Your most recent calculation.</CardDescription>
        </CardHeader>
        <CardContent>
          {currentResult ? (
            renderCurrentResult(currentResult)
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
              <CardTitle>Calculation History</CardTitle>
              <CardDescription>
                A list of your past calculations. Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, history.length)} of {history.length} records.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClearAll}>Clear All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.map((item, index) => renderHistoryRow(item, startIndex + index))}
              </TableBody>
            </Table>
            <Pagination className="mt-4 justify-center">
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