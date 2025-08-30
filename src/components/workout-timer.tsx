// src/components/workout-timer.tsx
"use client";

import * as React from "react";

interface WorkoutTimerProps {
  onTimeUpdate: (timeInMs: number) => void;
}

export interface WorkoutTimerHandle {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  getTime: () => number;
}

export const WorkoutTimer = React.forwardRef<WorkoutTimerHandle, WorkoutTimerProps>(
  function WorkoutTimer({ onTimeUpdate }, ref) { // Component now has a name
    const [time, setTime] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(false);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => setIsRunning(true);
    const pauseTimer = () => setIsRunning(false);
    const resetTimer = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRunning(false);
      setTime(0);
      onTimeUpdate(0);
    };

    React.useImperativeHandle(
      ref,
      () => ({
        startTimer,
        pauseTimer,
        resetTimer,
        getTime: () => time,
      }),
      [time]
    );

    React.useEffect(() => {
      if (isRunning) {
        timerRef.current = setInterval(() => {
          setTime((prevTime) => {
            const newTime = prevTime + 10;
            onTimeUpdate(newTime);
            return newTime;
          });
        }, 10);
      } else if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }, [isRunning, onTimeUpdate]);

    const formatTime = (timeInMs: number) => {
      const totalSeconds = Math.floor(timeInMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const milliseconds = Math.floor((timeInMs % 1000) / 10);
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
    };

    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-5xl font-mono tracking-wide">{formatTime(time)}</div>
      </div>
    );
  }
);