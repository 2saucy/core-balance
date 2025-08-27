import { BodyFatFormValues, BodyFatResult } from "@/lib/types/body-fat-types";

/**
 * Calculates Body Fat Percentage using the U.S. Navy Method.
 * @param values The form values containing measurements and gender.
 * @returns An object with the calculated body fat percentage, lean body mass, and original form values.
 */

export function calculateBodyFat(values: BodyFatFormValues): BodyFatResult {
  const { gender, units, height, neck, waist, hips } = values;

  let bodyFat: number;
  const heightCM = units === "metric" ? height : height * 2.54;
  const neckCM = units === "metric" ? neck : neck * 2.54;
  const waistCM = units === "metric" ? waist : waist * 2.54;
  const hipCM = hips !== undefined ? (units === "metric" ? hips : hips * 2.54) : 0;

  if (gender === "male") {
    const log10WaistNeck = Math.log10(waistCM - neckCM);
    const log10Height = Math.log10(heightCM);
    bodyFat = 495 / (1.0324 - 0.19077 * log10WaistNeck + 0.15456 * log10Height) - 450;
  } else {
    const log10WaistNeckHip = Math.log10(waistCM + hipCM - neckCM);
    const log10Height = Math.log10(heightCM);
    bodyFat = 495 / (1.29579 - 0.35004 * log10WaistNeckHip + 0.22100 * log10Height) - 450;
  }

  const weightKg = units === "metric" ? values.weight : values.weight * 0.453592;
  const fatMass = weightKg * (bodyFat / 100);
  const leanMass = weightKg - fatMass;

  // Convert lean body mass back to imperial if needed
  const leanBodyMass = units === "imperial" ? leanMass / 0.453592 : leanMass;

  return {
    ...values,
    bodyFatPercentage: parseFloat(bodyFat.toFixed(2)),
    fatMass: parseFloat(fatMass.toFixed(2)),
    leanBodyMass: parseFloat(leanBodyMass.toFixed(2)),
  };
}