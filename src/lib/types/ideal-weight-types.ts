import z from "zod";
import { idealWeightFormSchema } from "../validation/ideal-weight-schema";

type IdealWeightFormValues = z.infer<typeof idealWeightFormSchema>;

interface IdealWeightResult {
    idealWeight: number;
    difference?: number;
    units: "metric" | "imperial";
    formValues: IdealWeightFormValues;
}

interface SavedIdealWeightResult extends IdealWeightResult {
    date: string;
}

interface IdealWeightResultsProps {
    results: IdealWeightResult | null;
    history: SavedIdealWeightResult[];
    onDelete: (index: number) => void;
    onClearAll: () => void;
}

interface IdealWeightFormProps {
  onCalculate: (results: any) => void;
}

export type { IdealWeightFormValues, IdealWeightResult, SavedIdealWeightResult, IdealWeightResultsProps, IdealWeightFormProps };