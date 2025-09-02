// src/stores/routine-store.ts - SIMPLIFIED VERSION
import { create } from "zustand";
import { toast } from "sonner";
import type { Exercise, Day, SavedRoutine, UIState } from "@/lib/types/routine-builder-types";
import { categoryMap, exercisesByCategory, generateDaysForSplit } from "@/lib/routine-builder-helpers";

// Templates - Static data
const TEMPLATES: SavedRoutine[] = [
  {
    id: "template-beginner-fullbody",
    name: "Beginner Full Body",
    split: "Full Body",
    isTemplate: true,
    difficulty: "beginner",
    tags: ["beginner", "full-body"],
    createdAt: new Date().toISOString(),
    days: [
      {
        name: "Day 1 (Full Body)",
        category: "FullBody",
        exercises: [
          { name: "Push-up", sets: 3, reps: 10 },
          { name: "Squat", sets: 3, reps: 15 },
          { name: "Pull-up", sets: 3, reps: 8 },
          { name: "Plank", sets: 3, reps: 30 }
        ]
      },
      {
        name: "Day 2 (Full Body)",
        category: "FullBody", 
        exercises: [
          { name: "Bench Press", sets: 3, reps: 12 },
          { name: "Deadlift", sets: 3, reps: 8 },
          { name: "Row", sets: 3, reps: 12 },
          { name: "Overhead Press", sets: 3, reps: 10 }
        ]
      },
      {
        name: "Day 3 (Full Body)",
        category: "FullBody",
        exercises: [
          { name: "Incline Bench Press", sets: 3, reps: 10 },
          { name: "Leg Press", sets: 3, reps: 15 },
          { name: "Lat Pulldown", sets: 3, reps: 12 },
          { name: "Russian Twist", sets: 3, reps: 20 }
        ]
      }
    ]
  }
];

// Storage keys
const STORAGE_KEY = "routines";
const CURRENT_KEY = "currentRoutineId";

// Store interface
interface RoutineStore {
  // State
  routine: Day[];
  routineName: string;
  currentSplit: string;
  savedRoutines: SavedRoutine[];
  currentRoutineId: string | null;
  selectedRoutineId: string | null;
  isNewRoutine: boolean;
  createdAt: string | null;
  ui: UIState;
  templates: SavedRoutine[];

  // Computed
  hasUnsavedChanges: () => boolean;
  userRoutines: () => SavedRoutine[];

  // Basic actions
  setRoutineName: (name: string) => void;
  updateUI: (updates: Partial<UIState>) => void;
  
  // Routine management
  loadRoutine: (routine: SavedRoutine) => void;
  saveRoutine: () => void;
  deleteRoutine: (id: string) => void;
  duplicateRoutine: (id: string) => void;
  createNewRoutine: () => void;
  setCurrentRoutine: (id: string | null) => void;
  
  // Exercise management
  addExercise: (dayName: string, exercise: Exercise) => void;
  editExercise: (dayName: string, index: number, exercise: Exercise) => void;
  deleteExercise: (dayName: string, index: number) => void;
  
  // Day management
  addDay: () => void;
  deleteDay: (index: number) => void;
  editDayName: (index: number, newName: string) => void;
  
  // Utility
  clearAll: () => void;
  getExercisesForDay: (dayName: string) => string[];
  initialize: () => void;
}

