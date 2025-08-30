"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Dumbbell, Calendar, Target, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAnalytics } from "@/hooks/use-analytics";

const AnalyticsPage = () => {
  const {
    isLoading,
    overviewStats,
    calculatorStats,
    workoutStats,
    progressData,
    recentActivity
  } = useAnalytics();

  if (isLoading) {
    return (
      <div className="px-[15%] py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[15%] py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your fitness journey with comprehensive insights and progress metrics.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="gap-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Calculations</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{overviewStats.totalCalculations}</div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Across all calculators
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routines</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.activeRoutines}</div>
            <p className="text-xs text-muted-foreground">
              Saved workout routines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.workoutSessions}</div>
            <p className="text-xs text-muted-foreground">
              Total logged sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.daysActive}</div>
            <p className="text-xs text-muted-foreground">
              Unique activity days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          <TabsTrigger value="calculators">Calculator Stats</TabsTrigger>
          <TabsTrigger value="workouts">Workout Analysis</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BMI Progress */}
            {progressData.bmi.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>BMI Progress</CardTitle>
                  <CardDescription>Your BMI changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={progressData.bmi}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Body Fat Progress */}
            {progressData.bodyFat.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Body Fat Progress</CardTitle>
                  <CardDescription>Your body fat percentage changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={progressData.bodyFat}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Calorie Target Progress */}
            {progressData.calories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Calorie Targets</CardTitle>
                  <CardDescription>Your daily calorie targets over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={progressData.calories}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Weight Progress */}
            {progressData.weight.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Weight Progress</CardTitle>
                  <CardDescription>Your weight changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={progressData.weight}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#ff7c7c" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Calculator Stats Tab */}
        <TabsContent value="calculators" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(calculatorStats).map(([calculator, stats]) => (
              <Card key={calculator}>
                <CardHeader>
                  <CardTitle className="capitalize">{calculator.replace('_', ' ')} Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Calculations:</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Used:</span>
                    <span className="font-semibold">{stats.lastUsed || "Never"}</span>
                  </div>
                  {stats.latestValue && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Latest Value:</span>
                      <Badge variant="outline">{stats.latestValue}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Workout Analysis Tab */}
        <TabsContent value="workouts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exercise Volume Chart */}
            {workoutStats.exerciseVolume.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Exercise Volume</CardTitle>
                  <CardDescription>Total volume by exercise</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={workoutStats.exerciseVolume}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="exercise" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="volume" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Workout Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Workout Statistics</CardTitle>
                <CardDescription>Your training overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Routines:</span>
                  <Badge>{workoutStats.totalRoutines}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Routine:</span>
                  <Badge variant="outline">{workoutStats.currentRoutine || "None"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Most Trained Exercise:</span>
                  <Badge variant="secondary">{workoutStats.mostTrainedExercise || "None"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Volume (kg):</span>
                  <Badge>{workoutStats.totalVolume}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest fitness activities</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {activity.type === 'calculation' && <Calculator className="h-4 w-4" />}
                        {activity.type === 'workout' && <Dumbbell className="h-4 w-4" />}
                        {activity.type === 'routine' && <Target className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No recent activity found. Start using the calculators and workout features!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsPage;