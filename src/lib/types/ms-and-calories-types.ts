import z from "zod";
import { MSAndCaloriesFormSchema } from "../validation/ms-and-calories-schema";

type MSAndCaloriesFormValues = z.infer<typeof MSAndCaloriesFormSchema>;

interface MSAndCaloriesFormProps {
  onCalculate: (results: {
    bmr: number
    tdee: number
    calorieTarget: number
    protein?: number
    fat?: number
    carbs?: number
    formValues: MSAndCaloriesFormValues
  }) => void
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
  formValues: MSAndCaloriesFormValues;
}

interface SavedCaloriesResult extends CaloriesResult {
  date: string;
}

interface MacroSplitResultsProps {
  results: MacroSplitResult | null;
  history: SavedMacroSplitResult[];
  onDelete: (index: number) => void;
  onClearAll: () => void;
}

interface MacroSplitResult {
  bmr: number;
  tdee: number;
  calorieTarget: number;
  protein: number;
  fat: number;
  carbs: number;
  formValues: MSAndCaloriesFormValues;
}

interface SavedMacroSplitResult extends MacroSplitResult {
  date: string;
}

export type { 
  MSAndCaloriesFormProps, 
  MSAndCaloriesFormValues,
  MacroSplitResult, 
  MacroSplitResultsProps, 
  SavedMacroSplitResult, 
  CaloriesResult,  
  CaloriesResultsProps, 
  SavedCaloriesResult };