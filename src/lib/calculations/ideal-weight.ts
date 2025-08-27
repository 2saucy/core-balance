import { IdealWeightFormValues } from "../types/ideal-weight-types";

export function calculateIdealWeight(values: IdealWeightFormValues) {
  const { units, height, bodyFrame, currentWeight } = values;

  // Altura en metros
  const heightM = units === "metric" ? height / 100 : height * 0.0254;

  // Peso ideal base usando BMI objetivo 22
  let idealWeightKg = 22 * heightM * heightM;

  // Ajuste por body frame
  switch (bodyFrame) {
    case "small":
      idealWeightKg *= 0.95;
      break;
    case "large":
      idealWeightKg *= 1.05;
      break;
    case "medium":
    default:
      break;
  }

  // Mostrar en unidades correctas
  const displayWeight = units === "metric" ? idealWeightKg : idealWeightKg / 0.453592;

  const diff = currentWeight ? currentWeight - displayWeight : undefined;

  return {
    idealWeight: Math.round(displayWeight),
    difference: diff !== undefined ? Math.round(diff) : undefined,
    units,
    formValues: values,
  };
}