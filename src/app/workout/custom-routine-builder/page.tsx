"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import AddExerciseForm, { AddExerciseFormValues } from "@/components/forms/add-exercise-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CirclePlus, Pencil, SquarePen, Trash, X } from "lucide-react";
import { toast } from "sonner";
import { generateDaysForSplit, useRoutine, Exercise, Day } from "@/hooks/use-routine";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// Definición de la estructura de una rutina guardada
interface SavedRoutine {
  id: string;
  name: string;
  split: string;
  days: Day[];
  createdAt: string;
}

const ROUTINE_STORAGE_KEY = "routines";
const CURRENT_ROUTINE_ID_KEY = "currentRoutineId";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function RoutineBuilderPage() {
  const { routine, setRoutineState, currentSplit, changeSplit, addOrEditExercise, deleteExercise, getExercisesForDay } = useRoutine("Full Body");

  // --- UI State ---
  const [ui, setUi] = React.useState({
    dialogOpen: false,
    editingIndex: null as number | null,
    openAccordionItems: [] as string[],
    alertOpen: false,
    editTitleDialogOpen: false,
  });

  // --- Routine State ---
  const [savedRoutines, setSavedRoutines] = React.useState<SavedRoutine[]>([]);
  const [currentRoutineId, setCurrentRoutineId] = React.useState<string | null>(null);
  const [selectedRoutineId, setSelectedRoutineId] = React.useState<string | null>(null);
  const [routineName, setRoutineName] = React.useState("");
  const [newRoutineTitle, setNewRoutineTitle] = React.useState("");
  const [isNewRoutine, setIsNewRoutine] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);
  const [createdAt, setCreatedAt] = React.useState<string | null>(null);

  // --- Helper Functions ---
  const getSavedRoutines = (): SavedRoutine[] => {
    return JSON.parse(localStorage.getItem(ROUTINE_STORAGE_KEY) || "[]");
  };

  const saveAllRoutines = (routines: SavedRoutine[]) => {
    localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(routines));
    setSavedRoutines(routines);
  };

  const loadRoutine = (r: SavedRoutine) => {
    changeSplit(r.split);
    setRoutineState(r.days);
    setSelectedRoutineId(r.id);
    setRoutineName(r.name);
    setIsNewRoutine(false);
    setCreatedAt(r.createdAt);
    setUi(prev => ({ ...prev, openAccordionItems: [] }));
  };

  const createNewRoutine = () => {
    setSelectedRoutineId(null);
    setRoutineState(generateDaysForSplit(currentSplit));
    setRoutineName("");
    setIsNewRoutine(true);
    setSelectedDay(null);
    setCreatedAt(null);
    setUi(prev => ({ ...prev, openAccordionItems: [], editingIndex: null }));
  };

  const resetCurrentRoutine = () => {
    setRoutineState(generateDaysForSplit(currentSplit));
    setUi(prev => ({ ...prev, openAccordionItems: [], editingIndex: null }));
    toast.info("Routine fields have been cleared.");
  };

  const handleNewRoutine = () => {
    if (routine.some(day => day.exercises.length > 0) && !isNewRoutine) {
      setUi(prev => ({ ...prev, alertOpen: true }));
    } else {
      createNewRoutine();
    }
  };

  const saveExercise = (exercise: Exercise) => {
    if (!selectedDay) return;
    addOrEditExercise(selectedDay, exercise, ui.editingIndex ?? undefined);
    setUi(prev => ({ ...prev, dialogOpen: false, editingIndex: null }));
    toast.success(`Exercise ${ui.editingIndex !== null ? "updated" : "added"}!`);
  };

  const openDialog = (dayName: string, idx?: number) => {
    setSelectedDay(dayName);
    setUi(prev => ({
      ...prev,
      dialogOpen: true,
      editingIndex: idx ?? null,
      openAccordionItems: [...new Set([...prev.openAccordionItems.filter(d => d !== dayName), dayName])]
    }));
  };

  const handleSaveRoutine = () => {
    let finalName = routineName?.trim();
    const routines = getSavedRoutines();

    if (!finalName) {
      const existingNames = routines.map(r => r.name).filter((n: string) => n.startsWith("Unnamed Routine"));
      let counter = 1;
      while (existingNames.includes(`Unnamed Routine ${counter}`)) counter++;
      finalName = `Unnamed Routine ${counter}`;
      setRoutineName(finalName);
    }

    if (selectedRoutineId) {
      const updated = routines.map(r =>
        r.id === selectedRoutineId ? { ...r, days: routine, split: currentSplit, name: finalName } : r
      );
      saveAllRoutines(updated);
    } else {
      const newId = crypto.randomUUID();
      const newRoutine: SavedRoutine = {
        id: newId,
        name: finalName,
        split: currentSplit,
        days: routine,
        createdAt: new Date().toISOString()
      };
      const updated = [...routines, newRoutine];
      saveAllRoutines(updated);
      setSelectedRoutineId(newId);
      setIsNewRoutine(false);
      setCreatedAt(newRoutine.createdAt);
    }
    toast.success("Routine saved!");
  };

  const previewRoutine = (id: string) => {
    const r = savedRoutines.find(r => r.id === id);
    if (r) {
      loadRoutine(r);
      toast.info(`Viewing routine "${r.name}"`);
    }
  };

  const deleteRoutine = (id: string) => {
    const updated = savedRoutines.filter(r => r.id !== id);
    saveAllRoutines(updated);
    if (id === currentRoutineId) {
      setCurrentRoutineId(null);
      localStorage.removeItem(CURRENT_ROUTINE_ID_KEY);
    }
    if (id === selectedRoutineId) createNewRoutine();
    toast.success("Routine deleted");
  };

  const setCurrentRoutine = (id: string) => {
    setCurrentRoutineId(id);
    localStorage.setItem(CURRENT_ROUTINE_ID_KEY, id);
    toast.success("Routine set as current!");
  };

  const unsetCurrentRoutine = () => {
    setCurrentRoutineId(null);
    localStorage.removeItem(CURRENT_ROUTINE_ID_KEY);
    toast.success("Routine unset from current");
  };

  // --- Init Effect ---
  React.useEffect(() => {
    const routines = getSavedRoutines();
    const currentId = localStorage.getItem(CURRENT_ROUTINE_ID_KEY);
    setSavedRoutines(routines);
    setCurrentRoutineId(currentId);

    const initialRoutine = routines.find(r => r.id === currentId) || routines[0];
    if (initialRoutine) {
      loadRoutine(initialRoutine);
    } else {
      createNewRoutine();
    }
  }, []);

  const initialFormValues = React.useMemo(() => {
    if (ui.editingIndex !== null && selectedDay) {
      const ex = routine.find(d => d.name === selectedDay)?.exercises[ui.editingIndex];
      if (ex) {
        return { exercise_name: ex.name, sets: ex.sets, reps: ex.reps } as AddExerciseFormValues;
      }
    }
    return undefined;
  }, [ui.editingIndex, selectedDay, routine]);

  const availableExercises = React.useMemo(() => {
    if (!selectedDay) return [];
    const day = routine.find(d => d.name === selectedDay);
    return getExercisesForDay(day?.category);
  }, [selectedDay, routine, getExercisesForDay]);

  return (
    <div className="px-[15%] py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Custom Routine Builder</h1>
        <p className="text-sm text-muted-foreground mb-6">Build your personalized training routine.</p>
      </div>

      {/* Routine Info */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            {currentRoutineId === selectedRoutineId && !isNewRoutine && (
              <Badge variant="secondary" className="text-xs font-semibold rounded-full text-emerald-600 dark:text-emerald-300 bg-emerald-300/50">Current</Badge>
            )}
            {isNewRoutine && (
              <Badge variant="secondary" className="text-xs font-semibold rounded-full text-sky-600 dark:text-sky-300 bg-sky-300/50">New</Badge>
            )}
          </div>
          {createdAt && (
            <span className="text-sm text-muted-foreground">
              Creation Date: {formatDate(createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold mr-12">{routineName || "Unnamed Routine"}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => { setNewRoutineTitle(routineName); setUi(prev => ({ ...prev, editTitleDialogOpen: true })); }}
            title="Edit routine name"
          >
            <Pencil />
          </Button>
        </div>
        {!isNewRoutine && selectedRoutineId && (
          <div className="flex gap-2 mb-6">
            {currentRoutineId === selectedRoutineId ? (
              <Button variant="outline" size="sm" onClick={unsetCurrentRoutine}>Unset Current</Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setCurrentRoutine(selectedRoutineId)}>Set as Current</Button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <Tabs
          value={currentSplit}
          onValueChange={(val) => {
            if (isNewRoutine) {
              changeSplit(val);
              setRoutineState(generateDaysForSplit(val));
            }
          }}
        >
          <TabsList>
            {["Full Body", "Push-Pull-Legs", "Weider", "Upper/Lower", "Arnold Split", "Bro Split"].map(split => (
              <TabsTrigger key={split} value={split} disabled={!isNewRoutine && !!selectedRoutineId}>
                {split}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          {savedRoutines.length > 0 && (
            <Select onValueChange={previewRoutine} value={selectedRoutineId || undefined}>
              <SelectTrigger className="w-[220px] justify-between">
                <SelectValue placeholder="Select routine" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Routines</SelectLabel>
                  {savedRoutines.map(r => (
                    <div key={r.id} className="flex items-center justify-between group">
                      <SelectItem value={r.id}>
                        {r.name} {currentRoutineId === r.id && "⭐"}
                      </SelectItem>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100"
                        onClick={(e) => { e.stopPropagation(); deleteRoutine(r.id); }}
                      >
                        <X className="opacity-50" />
                      </Button>
                    </div>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          <Button onClick={handleNewRoutine}>New Routine</Button>
        </div>
      </div>

      {/* Accordion */}
      <Accordion
        type="multiple"
        value={ui.openAccordionItems}
        onValueChange={(v) => setUi(prev => ({ ...prev, openAccordionItems: v }))}
        className="space-y-4"
      >
        {routine.map(day => (
          <AccordionItem key={day.name} value={day.name}>
            <AccordionTrigger>
              <div className="flex items-center justify-between gap-2 w-full">
                <span>{day.name}</span>
                <div
                  className="rounded-full hover:scale-115 text-emerald-600 hover:text-emerald-400"
                  onClick={(e) => { e.stopPropagation(); openDialog(day.name); }}
                  title="Add exercise"
                >
                  <CirclePlus className="size-4" />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              {day.exercises.map((ex, idx) => (
                <div key={`${ex.name}-${idx}`} className="flex justify-between bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-lg items-center">
                  <span>{ex.name} — {ex.sets}x{ex.reps}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openDialog(day.name, idx)} title="Edit">
                      <SquarePen />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => { deleteExercise(day.name, idx); toast.success("Exercise deleted"); }}
                      title="Delete"
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Save / Clear */}
      <div className="flex gap-4 mt-6">
        <Button onClick={handleSaveRoutine}>Save Routine</Button>
        <Button variant="outline" onClick={resetCurrentRoutine}>Clear All</Button>
      </div>

      {/* Add/Edit Exercise Dialog */}
      <Dialog open={ui.dialogOpen} onOpenChange={(open) => setUi(prev => ({ ...prev, dialogOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{ui.editingIndex !== null ? "Edit Exercise" : "Add Exercise"}</DialogTitle>
          </DialogHeader>
          <AddExerciseForm onSave={saveExercise} initialValues={initialFormValues} availableExercises={availableExercises} />
        </DialogContent>
      </Dialog>

      {/* Edit Routine Title Dialog */}
      <Dialog open={ui.editTitleDialogOpen} onOpenChange={(open) => setUi(prev => ({ ...prev, editTitleDialogOpen: open }))}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Routine Name</DialogTitle></DialogHeader>
          <Input value={newRoutineTitle} onChange={(e) => setNewRoutineTitle(e.target.value)} placeholder="Routine Name" className="mb-4" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setUi(prev => ({ ...prev, editTitleDialogOpen: false }))}>Cancel</Button>
            <Button onClick={() => { setRoutineName(newRoutineTitle); setUi(prev => ({ ...prev, editTitleDialogOpen: false })); toast.success("Routine renamed"); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Alert */}
      <AlertDialog open={ui.alertOpen} onOpenChange={(open) => setUi(prev => ({ ...prev, alertOpen: open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes detected!</AlertDialogTitle>
            <p className="text-sm text-muted-foreground mt-2">Do you want to save changes before continuing?</p>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <AlertDialogCancel onClick={() => setUi(prev => ({ ...prev, alertOpen: false }))}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { handleSaveRoutine(); createNewRoutine(); }}>Save & Continue</AlertDialogAction>
            <AlertDialogAction onClick={createNewRoutine}>Discard & Continue</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}