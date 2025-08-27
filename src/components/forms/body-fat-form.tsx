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
    const results = calculateBodyFat(values);
    onCalculate(results);
    toast.success("Body Fat calculated and saved!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col min-h-full">
        <div className="space-y-6">
          {/* Units */}
          <FormField control={form.control} name="units" render={({ field }) => (
            <FormItem>
              <FormLabel>Units</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={form.formState.isSubmitting}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select units" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                  <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          {/* Gender */}
          <FormField control={form.control} name="gender" render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="male" /></FormControl>
                    <FormLabel>Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="female" /></FormControl>
                    <FormLabel>Female</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Height & Weight */}
          <div className="flex gap-4">
            <FormField control={form.control} name="height" render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Height</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="weight" render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Weight</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Neck & Waist */}
          <div className="flex gap-4">
            <FormField control={form.control} name="neck" render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Neck</FormLabel>
                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
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

        <Button className="mt-auto" type="submit">Calculate Body</Button>
      </form>
    </Form>
  );
}