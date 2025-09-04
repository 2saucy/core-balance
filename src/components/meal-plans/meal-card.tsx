import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, RefreshCcw, Lock, LockOpen, Loader2 } from "lucide-react";
import { Meal, MealItem } from "@/lib/types/meal-types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";


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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible className="bg-secondary rounded-2xl" open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="p-4 text-muted-foreground hover:text-primary hover:underline underline-offset-4" asChild>
        <div className="cursor-pointer flex items-center justify-between">
          <p>{meal.mealName}</p>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary cursor-pointer"
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Regenerate meal</p>
              </TooltipContent>
            </Tooltip>
            {isOpen ? (
              <Tooltip>
                <TooltipTrigger>
                  <ChevronUp className="h-4 w-4 mr-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close Collapsible</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <ChevronDown className="h-4 w-4  mr-2" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open Collapsible</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="p-4">
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
      </CollapsibleContent>
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
    <Card className="p-4 gap-2">
      <CardHeader className="p-0">
        <CardTitle className="font-normal">{item.food}</CardTitle>
        <CardAction>
          <Button variant="ghost" size={"icon"} className={cn("cursor-pointer aspect-square rounded-full text-muted-foreground", isLocked && "bg-red-500/20 text-red-700 dark:text-red-400")} onClick={onToggleLock} >
            {isLocked ? (
              <Tooltip>
                <TooltipTrigger>
                  <Lock strokeWidth={1.5} className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Unlock</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger>
                  <LockOpen strokeWidth={1.5} className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lock</p>
                </TooltipContent>
              </Tooltip>
            )}
          </Button>
        </CardAction>
      </CardHeader>
      <CardFooter className="p-0 space-x-2">
        <Badge variant="outline">{item.calories} kcal Calories</Badge>
        <Badge variant="outline" className="text-red-600">{item.protein}g Protein</Badge>
        <Badge variant="outline" className="text-blue-600">{item.carbs}g Carbs</Badge>
        <Badge variant="outline" className="text-green-600">{item.fats}g Fats</Badge>
      </CardFooter>
    </Card>
  );
}