import { z } from "zod";

export const BMIFormSchema = z.object({
  weight: z.coerce.number(),
  height: z.coerce.number(),
});