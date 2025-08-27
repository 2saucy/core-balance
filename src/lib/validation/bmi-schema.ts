import { z } from "zod";

export const BMIFormSchema = z.object({
  units: z.enum(["metric", "imperial"]),
  weight: z.coerce.number(),
  height: z.coerce.number(),
});
