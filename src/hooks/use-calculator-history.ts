import * as React from "react";
import { toast } from "sonner";

interface SavedResult<T> {
  date: string;
  // Agrega todos los campos de tu tipo de resultado (T) aquí
  [key: string]: any;
}

export function useCalculatorHistory<T>(storageKey: string) {
  const [results, setResults] = React.useState<T | null>(null);
  const [history, setHistory] = React.useState<SavedResult<T>[]>([]);

  // Cargar historial de localStorage al montar
  React.useEffect(() => {
    const savedHistory = localStorage.getItem(storageKey);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, [storageKey]);

  const handleCalculate = (res: T) => {
    setResults(res);
    const newEntry: SavedResult<T> = {
      ...res,
      date: new Date().toISOString().split('T')[0],
    };
    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory];
      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
    toast.success("Cálculo realizado y guardado!");
  };

  const handleDelete = (indexToDelete: number) => {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.filter((_, index) => index !== indexToDelete);
      localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
      return updatedHistory;
    });
    toast.success("Registro eliminado exitosamente!");
  };

  const handleClearAll = () => {
    localStorage.removeItem(storageKey);
    setHistory([]);
    toast.success("Todos los registros han sido borrados!");
  };

  return { results, history, handleCalculate, handleDelete, handleClearAll };
}