interface OverviewStats {
    totalCalculations: number;
    activeRoutines: number;
    workoutSessions: number;
    daysActive: number;
}

interface CalculatorStat {
    total: number;
    lastUsed: string | null;
    latestValue: string | null;
}

interface CalculatorStats {
    [key: string]: CalculatorStat;
}

interface WorkoutStats {
    totalRoutines: number;
    currentRoutine: string | null;
    mostTrainedExercise: string | null;
    totalVolume: number;
    exerciseVolume: Array<{ exercise: string; volume: number }>;
}

interface ProgressDataPoint {
    date: string;
    value: number;
}

interface ProgressData {
    bmi: ProgressDataPoint[];
    bodyFat: ProgressDataPoint[];
    calories: ProgressDataPoint[];
    weight: ProgressDataPoint[];
}

interface RecentActivity {
    type: 'calculation' | 'workout' | 'routine';
    description: string;
    date: string;
}

export type {
    OverviewStats,
    CalculatorStats,
    WorkoutStats,
    ProgressData,
    RecentActivity
};