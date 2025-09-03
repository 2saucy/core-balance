// components/meal-plans/saved-plans-manager.tsx
"use client";
import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Icons
import {
  BookOpen,
  Heart,
  Trash2,
  Target,
  Clock,
  Download,
  Star,
} from "lucide-react";
import { useMealPlansStore } from "@/store/meal-plans-store";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";


export function SavedPlansManager() {
  const {
    savedPlans,
    loadMealPlan,
    deleteMealPlan,
    toggleFavorite,
    calculateDailyTotals,
    generateShoppingList,
  } = useMealPlansStore();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const selectedPlan = savedPlans.find(p => p.id === selectedPlanId);
  const favoriteProfiles = savedPlans.filter(p => p.isFavorite);
  const recentProfiles = savedPlans
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleLoadPlan = (planId: string) => {
    loadMealPlan(planId);
    setSelectedPlanId(null);
  };

  const getFirstDayTotals = (plan: any[]) => {
    if (!plan.length) return null;
    return calculateDailyTotals(plan[0].meals);
  };

  if (savedPlans.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No hay planes guardados</h3>
          <p className="text-muted-foreground mb-4">
            Crea tu primer plan de comidas para empezar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Favorites Section */}
      {favoriteProfiles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Planes Favoritos
          </h3>
          <div className="grid gap-3">
            {favoriteProfiles.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onLoad={() => handleLoadPlan(plan.id)}
                onDelete={() => deleteMealPlan(plan.id)}
                onToggleFavorite={() => toggleFavorite(plan.id)}
                onViewDetails={() => setSelectedPlanId(plan.id)}
                firstDayTotals={getFirstDayTotals(plan.plan)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Plans Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Todos los Planes ({savedPlans.length})
        </h3>
        <ScrollArea className="h-[400px]">
          <div className="grid gap-3 pr-4">
            {savedPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onLoad={() => handleLoadPlan(plan.id)}
                onDelete={() => deleteMealPlan(plan.id)}
                onToggleFavorite={() => toggleFavorite(plan.id)}
                onViewDetails={() => setSelectedPlanId(plan.id)}
                firstDayTotals={getFirstDayTotals(plan.plan)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Plan Details Dialog */}
      {selectedPlan && (
        <PlanDetailsDialog
          plan={selectedPlan}
          open={!!selectedPlanId}
          onClose={() => setSelectedPlanId(null)}
          onLoad={() => handleLoadPlan(selectedPlan.id)}
          generateShoppingList={generateShoppingList}
        />
      )}
    </div>
  );
}

interface PlanCardProps {
  plan: any;
  onLoad: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onViewDetails: () => void;
  firstDayTotals: any;
}

function PlanCard({
  plan,
  onLoad,
  onDelete,
  onToggleFavorite,
  onViewDetails,
  firstDayTotals,
}: PlanCardProps) {

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold truncate">{plan.name}</h4>
              {plan.isFavorite && (
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(plan.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </p>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
            >
              {plan.isFavorite ? (
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar plan?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El plan &quot;{plan.name}&quot; será eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Plan Summary */}
        <div className="space-y-2 mb-3">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {plan.plan.length} días
            </Badge>
            {plan.preferences.type_of_diet && (
              <Badge variant="outline" className="text-xs">
                {plan.preferences.type_of_diet}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {plan.preferences.calorie_target} kcal
            </Badge>
          </div>
          
          {firstDayTotals && (
            <div className="text-xs text-muted-foreground">
              P: {firstDayTotals.totalProtein.toFixed(0)}g • 
              C: {firstDayTotals.totalCarbs.toFixed(0)}g • 
              G: {firstDayTotals.totalFats.toFixed(0)}g
            </div>
          )}
        </div>

        <Separator className="my-3" />

        <div className="flex gap-2">
          <Button onClick={onLoad} size="sm" className="flex-1">
            <Download className="h-3 w-3 mr-1" />
            Cargar
          </Button>
          <Button onClick={onViewDetails} variant="outline" size="sm">
            Ver detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface PlanDetailsDialogProps {
  plan: any;
  open: boolean;
  onClose: () => void;
  onLoad: () => void;
  generateShoppingList: (plan?: any[]) => string[];
}

function PlanDetailsDialog({
  plan,
  open,
  onClose,
  onLoad,
  generateShoppingList,
}: PlanDetailsDialogProps) {
  const shoppingList = generateShoppingList(plan.plan);



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {plan.name}
          </DialogTitle>
          <DialogDescription>
            Creado {formatDistanceToNow(new Date(plan.createdAt), {
              addSuffix: true,
              locale: es,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Plan Overview */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Información General</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Duración:</span>
                  <span>{plan.plan.length} días</span>
                </div>
                <div className="flex justify-between">
                  <span>Calorías/día:</span>
                  <span>{plan.preferences.calorie_target} kcal</span>
                </div>
                <div className="flex justify-between">
                  <span>Comidas/día:</span>
                  <span>{plan.preferences.meals_per_day}</span>
                </div>
                {plan.preferences.type_of_diet && (
                  <div className="flex justify-between">
                    <span>Tipo de dieta:</span>
                    <span className="capitalize">{plan.preferences.type_of_diet}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Lista de Compras</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-24">
                  <div className="text-xs space-y-1">
                    {shoppingList.slice(0, 10).map((item, i) => (
                      <div key={i}>• {item}</div>
                    ))}
                    {shoppingList.length > 10 && (
                      <div className="text-muted-foreground">
                        +{shoppingList.length - 10} más...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Plan Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Vista Previa del Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {plan.plan.map((day: any, dayIndex: number) => (
                    <div key={dayIndex} className="text-sm">
                      <h4 className="font-semibold mb-1">{day.day}</h4>
                      <div className="space-y-1 ml-2">
                        {day.meals.map((meal: any, mealIndex: number) => (
                          <div key={mealIndex} className="flex justify-between text-muted-foreground">
                            <span>{meal.mealName}</span>
                            <span>
                              {meal.items.reduce((sum: number, item: any) => sum + item.calories, 0)} kcal
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={() => { onLoad(); onClose(); }}>
              Cargar Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}