// src/lib/types/routine-builder-types.ts - UPDATED VERSION
import { AddExerciseFormValues } from "@/components/forms/add-exercise-form";

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  category?: string;
}

export interface Day {
  name: string;
  exercises: Exercise[];
  category?: string;
}

export interface SavedRoutine {
  id: string;
  name: string;
  split: string;
  days: Day[];
  createdAt: string;
  isTemplate?: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
  tags?: string[];
}

export interface UIState {
  dialogOpen: boolean;
  editingIndex: number | null;
  openAccordionItems: string[];
  alertOpen: boolean;
  editTitleDialogOpen: boolean;
  editDayNameDialogOpen: boolean;
  alertAction?: 'new' | 'load' | 'delete' | 'clear';
  nextRoutineId?: string;
  selectedDayName?: string;
  initialFormValues?: AddExerciseFormValues;
  editingDayIndex?: number;
  newDayName?: string;
}

// No longer needed - removed complexity
// export interface RoutineActionsProps - actions are now in the store
// export interface RoutineHeaderProps - simplified inline