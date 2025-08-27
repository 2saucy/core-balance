import { macroSplitFormValues } from "./macro-split.types";

interface SavedCaloriesResult extends CaloriesResult {
  date: string;
}

interface CaloriesResultsProps {
  results: CaloriesResult | null;
  history: SavedCaloriesResult[];
  onDelete: (index: number) => void;
  onClearAll: () => void;
}

interface CaloriesResult {
  bmr: number;
  tdee: number;
  calorieTarget: number;
  formValues: macroSplitFormValues;
}

export type { CaloriesResult, CaloriesResultsProps, SavedCaloriesResult };


