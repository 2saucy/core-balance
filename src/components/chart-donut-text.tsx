"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { useTheme } from "next-themes"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartPieBodyCompositionProps {
  muscleMass: number // kg
  bodyFat: number // %
  weight: number // kg
}

export const description = "A donut chart with text (body composition)"

export function ChartPieDonutBodyComposition({
  muscleMass,
  bodyFat,
  weight,
}: ChartPieBodyCompositionProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null

  // Cálculos
  const fatKg = (weight * bodyFat) / 100
  const leanMass = weight - fatKg
  const waterKg = leanMass * 0.6
  const boneOrgansKg = weight - (muscleMass + fatKg + waterKg)

  const totalWeight = weight

  // Colores según el tema
  const colors = theme === "dark"
    ? ["#3b82f6", "#2563eb", "#1d4ed8", "#1e40af"] // azul oscuro
    : ["#fb923c", "#f97316", "#ea580c", "#c2410c"] // naranja

  const chartData = [
    { name: "Músculo", value: muscleMass, fill: colors[0] },
    { name: "Grasa Corporal", value: fatKg, fill: colors[1] },
    { name: "Agua", value: waterKg, fill: colors[2] },
    { name: "Hueso/Órganos", value: boneOrgansKg, fill: colors[3] },
  ]

  const chartConfig = {
    composition: { label: "Composición" },
    Músculo: { label: "Músculo", color: colors[0] },
    "Grasa Corporal": { label: "Grasa Corporal", color: colors[1] },
    Agua: { label: "Agua", color: colors[2] },
    "Hueso/Órganos": { label: "Hueso/Órganos", color: colors[3] },
  } satisfies ChartConfig

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Body Composition</CardTitle>
        <CardDescription>Desglose del peso actual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalWeight.toFixed(1)} kg
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Peso Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total body composition breakdown
        </div>
      </CardFooter>
    </Card>
  )
}
