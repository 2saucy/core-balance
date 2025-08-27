import z from "zod";

export const idealWeightFormSchema = z.object({
  units: z.enum(["metric", "imperial"]),
  gender: z.enum(["male", "female", "other"]),
  age: z.coerce.number().min(0).max(120),
  height: z.coerce.number().min(100).max(250), // cm o in
  bodyFrame: z.enum(["small", "medium", "large"]),
  currentWeight: z.coerce.number().min(20).max(300).optional(), // kg o lbs
});
