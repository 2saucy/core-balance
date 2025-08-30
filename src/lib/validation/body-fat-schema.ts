import { z } from "zod";

export const BodyFatSchema = z.object({
  gender: z.enum(["male", "female"], { message: "Please select your gender" }),
  height: z.coerce.number(),
  weight: z.coerce.number(),
  neck: z.coerce.number(),
  waist: z.coerce.number(),
  hips: z.coerce.number().optional(),
});