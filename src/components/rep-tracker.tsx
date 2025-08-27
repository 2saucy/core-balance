"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CirclePlus, Save, Trash, History, Dumbbell, TrendingUp, Calendar, SquareStack } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RepTrackerProps {
  exerciseName: string;
  category?: string;
}

interface SetLog {
  reps: number;
  weight: number;
}

interface WorkoutLog {
  date: string;
  sets: SetLog[];
  volume: number;
  oneRepMax: number;
}

const getLogsKey = (exerciseName: string) => `rep-tracker-${exerciseName.replace(/\s/g, "-").toLowerCase()}`;

const calculateOneRepMax = (weight: number, reps: number): number => {
  if (weight <= 0 || reps <= 0) return 0;
  return Math.round(weight * (1 + reps / 30));
};

export default function RepTracker({ exerciseName, category }: RepTrackerProps) {
  const [logs, setLogs] = React.useState<WorkoutLog[]>([]);
  const [currentSets, setCurrentSets] = React.useState<SetLog[]>([]);
  const [reps, setReps] = React.useState(0);
  const [weight, setWeight] = React.useState(0);
  const [isAddSetOpen, setIsAddSetOpen] = React.useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);

  React.useEffect(() => {
    const savedLogs = localStorage.getItem(getLogsKey(exerciseName));
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, [exerciseName]);

  const handleAddSet = () => {
    if (reps <= 0 || weight <= 0) {
      toast.error("Please enter positive values for reps and weight.");
      return;
    }
    setCurrentSets([...currentSets, { reps, weight }]);
    setReps(0);
    setWeight(0);
  };

  const handleSaveWorkout = () => {
    if (currentSets.length === 0) {
      toast.error("Please add at least one set before saving.");
      return;
    }

    const totalVolume = currentSets.reduce((sum, set) => sum + (set.reps * set.weight), 0);
    const maxOneRepMax = Math.max(...currentSets.map(set => calculateOneRepMax(set.weight, set.reps)));

    const newLog: WorkoutLog = {
      date: new Date().toISOString().split('T')[0],
      sets: currentSets,
      volume: totalVolume,
      oneRepMax: maxOneRepMax,
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem(getLogsKey(exerciseName), JSON.stringify(updatedLogs));

    setCurrentSets([]);
    setIsAddSetOpen(false);
    toast.success("Workout log saved!");
  };

  const handleDeleteLog = (logIndex: number) => {
    const updatedLogs = logs.filter((_, i) => i !== logIndex);
    setLogs(updatedLogs);
    localStorage.setItem(getLogsKey(exerciseName), JSON.stringify(updatedLogs));
    toast.info("Log deleted.");
  };

  const maxOneRepMax = logs.length > 0
    ? Math.max(...logs.map(log => log.oneRepMax))
    : null;

  const lastLog = logs.length > 0 ? logs[0] : null;

  return (
    <Card className="p-4">
      <CardHeader className="p-0 pt-0">
        <CardTitle className="text-2xl font-bold truncate">{exerciseName}</CardTitle>
      </CardHeader>
      <CardContent className="h-full p-0">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span><b>1RM</b> : {maxOneRepMax ? `${maxOneRepMax} kg` : "Unknown"}</span>
          </div>
          <div className="flex items-center gap-2">
            <SquareStack className="h-4 w-4" />
            <span><b>Category</b> : {category || "Unknown"}</span>
          </div>
          {lastLog && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span><b>Last workout</b> : {lastLog.date}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-0 mt-auto">
        <div className="grid grid-cols-2 gap-4 w-full">
          <Dialog open={isAddSetOpen} onOpenChange={setIsAddSetOpen}>
            <DialogTrigger asChild>
              <Button className="h-24 flex-col justify-center gap-2">
                <Dumbbell className="h-6 w-6" />
                <span className="text-sm">Add Set</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Workout Set</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                  />
                </div>
                <Button onClick={handleAddSet} className="w-full">
                  <CirclePlus className="mr-2 h-4 w-4" /> Add Set to Workout
                </Button>
                {currentSets.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-base mb-2">Current Workout</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {currentSets.map((set, index) => (
                        <li key={index}>
                          Set {index + 1}: {set.reps} reps @ {set.weight} kg
                        </li>
                      ))}
                    </ul>
                    <Button onClick={handleSaveWorkout} className="mt-4 w-full">
                      <Save className="mr-2 h-4 w-4" /> Save Workout
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-24 flex-col justify-center gap-2">
                <History className="h-6 w-6" />
                <span className="text-sm">See History</span>
              </Button>
            </DialogTrigger>
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
                          <span className="font-medium text-sm text-gray-600 dark:text-gray-400">{log.date}</span>
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
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-sm">No workout history available.</p>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}