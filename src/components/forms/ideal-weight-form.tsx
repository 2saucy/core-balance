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
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { IdealWeightFormSchema } from "@/lib/validation/ideal-weight-schema";
import { IdealWeightFormProps, IdealWeightFormValues } from "@/lib/types/ideal-weight-types";
import { calculateIdealWeight } from "@/lib/calculations/ideal-weight";
import { useUnits } from "@/hooks/use-units";


export default function IdealWeightForm({ onCalculate }: IdealWeightFormProps) {
  const units = useUnits(); // Llama al hook

  const form = useForm<IdealWeightFormValues>({
    resolver: zodResolver(IdealWeightFormSchema),
  });

  function onSubmit(values: IdealWeightFormValues) {
    try {
      // Combina los valores del formulario con las unidades antes de calcular
      const results = calculateIdealWeight({ ...values, units });
      onCalculate(results);
      toast.success("Calculation done!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to calculate ideal weight");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 h-full">
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
            {/* Age */}
            <FormField control={form.control} name="age" render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Height */}
            <FormField control={form.control} name="height" render={({ field }) => (
              <FormItem>
                <FormLabel>{units === 'metric' ? 'Height (cm)' : 'Height (in)'}</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

          </div>

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
        </div>

        <Button className="mt-auto" type="submit">Calculate</Button>
      </form>
    </Form>
  );
}