export const useRoutineStore = create<RoutineStore>((set, get) => ({
  // Initial state
  routine: [],
  routineName: "",
  currentSplit: "Full Body",
  savedRoutines: [],
  currentRoutineId: null,
  selectedRoutineId: null,
  isNewRoutine: true,
  createdAt: null,
  ui: {
    dialogOpen: false,
    editingIndex: null,
    openAccordionItems: [],
    alertOpen: false,
    editTitleDialogOpen: false,
    editDayNameDialogOpen: false,
  },
  templates: TEMPLATES,

  // Computed properties
  hasUnsavedChanges: () => {
    const state = get();
    if (state.isNewRoutine) {
      return state.routine.some(day => day.exercises.length > 0) || state.routineName.trim() !== "";
    }
    
    const originalRoutine = state.savedRoutines.find(r => r.id === state.selectedRoutineId);
    if (!originalRoutine) return false;
    
    return JSON.stringify(state.routine) !== JSON.stringify(originalRoutine.days) ||
           state.routineName !== originalRoutine.name ||
           state.currentSplit !== originalRoutine.split;
  },

  userRoutines: () => {
    return get().savedRoutines.filter(r => !r.isTemplate);
  },

  // Storage helpers
  _loadFromStorage: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading routines:", error);
      return [];
    }
  },

  _saveToStorage: (routines: SavedRoutine[]) => {
    try {
      const userRoutines = routines.filter(r => !r.isTemplate);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userRoutines));
    } catch (error) {
      console.error("Error saving routines:", error);
      toast.error("Failed to save routines");
    }
  },

  // Basic actions
  setRoutineName: (name: string) => {
    set({ routineName: name });
  },

  updateUI: (updates: Partial<UIState>) => {
    set(state => ({ ui: { ...state.ui, ...updates } }));
  },

  // Routine management
  loadRoutine: (routineToLoad: SavedRoutine) => {
    set({
      routine: routineToLoad.days,
      routineName: routineToLoad.name,
      currentSplit: routineToLoad.split,
      selectedRoutineId: routineToLoad.id,
      isNewRoutine: false,
      createdAt: routineToLoad.createdAt,
      ui: {
        dialogOpen: false,
        editingIndex: null,
        openAccordionItems: [],
        alertOpen: false,
        editTitleDialogOpen: false,
        editDayNameDialogOpen: false,
      }
    });
    
    if (!routineToLoad.isTemplate) {
      toast.success(`Loaded "${routineToLoad.name}"`);
    }
  },

  saveRoutine: () => {
    const state = get();
    
    if (state.routine.every(day => day.exercises.length === 0)) {
      toast.error("Add at least one exercise before saving");
      return;
    }

    let finalName = state.routineName?.trim();
    if (!finalName) {
      const existingNames = state.userRoutines()
        .map(r => r.name)
        .filter(n => n.startsWith("Unnamed Routine"));
      
      let counter = 1;
      while (existingNames.includes(`Unnamed Routine ${counter}`)) counter++;
      finalName = `Unnamed Routine ${counter}`;
    }

    if (state.selectedRoutineId && !state.savedRoutines.find(r => r.id === state.selectedRoutineId)?.isTemplate) {
      // Update existing
      const updated = state.savedRoutines.map(r =>
        r.id === state.selectedRoutineId
          ? { ...r, days: state.routine, split: state.currentSplit, name: finalName }
          : r
      );
      
      set({ savedRoutines: updated, routineName: finalName });
      get()._saveToStorage(updated);
    } else {
      // Create new
      const newRoutine: SavedRoutine = {
        id: crypto.randomUUID(),
        name: finalName,
        split: state.currentSplit,
        days: state.routine,
        createdAt: new Date().toISOString(),
        tags: []
      };
      
      const updated = [...state.savedRoutines, newRoutine];
      set({
        savedRoutines: updated,
        selectedRoutineId: newRoutine.id,
        routineName: finalName,
        isNewRoutine: false,
        createdAt: newRoutine.createdAt,
      });
      get()._saveToStorage(updated);
    }
    
    toast.success("Routine saved successfully!");
  },

  deleteRoutine: (id: string) => {
    const state = get();
    const routineToDelete = state.savedRoutines.find(r => r.id === id);
    
    if (routineToDelete?.isTemplate) {
      toast.error("Cannot delete template routines");
      return;
    }

    const updated = state.savedRoutines.filter(r => r.id !== id);
    set({ savedRoutines: updated });
    get()._saveToStorage(updated);
    
    // Clear current if deleted
    if (id === state.currentRoutineId) {
      set({ currentRoutineId: null });
      localStorage.removeItem(CURRENT_KEY);
    }
    
    // Create new routine if selected was deleted
    if (id === state.selectedRoutineId) {
      get().createNewRoutine();
    }
    
    toast.success("Routine deleted");
  },

  duplicateRoutine: (id: string) => {
    const state = get();
    const originalRoutine = state.savedRoutines.find(r => r.id === id);
    if (!originalRoutine) return;

    const duplicated: SavedRoutine = {
      ...originalRoutine,
      id: crypto.randomUUID(),
      name: `${originalRoutine.name} (Copy)`,
      createdAt: new Date().toISOString(),
      isTemplate: false
    };

    const updated = [...state.savedRoutines, duplicated];
    set({ savedRoutines: updated });
    get()._saveToStorage(updated);
    toast.success("Routine duplicated!");
  },

  createNewRoutine: () => {
    const state = get();
    const newDays = generateDaysForSplit(state.currentSplit);
    
    set({
      selectedRoutineId: null,
      routine: newDays,
      routineName: "",
      isNewRoutine: true,
      createdAt: null,
      ui: {
        dialogOpen: false,
        editingIndex: null,
        openAccordionItems: [],
        alertOpen: false,
        editTitleDialogOpen: false,
        editDayNameDialogOpen: false,
      }
    });
  },

  setCurrentRoutine: (id: string | null) => {
    const state = get();
    
    if (id) {
      const routine = state.savedRoutines.find(r => r.id === id);
      if (routine?.isTemplate) {
        toast.error("Cannot set template as current routine");
        return;
      }
      localStorage.setItem(CURRENT_KEY, id);
      toast.success("Routine set as current!");
    } else {
      localStorage.removeItem(CURRENT_KEY);
      toast.success("Current routine unset");
    }
    
    set({ currentRoutineId: id });
  },

  // Exercise management
  addExercise: (dayName: string, exercise: Exercise) => {
    set(state => ({
      routine: state.routine.map(d =>
        d.name === dayName
          ? { ...d, exercises: [...d.exercises, exercise] }
          : d
      )
    }));
    toast.success("Exercise added!");
  },

  editExercise: (dayName: string, index: number, exercise: Exercise) => {
    set(state => ({
      routine: state.routine.map(d =>
        d.name === dayName
          ? {
              ...d,
              exercises: d.exercises.map((ex, i) => i === index ? exercise : ex)
            }
          : d
      )
    }));
    toast.success("Exercise updated!");
  },

  deleteExercise: (dayName: string, index: number) => {
    set(state => ({
      routine: state.routine.map(d =>
        d.name === dayName
          ? { ...d, exercises: d.exercises.filter((_, i) => i !== index) }
          : d
      )
    }));
    toast.success("Exercise deleted");
  },

  // Day management
  addDay: () => {
    const state = get();
    const newDayName = `Day ${state.routine.length + 1}`;
    const newDay: Day = {
      name: newDayName,
      exercises: [],
      category: "FullBody"
    };
    
    set({ routine: [...state.routine, newDay] });
    toast.success("New day added");
  },

  deleteDay: (index: number) => {
    const state = get();
    if (state.routine.length <= 1) {
      toast.error("Cannot delete the last day");
      return;
    }
    
    set({
      routine: state.routine.filter((_, i) => i !== index)
    });
    toast.success("Day deleted");
  },

  editDayName: (index: number, newName: string) => {
    set(state => ({
      routine: state.routine.map((day, i) =>
        i === index ? { ...day, name: newName } : day
      )
    }));
    toast.success("Day name updated");
  },

  // Utility
  clearAll: () => {
    const state = get();
    const newDays = generateDaysForSplit(state.currentSplit);
    
    set({
      routine: newDays,
      ui: {
        ...state.ui,
        openAccordionItems: [],
        editingIndex: null
      }
    });
    toast.info("All exercises cleared");
  },

  getExercisesForDay: (dayName: string) => {
    const state = get();
    const day = state.routine.find(d => d.name === dayName);
    
    if (!day?.category) return [];
    
    const mainCategories = categoryMap[day.category] || [];
    const mainExercises = mainCategories.flatMap(cat => exercisesByCategory[cat] || []);
    const coreExercises = exercisesByCategory.Core || [];
    
    return [...new Set([...mainExercises, ...coreExercises])];
  },

  initialize: () => {
    const userRoutines = get()._loadFromStorage();
    const allRoutines = [...userRoutines, ...TEMPLATES];
    
    set({ savedRoutines: allRoutines });
    
    const currentId = localStorage.getItem(CURRENT_KEY);
    set({ currentRoutineId: currentId });

    const initialRoutine = allRoutines.find(r => r.id === currentId && !r.isTemplate);
    if (initialRoutine) {
      get().loadRoutine(initialRoutine);
    } else {
      get().createNewRoutine();
    }
  },
}));