// app/meal-plans/page.tsx - Versión simplificada
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, BookOpen, Settings } from "lucide-react";

// Custom components
import { MealCard } from "@/components/meal-plans/meal-card";
import { NutritionSummary } from "@/components/meal-plans/nutrition-summary";
import { ActionButtons } from "@/components/meal-plans/action-buttons";
import MealPlansForm from "@/components/forms/meal-plans-form";
import { SavedPlansManager } from "@/components/saved-plans-manager";
import { MEAL_PLAN_CONSTANTS } from "@/lib/constants";
import { MealPlansFormValues } from "@/lib/types/meal-types";
import { FormatUtils } from "@/lib/utils";
import { useMealPlansStore, useMealPlansUtils } from "@/store/meal-plans-store";


export default function MealPlansPage() {
  // Store state
  const {
    currentPlan,
    loading,
    regeneratingMeal,
    lockedItems,
    lastFormValues,
    generateMealPlan,
    regenerateMeal,
    saveMealPlan,
    toggleLockItem,
    clearLockedItems,
  } = useMealPlansStore();

  // Utils
  const {
    calculateDailyTotals,
    generateShoppingList,
    isItemLocked,
  } = useMealPlansUtils();

  // Local state
  const [activeDay, setActiveDay] = useState<string>("");
  const [showSavedPlans, setShowSavedPlans] = useState(false);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(MEAL_PLAN_CONSTANTS.LOADING_MESSAGES[0]);

  // Effects
  useEffect(() => {
    if (currentPlan?.[0]?.day && !activeDay) {
      setActiveDay(currentPlan[0].day);
    }
  }, [currentPlan, activeDay]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setCurrentLoadingMessage(prev => {
          const currentIndex = MEAL_PLAN_CONSTANTS.LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % MEAL_PLAN_CONSTANTS.LOADING_MESSAGES.length;
          return MEAL_PLAN_CONSTANTS.LOADING_MESSAGES[nextIndex];
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Handlers
  const handleGeneratePlan = async (data: MealPlansFormValues) => {
    try {
      await generateMealPlan(data);
    } catch (error) {
      // Error ya manejado en el store
    }
  };

  const handleRegenerateWithLocked = () => {
    if (lastFormValues) {
      generateMealPlan(lastFormValues, lockedItems);
    }
  };

  const handleCopyShoppingList = async () => {
    if (!currentPlan) return;

    const shoppingList = generateShoppingList();
    const formattedList = FormatUtils.formatShoppingList(shoppingList, {
      dietType: lastFormValues?.type_of_diet,
      calorieTarget: lastFormValues?.calorie_target,
      date: FormatUtils.formatDate(new Date()),
    });

    try {
      await navigator.clipboard.writeText(formattedList);
      toast.success("Lista copiada al portapapeles");
    } catch (err) {
      toast.error("Error al copiar la lista");
    }
  };

  // Derived data
  const currentDayPlan = currentPlan?.find(dayPlan => dayPlan.day === activeDay);
  const currentTotals = currentDayPlan ? calculateDailyTotals(currentDayPlan.meals) : null;
  const shoppingList = generateShoppingList();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Loading Overlay */}
      <LoadingOverlay 
        isLoading={loading} 
        message={currentLoadingMessage} 
      />

      {/* Saved Plans Dialog */}
      <SavedPlansDialog 
        open={showSavedPlans} 
        onOpenChange={setShowSavedPlans} 
      />

      <div className="space-y-8">
        {/* Header */}
        <PageHeader onShowSavedPlans={() => setShowSavedPlans(true)} />

        {/* Form Section */}
        <ConfigurationCard 
          onGeneratePlan={handleGeneratePlan}
          lockedItemsCount={lockedItems.length}
        />

        {/* Main Content */}
        {currentPlan && currentPlan.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Meal Plan Display */}
            <div className="lg:col-span-3">
              <MealPlanTabs
                plan={currentPlan}
                activeDay={activeDay}
                onDayChange={setActiveDay}
                regeneratingMeal={regeneratingMeal}
                onRegenerateMeal={regenerateMeal}
                onToggleLock={toggleLockItem}
                isItemLocked={isItemLocked}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {currentTotals && (
                <NutritionSummary 
                  dayName={activeDay} 
                  totals={currentTotals} 
                />
              )}

              <ActionButtons
                onSavePlan={saveMealPlan}
                onRegenerateWithLocked={handleRegenerateWithLocked}
                onClearLocked={clearLockedItems}
                onCopyShoppingList={handleCopyShoppingList}
                shoppingList={shoppingList}
                lockedItemsCount={lockedItems.length}
                planInfo={{
                  dietType: lastFormValues?.type_of_diet,
                  calorieTarget: lastFormValues?.calorie_target,
                  date: FormatUtils.formatDate(new Date()),
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componentes auxiliares para mejor organización
function LoadingOverlay({ isLoading, message }: { isLoading: boolean; message: string }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-80">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-lg font-medium">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PageHeader({ onShowSavedPlans }: { onShowSavedPlans: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-2">Planes de Comidas</h1>
        <p className="text-muted-foreground">
          Genera planes personalizados según tus necesidades nutricionales
        </p>
      </div>
      <Button 
        variant="outline" 
        onClick={onShowSavedPlans}
        className="flex items-center gap-2"
      >
        <BookOpen className="h-4 w-4" />
        Ver Planes Guardados
      </Button>
    </div>
  );
}

function ConfigurationCard({ 
  onGeneratePlan, 
  lockedItemsCount 
}: { 
  onGeneratePlan: (data: MealPlansFormValues) => void;
  lockedItemsCount: number;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración del Plan
          </CardTitle>
          {lockedItemsCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {lockedItemsCount} elementos bloqueados
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <MealPlansForm onGeneratePlan={onGeneratePlan} />
      </CardContent>
    </Card>
  );
}

function SavedPlansDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Planes Guardados</DialogTitle>
          <DialogDescription>
            Gestiona y carga tus planes de comidas guardados
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto">
          <SavedPlansManager />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MealPlanTabs({
  plan,
  activeDay,
  onDayChange,
  regeneratingMeal,
  onRegenerateMeal,
  onToggleLock,
  isItemLocked,
}: {
  plan: any[];
  activeDay: string;
  onDayChange: (day: string) => void;
  regeneratingMeal: string | null;
  onRegenerateMeal: (dayIndex: number, mealIndex: number, meal: any) => void;
  onToggleLock: (item: any) => void;
  isItemLocked: (foodName: string) => boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu Plan de Comidas</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeDay} onValueChange={onDayChange}>
          <TabsList className="grid w-full grid-cols-7">
            {plan.map((dayPlan) => (
              <TabsTrigger key={dayPlan.day} value={dayPlan.day}>
                {dayPlan.day}
              </TabsTrigger>
            ))}
          </TabsList>

          {plan.map((dayPlan) => (
            <TabsContent key={dayPlan.day} value={dayPlan.day} className="space-y-4 mt-6">
              {dayPlan.meals.map((meal: any, mealIndex: number) => {
                const dayIndex = plan.findIndex(d => d.day === dayPlan.day);
                const mealId = `${dayPlan.day}-${meal.mealName}-${mealIndex}`;
                const isRegenerating = regeneratingMeal === mealId;

                return (
                  <MealCard
                    key={mealId}
                    meal={meal}
                    mealIndex={mealIndex}
                    dayIndex={dayIndex}
                    isRegenerating={isRegenerating}
                    onRegenerate={() => onRegenerateMeal(dayIndex, mealIndex, meal)}
                    onToggleLock={onToggleLock}
                    isItemLocked={isItemLocked}
                  />
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}