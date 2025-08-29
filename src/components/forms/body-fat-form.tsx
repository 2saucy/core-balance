"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { BodyFatCalculatorFormProps, BodyFatFormValues } from "@/lib/types/body-fat-types";
import { BodyFatSchema } from "@/lib/validation/body-fat-schema";
import { calculateBodyFat } from "@/lib/calculations/body-fat";


export default function BodyFatCalculatorForm({ onCalculate }: BodyFatCalculatorFormProps) {

  const form = useForm<BodyFatFormValues>({
    resolver: zodResolver(BodyFatSchema),
    defaultValues: {
      units: "metric",
      gender: "male",
      height: undefined,
      weight: undefined,
      neck: undefined,
      waist: undefined,
      hips: undefined,
    },
  });

  const gender = form.watch("gender");

  const onSubmit = (values: BodyFatFormValues) => {
    try {
      const results = calculateBodyFat(values);
      onCalculate(results);
      toast.success("Calculation done!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to calculate body fat.");
    }
  };

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
                  <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                  <SelectItem value="imperial">Imperial (in, lbs)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

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
                <FormLabel>Height</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Weight */}
            <FormField control={form.control} name="weight" render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Weight</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="flex gap-4">
            {/* Neck */}
            <FormField control={form.control} name="neck" render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Neck</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {/* Waist */}
            <FormField control={form.control} name="waist" render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Waist</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Hips */}
          <FormField control={form.control} name="hips" render={({ field }) => (
            <FormItem className={cn({ "hidden": gender === "male" })}>
              <FormLabel>Hips</FormLabel>
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