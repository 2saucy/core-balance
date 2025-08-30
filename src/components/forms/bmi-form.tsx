// bmi-form.tsx
"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BMIFormSchema } from "@/lib/validation/bmi-schema";
import { BMIFormProps, BMIFormValues } from "@/lib/types/bmi-types";
import { calculateBMI } from "@/lib/calculations/bmi";
import { useUnits } from "@/hooks/use-units";

export default function BMIForm({ onCalculate }: BMIFormProps) {
  const units = useUnits();
   // Llama al hook
  const form = useForm<BMIFormValues>({
    resolver: zodResolver(BMIFormSchema),
    defaultValues: {
      weight: undefined,
      height: undefined,
    },
  });

  function onSubmit(values: Omit<BMIFormValues, "units">) {
    try {
      if (values.height !== undefined && values.weight !== undefined) {
        const results = calculateBMI({ ...values, units }); // Agrega las unidades a los valores
        onCalculate(results);
        toast.success("BMI calculated and saved!");
      } else {
        toast.error("Please enter a valid height and weight.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during calculation.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 h-full">
        <div className="flex flex-col gap-6">
          {/* Height */}
          <FormField control={form.control} name="height" render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>{units === 'metric' ? 'Height (cm)' : 'Height (in)'}</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Weight */}
          <FormField control={form.control} name="weight" render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>{units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <Button className="mt-auto" type="submit">Calculate BMI</Button>
      </form>
    </Form>
  )
}