"use client";

import { ChartBarDefault } from "@/components/chart-bar-default";
import { ChartPieDonutBodyComposition as ChartPieDonutText } from "@/components/chart-donut-text";
import { ChartLineDots } from "@/components/chart-line-dots";

import FloatingActionButton from "@/components/floating-action-button";
import MetricCard from "@/components/metric-card";
import TipCard from "@/components/tip-card";
import data from "@/data/data.json";

const DashboardPage = () => {
  const { user, dailyTips } = data;
  const { metrics } = user;

  // --- helpers para sacar último y anterior ---
  const getLastTwo = (arr: any[]) => {
    if (!arr || arr.length < 2) return [undefined, undefined];
    return [arr[0]?.value, arr[1]?.value]; // siempre el último primero
  };

  // métricas simples (solo value)
  const [lastWeight, prevWeight] = getLastTwo(metrics.weight);
  const [lastBmi, prevBmi] = getLastTwo(metrics.bmi);
  const [lastBodyFat, prevBodyFat] = getLastTwo(metrics.bodyFatPercent);
  const [lastMuscle, prevMuscle] = getLastTwo(metrics.muscleMass_kg);

  return (
    <div className="flex flex-col gap-12 px-32 py-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Welcome back, {user.name}! 🤚</h1>
        <p className="italic text-gray-500">
          Tu puntuación total de fitness es de:{" "}
          <span className="font-bold text-green-400">
            {metrics.fitnessScore[0]?.value}
          </span>
        </p>
      </div>

      {/* Charts */}
      <div className="flex gap-8">
        <ChartLineDots data={metrics.fitnessScore} />
        <ChartBarDefault data={metrics.weight} />
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl">Key Metrics</h2>

        <div className="flex flex-wrap gap-4 mt-4">
          <ChartPieDonutText muscleMass={lastMuscle} bodyFat={lastBodyFat} weight={lastWeight} />
        </div>
      </div>

      {/* Additional Metrics */}
      <div>
        <h2 className="text-xl">Performance Metrics</h2>
        <div className="flex flex-wrap gap-4 mt-4">
          {/* Max Reps */}
          <MetricCard
            title="Push Ups"
            value={metrics.maxReps[0]?.pushUps}
            previousValue={metrics.maxReps[1]?.pushUps}
          />
          <MetricCard
            title="Squats"
            value={metrics.maxReps[0]?.squats}
            previousValue={metrics.maxReps[1]?.squats}
          />
          <MetricCard
            title="Pull Ups"
            value={metrics.maxReps[0]?.pullUps}
            previousValue={metrics.maxReps[1]?.pullUps}
          />

          {/* Running Times (suponemos que menos tiempo es mejor) */}
          <MetricCard
            title="Running Time (min)"
            value={metrics.runningTimes[0]?.value}
            previousValue={metrics.runningTimes[1]?.value}
          />

          {/* Stress Trend (menos estrés es mejor, invertimos el signo) */}
          <MetricCard
            title="Stress Level"
            value={metrics.stressTrend[0]?.value}
            previousValue={metrics.stressTrend[1]?.value}
          />
        </div>
      </div>

      {/* Daily Tips */}
      <div>
        <h2 className="text-xl">Daily-Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-4">
          {dailyTips.map((tip) => (
            <TipCard
              key={tip.id}
              id={tip.id}
              title={tip.title}
              description={tip.description}
              imageUrl={tip.imageUrl}
            />
          ))}
        </div>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default DashboardPage;
