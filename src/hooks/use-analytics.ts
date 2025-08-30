import { CalculatorStats, OverviewStats, ProgressData, RecentActivity, WorkoutStats } from "@/lib/types/analytics-types";
import * as React from "react";

export function useAnalytics() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [overviewStats, setOverviewStats] = React.useState<OverviewStats>({
    totalCalculations: 0,
    activeRoutines: 0,
    workoutSessions: 0,
    daysActive: 0
  });
  const [calculatorStats, setCalculatorStats] = React.useState<CalculatorStats>({});
  const [workoutStats, setWorkoutStats] = React.useState<WorkoutStats>({
    totalRoutines: 0,
    currentRoutine: null,
    mostTrainedExercise: null,
    totalVolume: 0,
    exerciseVolume: []
  });
  const [progressData, setProgressData] = React.useState<ProgressData>({
    bmi: [],
    bodyFat: [],
    calories: [],
    weight: []
  });
  const [recentActivity, setRecentActivity] = React.useState<RecentActivity[]>([]);

  React.useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Load Calculator Data
        const bmiHistory = JSON.parse(localStorage.getItem("bmi_history") || "[]");
        const bodyFatHistory = JSON.parse(localStorage.getItem("body_fat_history") || "[]");
        const caloriesHistory = JSON.parse(localStorage.getItem("calories_history") || "[]");
        const macroSplitHistory = JSON.parse(localStorage.getItem("macro_split_history") || "[]");
        const idealWeightHistory = JSON.parse(localStorage.getItem("ideal_weight_history") || "[]");

        // Load Workout Data
        const routines = JSON.parse(localStorage.getItem("routines") || "[]");
        const currentRoutineId = localStorage.getItem("currentRoutineId");

        // Calculate Overview Stats
        const totalCalculations = bmiHistory.length + bodyFatHistory.length + 
          caloriesHistory.length + macroSplitHistory.length + idealWeightHistory.length;

        // Get unique activity dates
        const allDates = new Set([
          ...bmiHistory.map((item: any) => item.date),
          ...bodyFatHistory.map((item: any) => item.date),
          ...caloriesHistory.map((item: any) => item.date),
          ...macroSplitHistory.map((item: any) => item.date),
          ...idealWeightHistory.map((item: any) => item.date)
        ]);

        // Calculate workout sessions from rep tracker data
        let workoutSessionsCount = 0;
        const exerciseVolumeMap: { [key: string]: number } = {};
        
        // Get all rep tracker keys from localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("rep-tracker-")) {
            const logs = JSON.parse(localStorage.getItem(key) || "[]");
            workoutSessionsCount += logs.length;
            
            // Calculate exercise volume
            const exerciseName = key.replace("rep-tracker-", "").replace(/-/g, " ");
            const totalVolume = logs.reduce((sum: number, log: any) => {
              const sessionVolume = log.sets?.reduce((setSum: number, set: any) => 
                setSum + (set.reps * set.weight), 0) || 0;
              return sum + sessionVolume;
            }, 0);
            
            if (totalVolume > 0) {
              exerciseVolumeMap[exerciseName] = totalVolume;
            }
          }
        }

        const exerciseVolumeArray = Object.entries(exerciseVolumeMap)
          .map(([exercise, volume]) => ({ exercise, volume }))
          .sort((a, b) => b.volume - a.volume)
          .slice(0, 10); // Top 10 exercises by volume

        const mostTrainedExercise = exerciseVolumeArray.length > 0 
          ? exerciseVolumeArray[0].exercise 
          : null;

        const totalVolume = exerciseVolumeArray.reduce((sum, item) => sum + item.volume, 0);

        const currentRoutine = routines.find((r: any) => r.id === currentRoutineId);

        setOverviewStats({
          totalCalculations,
          activeRoutines: routines.length,
          workoutSessions: workoutSessionsCount,
          daysActive: allDates.size
        });

        // Calculate Calculator Stats
        const calculatorStatsData: CalculatorStats = {
          bmi: {
            total: bmiHistory.length,
            lastUsed: bmiHistory[0]?.date || null,
            latestValue: bmiHistory[0]?.bmi ? `${bmiHistory[0].bmi} (${bmiHistory[0].classification})` : null
          },
          body_fat: {
            total: bodyFatHistory.length,
            lastUsed: bodyFatHistory[0]?.date || null,
            latestValue: bodyFatHistory[0]?.bodyFatPercentage ? `${bodyFatHistory[0].bodyFatPercentage}%` : null
          },
          calories: {
            total: caloriesHistory.length,
            lastUsed: caloriesHistory[0]?.date || null,
            latestValue: caloriesHistory[0]?.calorieTarget ? `${caloriesHistory[0].calorieTarget} kcal` : null
          },
          macro_split: {
            total: macroSplitHistory.length,
            lastUsed: macroSplitHistory[0]?.date || null,
            latestValue: macroSplitHistory[0]?.calorieTarget ? `${macroSplitHistory[0].calorieTarget} kcal` : null
          },
          ideal_weight: {
            total: idealWeightHistory.length,
            lastUsed: idealWeightHistory[0]?.date || null,
            latestValue: idealWeightHistory[0]?.idealWeight ? 
              `${idealWeightHistory[0].idealWeight} ${idealWeightHistory[0].units === 'metric' ? 'kg' : 'lbs'}` : null
          }
        };

        setCalculatorStats(calculatorStatsData);

        setWorkoutStats({
          totalRoutines: routines.length,
          currentRoutine: currentRoutine?.name || null,
          mostTrainedExercise,
          totalVolume: Math.round(totalVolume),
          exerciseVolume: exerciseVolumeArray
        });

        // Prepare Progress Data
        const progressDataObj: ProgressData = {
          bmi: bmiHistory.slice(0, 10).reverse().map((item: any) => ({
            date: item.date,
            value: item.bmi
          })),
          bodyFat: bodyFatHistory.slice(0, 10).reverse().map((item: any) => ({
            date: item.date,
            value: item.bodyFatPercentage
          })),
          calories: caloriesHistory.slice(0, 10).reverse().map((item: any) => ({
            date: item.date,
            value: item.calorieTarget
          })),
          weight: [
            ...bmiHistory.map((item: any) => ({
              date: item.date,
              value: item.formValues.weight
            })),
            ...bodyFatHistory.map((item: any) => ({
              date: item.date,
              value: item.weight
            }))
          ].slice(0, 10)
        };

        setProgressData(progressDataObj);

        // Generate Recent Activity
        const activities: RecentActivity[] = [];

        // Add recent calculations
        [
          ...bmiHistory.slice(0, 3).map((item: any) => ({
            type: 'calculation' as const,
            description: `BMI calculated: ${item.bmi} (${item.classification})`,
            date: item.date
          })),
          ...bodyFatHistory.slice(0, 3).map((item: any) => ({
            type: 'calculation' as const,
            description: `Body fat calculated: ${item.bodyFatPercentage}%`,
            date: item.date
          })),
          ...caloriesHistory.slice(0, 3).map((item: any) => ({
            type: 'calculation' as const,
            description: `Calorie target set: ${item.calorieTarget} kcal`,
            date: item.date
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
         .slice(0, 5)
         .forEach(activity => activities.push(activity));

        // Add routine activities
        routines.slice(0, 2).forEach((routine: any) => {
          activities.push({
            type: 'routine',
            description: `Routine created: ${routine.name}`,
            date: routine.createdAt ? new Date(routine.createdAt).toLocaleDateString() : 'Unknown'
          });
        });

        setRecentActivity(activities.slice(0, 10));

      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return {
    isLoading,
    overviewStats,
    calculatorStats,
    workoutStats,
    progressData,
    recentActivity
  };
}