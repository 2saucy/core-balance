// src/app/workout/custom-routine-builder/page.tsx - ULTRA SIMPLIFIED VERSION
"use client";

import * as React from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SquarePen, Trash, Plus, X, SquarePlus } from "lucide-react";
import AddExerciseForm from "@/components/forms/add-exercise-form";
import { Exercise } from "@/lib/types/routine-builder-types";
import { ErrorBoundary } from "@/components/layout/error-boundary";
import { formatDate } from "@/lib/utils";
import { RoutineActions } from "@/components/routine-actions";
import { useRoutineStore } from "@/store/routine-store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function RoutineBuilderPage() {
  const {
    // State
    routine,
    routineName,
    isNewRoutine,
    selectedRoutineId,
    currentRoutineId,
    createdAt,
    ui,

    // Actions
    setRoutineName,
    updateUI,
    addExercise,
    editExercise,
    deleteExercise,
    deleteDay,
    editDayName,
    saveRoutine,
    getExercisesForDay,
    initialize,

    // Computed
    hasUnsavedChanges,

    // For unsaved changes handling
    loadRoutine,
    createNewRoutine,
    deleteRoutine,
    clearAll,
    savedRoutines
  } = useRoutineStore();

  // Initialize store on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle exercise save (add or edit)
  const handleSaveExercise = (exercise: Exercise) => {
    if (!ui.selectedDayName) return;

    if (ui.editingIndex !== null) {
      editExercise(ui.selectedDayName, ui.editingIndex, exercise);
    } else {
      addExercise(ui.selectedDayName, exercise);
    }

    updateUI({ dialogOpen: false, editingIndex: null, selectedDayName: undefined });
  };

  // Open exercise dialog
  const openExerciseDialog = (dayName: string, exerciseIndex?: number) => {
    const day = routine.find(d => d.name === dayName);
    const exercise = exerciseIndex !== undefined ? day?.exercises[exerciseIndex] : undefined;

    updateUI({
      dialogOpen: true,
      editingIndex: exerciseIndex ?? null,
      selectedDayName: dayName,
      initialFormValues: exercise ? {
        exercise_name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps
      } : undefined
    });
  };

  // Handle day name editing
  const handleEditDayName = (dayIndex: number) => {
    const dayName = routine[dayIndex]?.name || "";
    updateUI({
      editDayNameDialogOpen: true,
      editingDayIndex: dayIndex,
      newDayName: dayName
    });
  };

  // Handle unsaved changes actions
  const handleUnsavedAction = (action: 'save' | 'discard') => {
    if (action === 'save') {
      saveRoutine();
    }

    // Execute the pending action
    switch (ui.alertAction) {
      case 'new':
        createNewRoutine();
        break;
      case 'load':
        if (ui.nextRoutineId) {
          const routine = savedRoutines.find(r => r.id === ui.nextRoutineId);
          if (routine) loadRoutine(routine);
        }
        break;
      case 'delete':
        if (ui.nextRoutineId) {
          deleteRoutine(ui.nextRoutineId);
        }
        break;
      case 'clear':
        clearAll();
        break;
    }

    updateUI({
      alertOpen: false,
      alertAction: undefined,
      nextRoutineId: undefined
    });
  };

  // Loading state
  if (routine.length === 0) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-6 justify-center py-12 px-4 md:px-12 lg:px-[15%]">

        {/* Header Section */}
        <div className="space-y-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Custom Routine Builder</h1>
            <p className="text-muted-foreground mt-2">
              Build and customize your personalized workout routine
            </p>
          </div>

          {/* Routine Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold">
                {routineName || "Unnamed Routine"}
              </h2>
              {currentRoutineId === selectedRoutineId && !isNewRoutine && (
                <Badge variant="secondary" className="bg-green-400/50 dark:text-green-400 text-green-700">
                  Current
                </Badge>
              )}
              {isNewRoutine && (
                <Badge variant="secondary" className="bg-blue-400/50 dark:text-blue-400 text-blue-700">
                  New
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {createdAt && (
                <span className="text-sm text-muted-foreground">
                  Created: {formatDate(createdAt)}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateUI({ editTitleDialogOpen: true })}
              >
                <SquarePen className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <RoutineActions />

        {/* Days Section */}
        <div className="space-y-6 mt-4">
          {routine.map((day, dayIndex) => (
            <div key={day.name} className="border rounded-lg overflow-hidden">
              {/* Day Header */}
              <div className="bg-muted/50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">{day.name}</h4>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <Button size="sm" variant="ghost" onClick={() => openExerciseDialog(day.name)}>
                          <SquarePlus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add exercise</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button size="sm" variant="ghost" onClick={() => handleEditDayName(dayIndex)}>
                          <SquarePen className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit day name</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button size="sm" variant="ghost" className="cursor-pointer" onClick={() => deleteDay(dayIndex)} disabled={routine.length <= 1}>
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete day</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Exercises List */}
              <div className="p-6">
                {day.exercises.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No exercises added yet</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {day.exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={`${exercise.name}-${exerciseIndex}`}
                        className="flex items-center justify-between bg-background border rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {exercise.sets} sets × {exercise.reps} reps
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openExerciseDialog(day.name, exerciseIndex)}
                          >
                            <SquarePen className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteExercise(day.name, exerciseIndex)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Exercise Dialog */}
        <Dialog
          open={ui.dialogOpen}
          onOpenChange={(open) => updateUI({ dialogOpen: open })}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {ui.editingIndex !== null ? "Edit Exercise" : "Add Exercise"}
              </DialogTitle>
            </DialogHeader>
            <AddExerciseForm
              onSave={handleSaveExercise}
              initialValues={ui.initialFormValues}
              availableExercises={getExercisesForDay(ui.selectedDayName || "")}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Routine Name Dialog */}
        <Dialog
          open={ui.editTitleDialogOpen}
          onOpenChange={(open) => updateUI({ editTitleDialogOpen: open })}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Routine Name</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder="Enter routine name"
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => updateUI({ editTitleDialogOpen: false })}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  updateUI({ editTitleDialogOpen: false });
                  if (hasUnsavedChanges()) {
                    saveRoutine();
                  }
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Day Name Dialog */}
        <Dialog
          open={ui.editDayNameDialogOpen}
          onOpenChange={(open) => updateUI({ editDayNameDialogOpen: open })}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Day Name</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={ui.newDayName || ""}
                onChange={(e) => updateUI({ newDayName: e.target.value })}
                placeholder="Enter day name"
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => updateUI({ editDayNameDialogOpen: false })}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (ui.editingDayIndex !== undefined && ui.newDayName) {
                    editDayName(ui.editingDayIndex, ui.newDayName);
                  }
                  updateUI({
                    editDayNameDialogOpen: false,
                    editingDayIndex: undefined,
                    newDayName: undefined
                  });
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Unsaved Changes Alert */}
        <Dialog
          open={ui.alertOpen}
          onOpenChange={(open) => updateUI({ alertOpen: open })}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Unsaved Changes Detected</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You have unsaved changes. What would you like to do?
              </p>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => updateUI({ alertOpen: false })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleUnsavedAction('discard')}
              >
                Discard Changes
              </Button>
              <Button onClick={() => handleUnsavedAction('save')}>
                Save & Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </ErrorBoundary>
  );
}