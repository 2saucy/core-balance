"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import RepTracker from "@/components/rep-tracker";
import { exercisesByCategory } from "@/lib/routine-builder-helpers";
import { Exercise } from "@/lib/types/routine-builder-types";
import { Day } from "date-fns";


interface SavedRoutine {
  id: string;
  name: string;
  split: string;
  days: Day[];
  createdAt: string;
}

const ROUTINE_STORAGE_KEY = "routines";
const CURRENT_ROUTINE_ID_KEY = "currentRoutineId";

const findExerciseCategory = (exerciseName: string): string | undefined => {
  for (const category in exercisesByCategory) {
    if (exercisesByCategory[category].includes(exerciseName)) {
      return category;
    }
  }
  return undefined;
};

export default function RepTrackerPage() {
  const [savedRoutines, setSavedRoutines] = React.useState<SavedRoutine[]>([]);
  const [selectedRoutine, setSelectedRoutine] = React.useState<SavedRoutine | null>(null);
  const [currentRoutineId, setCurrentRoutineId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const routines = JSON.parse(localStorage.getItem(ROUTINE_STORAGE_KEY) || "[]");
    const currentId = localStorage.getItem(CURRENT_ROUTINE_ID_KEY);
    setSavedRoutines(routines);
    setCurrentRoutineId(currentId);
  }, []);

  const handleRoutineSelect = (id: string) => {
    const routine = savedRoutines.find(r => r.id === id);
    setSelectedRoutine(routine || null);
  };

  const allExercises: Exercise[] = React.useMemo(() => {
    if (!selectedRoutine) return [];
    const uniqueExercises: { [key: string]: Exercise } = {};
    selectedRoutine.days.forEach(day => {
      day.exercises.forEach(ex => {
        uniqueExercises[ex.name] = ex;
      });
    });
    return Object.values(uniqueExercises);
  }, [selectedRoutine]);

  return (
    <div className="px-[15%] py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Rep Tracker</h1>
        <p className="text-sm text-muted-foreground">Track your progress and monitor your training volume.</p>
      </div>

      {/* Routine Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select a Routine</CardTitle>
          <CardDescription>
            Choose a saved routine to view and track your exercises.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleRoutineSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a saved routine..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Routines</SelectLabel>
                {savedRoutines.map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} {currentRoutineId === r.id && "⭐"}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Exercises Display */}
      {selectedRoutine && (
        <div className="space-y-4">
          {allExercises.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allExercises.map((exercise: Exercise) => (
                <RepTracker
                  key={exercise.name}
                  exerciseName={exercise.name}
                  category={findExerciseCategory(exercise.name)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No exercises added to this routine.</p>
          )}
        </div>
      )}
    </div>
  );
}