import z from "zod";
import { macroSplitFormSchema } from "../validation/macro-split-schema";

type macroSplitFormValues = z.infer<typeof macroSplitFormSchema>;

interface SavedMacroSplitResult extends MacroSplitResult {
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
  formValues: macroSplitFormValues;
}

interface MacroSplitFormProps {
    onCalculate: (results: {
        bmr: number
        tdee: number
        calorieTarget: number
        protein?: number
        fat?: number
        carbs?: number
        formValues: macroSplitFormValues
    }) => void
}

export type { MacroSplitFormProps, MacroSplitResult, MacroSplitResultsProps, SavedMacroSplitResult, macroSplitFormValues };