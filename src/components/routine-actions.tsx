// src/components/routine-builder/RoutineActions.tsx - SIMPLIFIED VERSION
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Trash, 
  X, 
  Copy, 
  Plus, 
  Menu, 
  Save, 
  FilePlus, 
  Pencil,
  Star,
  StarOff
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRoutineStore } from "@/store/routine-store";


export const RoutineActions: React.FC = () => {
  const {
    savedRoutines,
    templates,
    selectedRoutineId,
    currentRoutineId,
    isNewRoutine,
    hasUnsavedChanges,
    loadRoutine,
    deleteRoutine,
    duplicateRoutine,
    setCurrentRoutine,
    clearAll,
    addDay,
    saveRoutine,
    createNewRoutine,
    updateUI,
  } = useRoutineStore();

  const userRoutines = savedRoutines.filter(r => !r.isTemplate);
  const selectedRoutine = savedRoutines.find(r => r.id === selectedRoutineId);

  const handleLoadRoutine = (routineId: string) => {
    if (hasUnsavedChanges()) {
      updateUI({ 
        alertOpen: true, 
        alertAction: 'load',
        nextRoutineId: routineId 
      });
    } else {
      const routine = savedRoutines.find(r => r.id === routineId);
      if (routine) loadRoutine(routine);
    }
  };

  const handleNewRoutine = () => {
    if (hasUnsavedChanges()) {
      updateUI({ alertOpen: true, alertAction: 'new' });
    } else {
      createNewRoutine();
    }
  };

  const handleDeleteRoutine = (id: string) => {
    if (hasUnsavedChanges() && id === selectedRoutineId) {
      updateUI({ 
        alertOpen: true, 
        alertAction: 'delete',
        nextRoutineId: id 
      });
    } else {
      deleteRoutine(id);
    }
  };

  const handleClearAll = () => {
    if (hasUnsavedChanges()) {
      updateUI({ alertOpen: true, alertAction: 'clear' });
    } else {
      clearAll();
    }
  };

  return (
    <div className="flex items-end justify-between gap-2 flex-wrap">
      {/* Left side - Load routine and Add day */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex flex-col gap-2">
          <Label>Load Routine</Label>
          <Select
            value={selectedRoutineId || ""}
            onValueChange={handleLoadRoutine}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a routine" />
            </SelectTrigger>
            <SelectContent>
              {userRoutines.length > 0 && (
                <SelectGroup>
                  <SelectLabel>My Routines</SelectLabel>
                  {userRoutines.map((routine) => (
                    <SelectItem key={routine.id} value={routine.id}>
                      <div className="flex items-center gap-2">
                        {routine.name}
                        {currentRoutineId === routine.id && (
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
              {templates.length > 0 && (
                <SelectGroup>
                  <SelectLabel>Templates</SelectLabel>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-2">
          <Label className="opacity-0 hidden lg:block">_</Label>
          <Button onClick={addDay} variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Day
          </Button>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleNewRoutine}
          variant="outline"
          disabled={isNewRoutine && !hasUnsavedChanges()}
        >
          <FilePlus className="mr-2 h-4 w-4" /> New
        </Button>
        
        <Button 
          onClick={saveRoutine} 
          disabled={!hasUnsavedChanges()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Routine Actions</DropdownMenuLabel>
            
            {selectedRoutine && !selectedRoutine.isTemplate && (
              <>
                <DropdownMenuItem onClick={() => updateUI({ editTitleDialogOpen: true })}>
                  <Pencil className="mr-2 h-4 w-4" /> 
                  Edit Routine Name
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => duplicateRoutine(selectedRoutineId!)}>
                  <Copy className="mr-2 h-4 w-4" /> 
                  Duplicate Routine
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {currentRoutineId === selectedRoutineId ? (
                  <DropdownMenuItem onClick={() => setCurrentRoutine(null)}>
                    <StarOff className="mr-2 h-4 w-4" /> 
                    Unset as Current
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => setCurrentRoutine(selectedRoutineId!)}>
                    <Star className="mr-2 h-4 w-4" /> 
                    Set as Current
                  </DropdownMenuItem>
                )}
              </>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={handleClearAll} 
              disabled={!selectedRoutineId && !hasUnsavedChanges()}
            >
              <X className="mr-2 h-4 w-4" /> 
              Clear All Exercises
            </DropdownMenuItem>
            
            {selectedRoutine && !selectedRoutine.isTemplate && !isNewRoutine && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleDeleteRoutine(selectedRoutineId!)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="mr-2 h-4 w-4" /> 
                  Delete Routine
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};