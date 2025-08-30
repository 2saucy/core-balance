// src/hooks/use-rep-tracker.ts
import * as React from "react";
import { toast } from "sonner";
import { WorkoutTimerHandle } from "@/components/workout-timer";

// Moved interfaces and helper functions here for centralization
interface SetLog {
  reps: number;
  weight: number;
  durationInMs: number;
  restTimeInMs?: number;
}

interface WorkoutLog {
  date: string;
  sets: SetLog[];
  volume: number;
  oneRepMax: number;
  durationInMs: number;
}

const getLogsKey = (exerciseName: string) => `rep-tracker-${exerciseName.replace(/\s/g, "-").toLowerCase()}`;

const calculateOneRepMax = (weight: number, reps: number): number => {
  if (weight <= 0 || reps <= 0) return 0;
  return Math.round(weight * (1 + reps / 30));
};

export const useRepTracker = (exerciseName: string) => {
  const [logs, setLogs] = React.useState<WorkoutLog[]>([]);
  const [currentSets, setCurrentSets] = React.useState<SetLog[]>([]);
  const [reps, setReps] = React.useState(0);
  const [weight, setWeight] = React.useState(0);
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = React.useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);
  const [setDuration, setSetDuration] = React.useState(0);
  const [restTime, setRestTime] = React.useState(0);
  const [workoutPhase, setWorkoutPhase] = React.useState<'pre-workout' | 'training' | 'resting' | 'finished'>('pre-workout');
  const timerRef = React.useRef<WorkoutTimerHandle | null>(null);
  const [timerRunning, setTimerRunning] = React.useState(false);

  React.useEffect(() => {
    const savedLogs = localStorage.getItem(getLogsKey(exerciseName));
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, [exerciseName]);

  const updateSetDuration = React.useCallback((timeInMs: number) => {
    setSetDuration(timeInMs);
  }, []);

  const updateRestTime = React.useCallback((timeInMs: number) => {
    setRestTime(timeInMs);
  }, []);

  const handleStartWorkout = () => {
    setIsWorkoutDialogOpen(true);
    setWorkoutPhase('training');
    setTimerRunning(false);
    timerRef.current?.resetTimer();
  };

  const handleToggleTimer = () => {
    if (timerRunning) {
      timerRef.current?.pauseTimer();
      setTimerRunning(false);
      toast.info("Timer paused.");
    } else {
      timerRef.current?.startTimer();
      setTimerRunning(true);
      toast.info("Timer started.");
    }
  };

  const handleAddSet = () => {
    if (reps <= 0 || weight <= 0) {
      toast.error("Please enter positive values for reps and weight.");
      return;
    }

    const currentTime = timerRef.current?.getTime?.() ?? setDuration;
    const newSet: SetLog = {
      reps,
      weight,
      durationInMs: currentTime,
      restTimeInMs: 0,
    };

    setCurrentSets([...currentSets, newSet]);
    setWorkoutPhase('resting');
    setReps(0);
    setWeight(0);
    setSetDuration(0);
    setRestTime(0);

    setTimeout(() => {
      timerRef.current?.resetTimer();
      timerRef.current?.startTimer();
      setTimerRunning(true);
      toast.success("Set added! Rest timer started.");
    }, 80);
  };

  const handleFinishRest = () => {
    const restTime = timerRef.current?.getTime?.() ?? 0;
    const lastSetIndex = currentSets.length - 1;

    if (lastSetIndex >= 0) {
      const updatedSets = [...currentSets];
      updatedSets[lastSetIndex] = {
        ...updatedSets[lastSetIndex],
        restTimeInMs: restTime,
      };
      setCurrentSets(updatedSets);
    }
    timerRef.current?.resetTimer();
    setTimerRunning(false);
    setWorkoutPhase('training');
    toast.success("Rest finished. Start your next set manually.");
  };

  const handleFinishExercise = () => {
    timerRef.current?.pauseTimer();
    setTimerRunning(false);
    setWorkoutPhase('finished');
    toast.info("Exercise finished. You can now save your workout.");
  };

  const handleSaveWorkout = () => {
    if (currentSets.length === 0) {
      toast.error("Please add at least one set before saving.");
      return;
    }

    const totalDuration = currentSets.reduce((sum, s) => sum + s.durationInMs + (s.restTimeInMs || 0), 0);
    const totalVolume = currentSets.reduce((sum, set) => sum + (set.reps * set.weight), 0);
    const maxOneRepMax = Math.max(...currentSets.map(set => calculateOneRepMax(set.weight, set.reps)));

    const newLog: WorkoutLog = {
      date: new Date().toISOString().split('T')[0],
      sets: currentSets,
      volume: totalVolume,
      oneRepMax: maxOneRepMax,
      durationInMs: totalDuration,
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem(getLogsKey(exerciseName), JSON.stringify(updatedLogs));

    setCurrentSets([]);
    setSetDuration(0);
    setRestTime(0);
    setWorkoutPhase('pre-workout');
    setIsWorkoutDialogOpen(false);
    toast.success("Workout log saved!");
  };

  const handleDeleteLog = (logIndex: number) => {
    const updatedLogs = logs.filter((_, i) => i !== logIndex);
    setLogs(updatedLogs);
    localStorage.setItem(getLogsKey(exerciseName), JSON.stringify(updatedLogs));
    toast.info("Log deleted.");
  };

  const loadLastWeight = () => {
    const lastWorkout = logs[0];
    if (lastWorkout && lastWorkout.sets.length > 0) {
      const lastSet = lastWorkout.sets[lastWorkout.sets.length - 1];
      setWeight(lastSet.weight);
      toast.info(`Weight loaded: ${lastSet.weight} kg`);
    } else {
      toast.error("No previous workout found to load weight.");
    }
  };

  return {
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
    setSetDuration,
    setRestTime,
    workoutPhase,
    setWorkoutPhase,
    timerRef,
    timerRunning,
    setTimerRunning,
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
  };
};