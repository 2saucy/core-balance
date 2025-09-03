import z from "zod";
import { IdealWeightFormSchema } from "../validation/ideal-weight-schema";

type IdealWeightFormValues = z.infer<typeof IdealWeightFormSchema>;

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
    onCalculate: (results: IdealWeightResult) => void;
}

export type { IdealWeightFormValues, IdealWeightResult, SavedIdealWeightResult, IdealWeightResultsProps, IdealWeightFormProps };