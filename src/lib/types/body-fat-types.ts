import z from "zod";
import { BodyFatSchema } from "../validation/body-fat-schema";

type BodyFatFormValues = z.infer<typeof BodyFatSchema>;

type BodyFatResult = BodyFatFormValues & {
  bodyFatPercentage: number;
  fatMass: number;
  leanBodyMass: number;
};

interface SavedBodyFatResult extends BodyFatResult {
  date: string;
}

interface BodyFatResultsProps {
  results: BodyFatResult | null;
  history: SavedBodyFatResult[];
  onSave?: (results: BodyFatResult) => void;
  onSetCurrent?: (results: BodyFatResult) => void;
  onDelete: (index: number) => void;
  onClearAll: () => void;
}

interface BodyFatCalculatorFormProps {
  onCalculate: (values: BodyFatResult) => void;
}

export type {
  BodyFatFormValues,
  BodyFatResult,
  SavedBodyFatResult,
  BodyFatResultsProps,
  BodyFatCalculatorFormProps,
};