"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BMIFormSchema } from "@/lib/validation/bmi-schema";
import { BMIFormProps, BMIFormValues } from "@/lib/types/bmi-types";
import { calculateBMI } from "@/lib/calculations/bmi";

export default function BMIForm({ onCalculate }: BMIFormProps) {
  const form = useForm<BMIFormValues>({
    resolver: zodResolver(BMIFormSchema),
    defaultValues: {
      units: "metric",
      weight: undefined,
      height: undefined,
    },
  });

  function onSubmit(values: BMIFormValues) {
    try {
      if (values.height !== undefined && values.weight !== undefined) {
        const results = calculateBMI(values);
        onCalculate(results);
        toast.success("BMI calculated and saved!");
      } else {
        toast.error("Please enter a valid height and weight.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to calculate BMI.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="space-y-6">
          {/* Units */}
          <FormField control={form.control} name="units" render={({ field }) => (
            <FormItem>
              <FormLabel>Units</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          {/* Height */}
          <FormField control={form.control} name="height" render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>Height</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Weight */}
          <FormField control={form.control} name="weight" render={({ field }) => (
            <FormItem className="grow">
              <FormLabel>Weight</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <Button className="mt-auto" type="submit">Calculate BMI</Button>
      </form>
    </Form>
  );
}