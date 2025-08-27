"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Exercise } from "@/hooks/use-routine";

const formSchema = z.object({
  exercise_name: z.string().min(1, "Please select or type an exercise"),
  sets: z.number().min(1, "Min 1 set").max(50),
  reps: z.number().min(1, "Min 1 rep").max(50)
});

export type AddExerciseFormValues = z.infer<typeof formSchema>;

interface AddExerciseFormProps {
  onSave: (exercise: Exercise) => void; // Cambiado a onSave
  initialValues?: Partial<AddExerciseFormValues>; // Renombrado para consistencia
  availableExercises?: string[]; // Lista de ejercicios filtrada
}

export default function AddExerciseForm({
  onSave,
  initialValues,
  availableExercises
}: AddExerciseFormProps) {
  const form = useForm<AddExerciseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || { exercise_name: "", sets: 3, reps: 10 }
  });

  const [selectedExercise, setSelectedExercise] = React.useState<string>("");

  const filteredExercises = availableExercises || [];

  function handleSubmit(values: AddExerciseFormValues) {
    const exerciseToSave: Exercise = {
      name: values.exercise_name || selectedExercise,
      sets: values.sets,
      reps: values.reps
    };
    onSave(exerciseToSave); // Llama al prop onSave
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="exercise_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise</FormLabel>
              <FormControl>
                <Command>
                  <CommandInput placeholder="Search exercises..." />
                  <CommandList className="max-h-30">
                    <CommandEmpty>No exercise found.</CommandEmpty>
                    {filteredExercises.map((ex) => (
                      <CommandItem
                        key={ex}
                        onSelect={() => { setSelectedExercise(ex); field.onChange(ex); }}
                      >
                        {ex}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </FormControl>
              <FormMessage />
              <span className="text-xs text-muted-foreground mt-1">
                Or type your own exercise below
              </span>
              <Input
                placeholder="Custom exercise"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="mt-1"
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sets</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reps</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="mt-6" type="submit">Save Exercise</Button>
      </form>
    </Form>
  );
}
