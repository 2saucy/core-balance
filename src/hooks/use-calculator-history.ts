import * as React from "react";
import { toast } from "sonner";

interface SavedResult {
  date: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useCalculatorHistory<T extends Record<string, any>>(storageKey: string) {
  const [results, setResults] = React.useState<T | null>(null);
  const [history, setHistory] = React.useState<(T & SavedResult)[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Cargar historial de localStorage al montar
  React.useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = localStorage.getItem(storageKey);
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          setHistory(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.error(`Error loading history for ${storageKey}:`, error);
        toast.error("Failed to load calculation history");
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [storageKey]);

  const saveToStorage = React.useCallback((data: (T & SavedResult)[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (${storageKey}):`, error);
      toast.error("Failed to save calculation");
    }
  }, [storageKey]);

  const handleCalculate = React.useCallback((res: T) => {
    setResults(res);
    
    const newEntry: T & SavedResult = {
      ...res,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
    };

    setHistory(prevHistory => {
      const updatedHistory = [newEntry, ...prevHistory];
      saveToStorage(updatedHistory);
      return updatedHistory;
    });
    
    toast.success("Calculation completed and saved!");
  }, [saveToStorage]);

  const handleDelete = React.useCallback((indexToDelete: number) => {
    setHistory(prevHistory => {
      const updatedHistory = prevHistory.filter((_, index) => index !== indexToDelete);
      saveToStorage(updatedHistory);
      return updatedHistory;
    });
    toast.success("Record deleted successfully!");
  }, [saveToStorage]);

  const handleClearAll = React.useCallback(() => {
    setHistory([]);
    setResults(null);
    try {
      localStorage.removeItem(storageKey);
      toast.success("All records cleared!");
    } catch (error) {
      console.error(`Error clearing localStorage (${storageKey}):`, error);
      toast.error("Failed to clear records");
    }
  }, [storageKey]);

  return { 
    results, 
    history, 
    isLoading,
    handleCalculate, 
    handleDelete, 
    handleClearAll 
  };
}