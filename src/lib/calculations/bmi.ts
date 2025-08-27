import { BMIFormValues, BMIResult } from "@/lib/types/bmi-types";

/**
 * Calculates BMI based on height and weight.
 * @param values The form values containing height, weight, and units.
 * @returns An object with the calculated BMI, classification, and original form values.
 */

export function calculateBMI(values: BMIFormValues): BMIResult {
  const { units, weight, height } = values;

  const weightKg = units === "imperial" ? weight * 0.453592 : weight;
  const heightM = units === "metric" ? height / 100 : height * 0.0254;

  const bmi = weightKg / (heightM * heightM);

  let classification: string;
  if (bmi < 18.5) classification = "Underweight";
  else if (bmi < 25) classification = "Normal";
  else if (bmi < 30) classification = "Overweight";
  else classification = "Obese";

  return {
    bmi: parseFloat(bmi.toFixed(2)),
    classification,
    units,
    formValues: values,
  };
}