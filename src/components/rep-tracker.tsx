// src/components/rep-tracker.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  CirclePlus,
  Save,
  Trash,
  History,
  TrendingUp,
  Calendar,
  SquareStack,
  Play,
  RefreshCw,
  X,
  CheckCircle,
  Pause,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkoutTimer } from "@/components/workout-timer";
import { Badge } from "@/components/ui/badge";
import { useRepTracker } from "@/hooks/use-rep.tracker";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useTheme } from "next-themes";

interface RepTrackerProps {
  exerciseName: string;
  category?: string;
}

export default function RepTracker({ exerciseName, category }: RepTrackerProps) {
  const { theme } = useTheme();

  const {
    logs,
    currentSets,
    reps,
    setReps,
    weight,
    setWeight,
    isWorkoutDialogOpen,
    setIsWorkoutDialogOpen,
    isHistoryOpen,
    setIsHistoryOpen,
    workoutPhase,
    timerRef,
    timerRunning,
    updateSetDuration,
    updateRestTime,
    handleStartWorkout,
    handleToggleTimer,
    handleAddSet,
    handleFinishRest,
    handleFinishExercise,
    handleSaveWorkout,
    handleDeleteLog,
    loadLastWeight,
  } = useRepTracker(exerciseName);

  const maxOneRepMax = logs.length > 0 ? Math.max(...logs.map(log => log.oneRepMax)) : null;
  const lastLog = logs.length > 0 ? logs[0] : null;

  const formatDuration = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatSetDuration = (durationInMs: number) => {
    const totalSeconds = Math.floor(durationInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `(${minutes}m ${seconds}s)`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold truncate">{exerciseName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground h-full mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <span><b>1RM</b> : {maxOneRepMax ? `${maxOneRepMax} kg` : "Unknown"}</span>
        </div>
        <div className="flex items-center gap-2">
          <SquareStack className="h-4 w-4" />
          <span><b>Category</b> : {category || "Unknown"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span><b>Last workout</b> : {lastLog == null ? "None" : lastLog.date}</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="grid grid-cols-2 gap-4 w-full">
          <Dialog open={isWorkoutDialogOpen} onOpenChange={setIsWorkoutDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button onClick={handleStartWorkout} className="h-16 flex-col justify-center gap-2">
                    <Play fill={theme === "dark" ? "black" : "white"} className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start exercise</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Workout Session</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                {workoutPhase !== 'finished' && (
                  <div className="flex justify-center items-center gap-2 mb-2">
                    <Badge variant={workoutPhase === 'training' ? 'default' : 'secondary'}>Training</Badge>
                    <Badge variant={workoutPhase === 'resting' ? 'default' : 'secondary'}>Resting</Badge>
                  </div>
                )}
                {workoutPhase === 'training' && (
                  <>
                    <div className="my-4 space-y-8">
                      <WorkoutTimer onTimeUpdate={updateSetDuration} ref={timerRef} />
                      <div className="flex justify-center">
                        <Button onClick={handleToggleTimer} className="duration-200 hover:scale-105 flex items-center justify-center rounded-full aspect-square h-16">
                          {timerRunning ? (
                            <Pause className="size-6" fill={theme === "dark" ? "black" : "white"} />

                          ) : (
                            <Play className="size-6" fill={theme === "dark" ? "black" : "white"} />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reps">Reps</Label>
                      <Input id="reps" type="number" value={reps} onChange={(e) => setReps(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Button onClick={loadLastWeight} variant="ghost" size="sm" className="h-auto p-1">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          <span className="text-xs">Load Last</span>
                        </Button>
                      </div>
                      <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
                    </div>
                  </>
                )}
                <div className="mt-8">
                  {workoutPhase === 'training' && (
                    <Button onClick={handleAddSet} className="w-full">
                      <CirclePlus className="mr-2 h-4 w-4" /> Add Set to Workout
                    </Button>
                  )}
                  {workoutPhase === 'resting' && (
                    <>
                      <WorkoutTimer onTimeUpdate={updateRestTime} ref={timerRef} />
                      <div className="flex gap-2 mt-12">
                        <Button onClick={handleFinishRest} className="flex-1">
                          <CheckCircle className="mr-2 h-4 w-4" /> Finalizar Descanso
                        </Button>
                        <Button onClick={handleToggleTimer} variant="outline" className="flex-1">
                          {timerRunning ? "Pausar" : "Reanudar"}
                        </Button>
                      </div>
                    </>
                  )}
                  {workoutPhase !== 'pre-workout' && workoutPhase !== 'finished' && (
                    <Button onClick={handleFinishExercise} variant="secondary" className="w-full mt-4">
                      <X className="mr-2 h-4 w-4" /> Finalizar Ejercicio
                    </Button>
                  )}
                </div>
                {workoutPhase === 'finished' && (
                  <>
                    <div className="mt-4">
                      <h4 className="font-semibold text-base mb-2">Current Workout</h4>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {currentSets.map((set, index) => (
                          <li key={index} className="flex justify-between">
                            <span>Set {index + 1}: {set.reps} reps @ {set.weight} kg {formatSetDuration(set.durationInMs)}</span>
                            {set.restTimeInMs !== undefined && (
                              <span className="text-muted-foreground">Resting: ({formatSetDuration(set.restTimeInMs)})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button onClick={handleSaveWorkout} className="mt-4 w-full">
                      <Save className="mr-2 h-4 w-4" /> Save Workout
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-16 flex-col justify-center gap-2">
                    <History className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>View history</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Workout History</DialogTitle>
              </DialogHeader>
              {logs.length > 0 ? (
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {logs.map((log, index) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm text-gray-600 dark:text-gray-400">Log date: {log.date}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteLog(index)}>
                            <Trash className="size-4 text-red-500" />
                          </Button>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {log.sets.map((set, setIndex) => (
                            <li key={setIndex}>
                              Set {setIndex + 1}: {set.reps} reps @ {set.weight} kg
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Total Duration: {formatDuration(log.durationInMs)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-sm">No workout history available.</p>
              )}
              <DialogClose asChild>
                <Button className="mt-4 w-full">Close</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}