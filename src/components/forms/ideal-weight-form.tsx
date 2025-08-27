"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { idealWeightFormSchema } from "@/lib/validation/ideal-weight-schema";
import { IdealWeightFormProps, IdealWeightFormValues } from "@/lib/types/ideal-weight-types";

function calculateIdealWeight(values: IdealWeightFormValues) {
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

export default function IdealWeightForm({ onCalculate }: IdealWeightFormProps) {
  const form = useForm<IdealWeightFormValues>({
    resolver: zodResolver(idealWeightFormSchema),
  });

  function onSubmit(values: IdealWeightFormValues) {
    try {
      const results = calculateIdealWeight(values);
      onCalculate(results);
      toast.success("Calculation done!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to calculate ideal weight");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto py-10">
        {/* Units */}
        <FormField control={form.control} name="units" render={({ field }) => (
          <FormItem>
            <FormLabel>Units</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} className="flex space-x-6">
                {["male", "female", "other"].map(value => (
                  <FormItem key={value} className="flex items-center space-x-2">
                    <FormControl><RadioGroupItem value={value} /></FormControl>
                    <FormLabel className="font-normal">{value}</FormLabel>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Height */}
        <FormField control={form.control} name="height" render={({ field }) => (
          <FormItem>
            <FormLabel>Height</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormDescription>Height in cm or inches depending on units</FormDescription>
            <FormMessage />
          </FormItem>
        )} />

        {/* Age */}
        <FormField control={form.control} name="age" render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Body Frame */}
        <FormField control={form.control} name="bodyFrame" render={({ field }) => (
          <FormItem>
            <FormLabel>Body Frame</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select body frame" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        {/* Current Weight */}
        <FormField control={form.control} name="currentWeight" render={({ field }) => (
          <FormItem>
            <FormLabel>Current Weight (optional)</FormLabel>
            <FormControl><Input type="number" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <Button type="submit">Calculate</Button>
      </form>
    </Form>
  );
}
