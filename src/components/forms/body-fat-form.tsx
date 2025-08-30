"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { BodyFatCalculatorFormProps, BodyFatFormValues } from "@/lib/types/body-fat-types";
import { BodyFatSchema } from "@/lib/validation/body-fat-schema";
import { calculateBodyFat } from "@/lib/calculations/body-fat";
import { useUnits } from "@/hooks/use-units";


export default function BodyFatCalculatorForm({ onCalculate }: BodyFatCalculatorFormProps) {
  const units = useUnits();

  const form = useForm<BodyFatFormValues>({
    resolver: zodResolver(BodyFatSchema),
    defaultValues: {
      gender: "male",
      height: undefined,
      weight: undefined,
      neck: undefined,
      waist: undefined,
      hips: undefined,
    },
  });

  const gender = form.watch("gender");

  const onSubmit = (values: Omit<BodyFatFormValues, "units">) => {
    try {
      const results = calculateBodyFat({ ...values, units }); // Agrega las unidades a los valores
      onCalculate(results);
      toast.success("Body fat calculated and saved!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during calculation.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="space-y-6">
          {/* Gender */}
          <FormField control={form.control} name="gender" render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="male" /></FormControl>
                    <FormLabel className="font-normal">Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="female" /></FormControl>
                    <FormLabel className="font-normal">Female</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="flex gap-4">
            {/* Height */}
            <FormField control={form.control} name="height" render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>{units === 'metric' ? 'Height (cm)' : 'Height (in)'}</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Weight */}
            <FormField control={form.control} name="weight" render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>{units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="flex gap-4">
            {/* Neck */}
            <FormField control={form.control} name="neck" render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>{units === 'metric' ? 'Neck (cm)' : 'Neck (in)'}</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {/* Waist */}
            <FormField control={form.control} name="waist" render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>{units === 'metric' ? 'Waist (cm)' : 'Waist (in)'}</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Hips */}
          <FormField control={form.control} name="hips" render={({ field }) => (
            <FormItem className={cn({ "hidden": gender === "male" })}>
              <FormLabel>{units === 'metric' ? 'Hips (cm)' : 'Hips (in)'}</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} disabled={gender === "male"} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <Button className="mt-auto" type="submit">Calculate</Button>
      </form>
    </Form>
  );
}