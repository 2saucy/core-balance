import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, RefreshCcw, Lock, LockOpen, Loader2 } from "lucide-react";
import { Meal, MealItem } from "@/lib/types/meal-types";


interface MealCardProps {
  meal: Meal;
  mealIndex: number;
  dayIndex: number;
  isRegenerating: boolean;
  onRegenerate: () => void;
  onToggleLock: (item: MealItem) => void;
  isItemLocked: (foodName: string) => boolean;
}

export function MealCard({
  meal,
  isRegenerating,
  onRegenerate,
  onToggleLock,
  isItemLocked,
}: MealCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{meal.mealName}</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegenerate();
                  }}
                  disabled={isRegenerating}
                >
                  {isRegenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-4 w-4" />
                  )}
                </Button>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {isRegenerating ? (
              <div className="space-y-2">
                <div className="animate-pulse">
                  <div className="h-12 bg-muted rounded-md mb-2" />
                  <div className="h-12 bg-muted rounded-md" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {meal.items.map((item, itemIndex) => (
                  <FoodItemCard
                    key={itemIndex}
                    item={item}
                    isLocked={isItemLocked(item.food)}
                    onToggleLock={() => onToggleLock(item)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// Componente para elementos de comida individual
interface FoodItemCardProps {
  item: MealItem;
  isLocked: boolean;
  onToggleLock: () => void;
}

function FoodItemCard({ item, isLocked, onToggleLock }: FoodItemCardProps) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{item.food}</h4>
        <Button variant="ghost" size="sm" onClick={onToggleLock}>
          {isLocked ? (
            <Lock className="h-4 w-4 text-primary" />
          ) : (
            <LockOpen className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge variant="outline">{item.calories} kcal</Badge>
        <Badge variant="outline" className="text-red-600">{item.protein}g P</Badge>
        <Badge variant="outline" className="text-blue-600">{item.carbs}g C</Badge>
        <Badge variant="outline" className="text-green-600">{item.fats}g G</Badge>
      </div>
    </Card>
  );
}