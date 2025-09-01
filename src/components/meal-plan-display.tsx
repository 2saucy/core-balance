"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { NotepadText, Download, ChevronDown, ChevronUp, Target, Lock, LockOpen, RefreshCcw, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface MealItem {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Meal {
  mealName: string;
  items: MealItem[];
}

interface DayPlan {
  day: string;
  meals: Meal[];
}

export function MealPlanDisplay({
  mealPlan,
  handleSaveRoutine,
  loading,
  handleRegenerate,
  handleRegenerateMeal,
  regeneratingMeal,
  preferences,
  dietType,
  totalCalories,
}: {
  mealPlan: DayPlan[];
  handleSaveRoutine: () => void;
  loading: boolean;
  handleRegenerate: (lockedItems: MealItem[]) => void;
  handleRegenerateMeal: (dayIndex: number, mealIndex: number, currentMeal: Meal) => void;
  regeneratingMeal: string | null;
  preferences: string;
  dietType: string;
  totalCalories: number;
}) {
  const [isMealOpen, setIsMealOpen] = useState<{ [key: string]: boolean }>({});
  const [lockedItems, setLockedItems] = useState<MealItem[]>([]);
  const [activeDay, setActiveDay] = useState<string>(mealPlan?.[0]?.day);

  const toggleMeal = (mealId: string) => {
    setIsMealOpen((prevState) => ({
      ...prevState,
      [mealId]: !prevState[mealId],
    }));
  };

  const isItemLocked = (foodName: string) => {
    return lockedItems.some((item) => item.food === foodName);
  };

  const toggleLock = (item: MealItem) => {
    if (isItemLocked(item.food)) {
      setLockedItems(lockedItems.filter((i) => i.food !== item.food));
      toast.info(`Unlocked: ${item.food}`);
    } else {
      setLockedItems([...lockedItems, item]);
      toast.info(`Locked: ${item.food}`);
    }
  };

  const calculateDailyTotals = (meals: Meal[]) => {
    return meals.reduce(
      (acc, meal) => {
        meal.items.forEach((item) => {
          acc.totalCalories += item.calories;
          acc.totalProtein += item.protein;
          acc.totalCarbs += item.carbs;
          acc.totalFats += item.fats;
        });
        return acc;
      },
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 }
    );
  };

  const handleRegenerateClick = () => {
    handleRegenerate(lockedItems);
  };

  const generateShoppingList = () => {
    const allFoods = mealPlan.flatMap((day) =>
      day.meals.flatMap((meal) => meal.items.map((item) => item.food))
    );
    const uniqueFoods = [...new Set(allFoods)];
    return uniqueFoods.sort();
  };

  const shoppingList = generateShoppingList();

  const handleCopyToClipboard = async () => {
    const listText = `
    Meal Plan Generated On: ${new Date().toLocaleDateString()}
    - Preferences: ${preferences}
    - Diet Type: ${dietType}
    - Daily Calories: ${totalCalories} kcal
    
    Shopping List:
    ${shoppingList.map(item => `- ${item}`).join('\n')}
    `;
    try {
      await navigator.clipboard.writeText(listText);
      toast.success("Shopping list copied to clipboard.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Failed to copy list. Please try again.");
    }
  };

  if (!mealPlan || mealPlan.length === 0) {
    return null;
  }

  const currentDayPlan = mealPlan.find(dayPlan => dayPlan.day === activeDay);
  const currentTotals = currentDayPlan ? calculateDailyTotals(currentDayPlan.meals) : null;

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      <div className="flex-1 space-y-4">
        <Tabs defaultValue={mealPlan?.[0]?.day} className="w-full" onValueChange={setActiveDay}>
          <TabsList className="grid w-full grid-cols-7">
            {mealPlan.map((dayPlan, index) => (
              <TabsTrigger key={index} value={dayPlan.day}>
                {dayPlan.day}
              </TabsTrigger>
            ))}
          </TabsList>
          {mealPlan.map((dayPlan, index) => (
            <TabsContent key={index} value={dayPlan.day}>
              <div className="space-y-4">
                {dayPlan.meals.map((meal, mealIndex) => {
                  const mealId = `${dayPlan.day}-${meal.mealName}-${mealIndex}`;
                  const isOpen = isMealOpen[mealId];
                  const isLoadingMeal = regeneratingMeal === mealId;
                  return (
                    <Collapsible
                      key={mealId}
                      open={isOpen}
                      onOpenChange={() => toggleMeal(mealId)}
                      className="bg-card text-card-foreground shadow-sm rounded-lg border"
                    >
                      <CollapsibleTrigger className="flex justify-between items-center w-full p-4 font-semibold text-lg">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 opacity-50" />
                          {meal.mealName}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegenerateMeal(index, mealIndex, meal);
                            }}
                            disabled={isLoadingMeal}
                          >
                            {isLoadingMeal ? (
                              <RefreshCcw className="h-4 w-4 animate-spin text-primary" />
                            ) : (
                              <RefreshCcw className="h-4 w-4" />
                            )}
                          </Button>
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="border-t p-4 space-y-3">
                        <ul className="list-none space-y-2">
                          {isLoadingMeal ? (
                            <div className="animate-pulse space-y-2">
                              <div className="h-12 bg-muted/50 rounded-md"></div>
                              <div className="h-12 bg-muted/50 rounded-md"></div>
                            </div>
                          ) : (
                            meal.items.map((item, i) => {
                              const isLocked = isItemLocked(item.food);
                              return (
                                <li key={i} className="flex flex-col p-3 gap-2 rounded-md bg-muted/50">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium text-base">{item.food}</p>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLock(item);
                                      }}
                                    >
                                      {isLocked ? (
                                        <Lock className="h-4 w-4 text-primary" />
                                      ) : (
                                        <LockOpen className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  <div className="space-x-2">
                                    <Badge className="bg-red-600/50 dark:text-red-400 text-red-800">
                                      Protein {item.protein}g
                                    </Badge>
                                    <Badge className="bg-blue-600/50 dark:text-blue-400 text-blue-800">
                                      Carbs {item.carbs}g
                                    </Badge>
                                    <Badge className="bg-green-600/50 dark:text-green-400 text-green-800">
                                      Fat {item.fats}g
                                    </Badge>
                                  </div>
                                </li>
                              );
                            })
                          )}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="w-full md:w-1/4 space-y-4">
        {currentTotals && (
          <Card className="h-fit top-4">
            <CardHeader>
              <CardTitle>{activeDay} Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Calories</p>
                <p className="text-lg font-bold ml-4">
                  {currentTotals.totalCalories.toFixed(0)} kcal
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Protein</p>
                <p className="text-lg font-bold ml-4">
                  {currentTotals.totalProtein.toFixed(1)}g
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Carbs</p>
                <p className="text-lg font-bold ml-4">
                  {currentTotals.totalCarbs.toFixed(1)}g
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Fats</p>
                <p className="text-lg font-bold ml-4">
                  {currentTotals.totalFats.toFixed(1)}g
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          variant="outline"
          onClick={handleSaveRoutine}
          disabled={loading}
          className="w-full"
        >
          <NotepadText className="mr-2 h-4 w-4" />
          Save Meal Plan
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Generate Shopping List
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle>Shopping List</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Ingredient list for your meal plan.
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              <ScrollArea className="h-[300px] w-full p-6 pt-0">
                <div className="p-4 bg-muted/30 rounded-md text-sm text-muted-foreground mb-4">
                  <p className="font-semibold mb-2">Generated On: {new Date().toLocaleDateString()}</p>
                  <p>Preferences: {preferences}</p>
                  <p>Diet Type: {dietType}</p>
                  <p>Daily Calories: {totalCalories} kcal</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Items:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {shoppingList.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </ScrollArea>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyToClipboard}
                      className="absolute top-2 right-2 text-muted-foreground hover:bg-muted"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy shopping list</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="secondary"
          onClick={handleRegenerateClick}
          disabled={loading}
          className="w-full whitespace-nowrap overflow-hidden text-ellipsis"
          title="Regenerate plan with locked foods"
        >
          Regenerate plan with locked foods
        </Button>
      </div>
    </div>
  );
}