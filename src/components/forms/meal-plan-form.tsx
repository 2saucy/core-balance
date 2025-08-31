// components/MealPlanForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Sparkles, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const diets = [
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "keto", label: "Keto" },
  { value: "pescetarian", label: "Pescetarian" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "paleo", label: "Paleo" },
  { value: "lactose-intolerant", label: "Lactose Intolerant" },
  { value: "high-protein", label: "High Protein" },
  { value: "low-carb", label: "Low Carb" },
];

const costOptions = [
  { value: "economic", label: "Economic" },
  { value: "moderate", label: "Moderate" },
  { value: "no-limit", label: "No Limit" },
  { value: "premium", label: "Premium" },
];

export function MealPlanForm({
  calories,
  setCalories,
  dietType,
  setDietType,
  preferredFoods,
  setPreferredFoods,
  excludedFoods,
  setExcludedFoods,
  protein,
  setProtein,
  carbs,
  setCarbs,
  fats,
  setFats,
  cost,
  setCost,
  handleGeneratePlan,
  loading,
}: {
  calories: number | undefined;
  setCalories: (value: number | undefined) => void;
  dietType: string;
  setDietType: (value: string) => void;
  preferredFoods: string;
  setPreferredFoods: (value: string) => void;
  excludedFoods: string;
  setExcludedFoods: (value: string) => void;
  protein: number | undefined;
  setProtein: (value: number | undefined) => void;
  carbs: number | undefined;
  setCarbs: (value: number | undefined) => void;
  fats: number | undefined;
  setFats: (value: number | undefined) => void;
  cost: string;
  setCost: (value: string) => void;
  handleGeneratePlan: () => void;
  loading: boolean;
}) {
  const [openDiet, setOpenDiet] = useState(false);
  const [openCost, setOpenCost] = useState(false);

  return (
    <div className="w-full space-y-4 p-6 border rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Calories Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="calories" className="text-sm font-medium">Calories (kcal)</Label>
          <Input
            id="calories"
            type="number"
            placeholder="Ex: 2000"
            value={calories}
            onChange={(e) => setCalories(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </div>

        {/* Diet Type Combobox */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="diet-type" className="text-sm font-medium">Diet Type</Label>
          <Popover open={openDiet} onOpenChange={setOpenDiet}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openDiet}
                className="justify-between"
              >
                {dietType || "Select a diet..."}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
              <Command>
                <CommandInput
                  placeholder="Search a diet..."
                  value={dietType}
                  onValueChange={setDietType}
                />
                <CommandEmpty>No diet found.</CommandEmpty>
                <CommandGroup>
                  {diets.map((diet) => (
                    <CommandItem
                      key={diet.value}
                      onSelect={() => {
                        setDietType(diet.label);
                        setOpenDiet(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          dietType === diet.label ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {diet.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Cost Combobox */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="cost-range" className="text-sm font-medium">Daily Cost</Label>
          <Popover open={openCost} onOpenChange={setOpenCost}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCost}
                className="justify-between"
              >
                {cost || "Select a cost option..."}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
              <Command>
                <CommandInput
                  placeholder="Search a cost option..."
                  value={cost}
                  onValueChange={setCost}
                />
                <CommandEmpty>No cost option found.</CommandEmpty>
                <CommandGroup>
                  {costOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        setCost(option.label);
                        setOpenCost(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          cost === option.label ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Preferred Foods Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="preferred-foods" className="text-sm font-medium">Preferred Foods</Label>
          <Input
            id="preferred-foods"
            placeholder="Ex: Salmon, broccoli, rice"
            value={preferredFoods}
            onChange={(e) => setPreferredFoods(e.target.value)}
          />
        </div>

        {/* Excluded Foods Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="excluded-foods" className="text-sm font-medium">Foods to Exclude</Label>
          <Input
            id="excluded-foods"
            placeholder="Ex: Pork, dairy products"
            value={excludedFoods}
            onChange={(e) => setExcludedFoods(e.target.value)}
          />
        </div>

        {/* Protein Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="protein" className="text-sm font-medium">Protein (g)</Label>
          <Input
            id="protein"
            type="number"
            placeholder="Ex: 150"
            value={protein}
            onChange={(e) => setProtein(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </div>

        {/* Carbs Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="carbs" className="text-sm font-medium">Carbs (g)</Label>
          <Input
            id="carbs"
            type="number"
            placeholder="Ex: 200"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </div>

        {/* Fats Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="fats" className="text-sm font-medium">Fats (g)</Label>
          <Input
            id="fats"
            type="number"
            placeholder="Ex: 60"
            value={fats}
            onChange={(e) => setFats(e.target.value === "" ? undefined : Number(e.target.value))}
          />
        </div>
      </div>
      <Button onClick={handleGeneratePlan} disabled={loading || !calories} className="w-full mt-4">
        <Sparkles className="mr-2 h-4 w-4" />
        Generate with AI
      </Button>
    </div>
  );
}