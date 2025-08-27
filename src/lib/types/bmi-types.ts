import z from "zod";
import { BMIFormSchema } from "../validation/bmi-schema";

type BMIFormValues = z.infer<typeof BMIFormSchema>;

interface BMIResult {
  bmi: number;
  classification: string;
  units: "metric" | "imperial";
  formValues: {
    weight: number;
    height: number;
  };
}

interface SavedBMIResult extends BMIResult {
  date: string;
}

interface BMIResultsProps {
  results: BMIResult | null;
  history: SavedBMIResult[];
  onDelete: (index: number) => void;
  onClearAll: () => void;
}

interface BMIFormProps {
  onCalculate: (values: BMIResult) => void;
}

export type { BMIFormValues, BMIResult, SavedBMIResult, BMIResultsProps, BMIFormProps };