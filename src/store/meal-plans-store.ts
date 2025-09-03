// hooks/use-meal-plans.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { DayPlan, MealPlansFormValues, MealItem, SavedMealPlan, Meal, MealPlanAPIRequest, NutritionalTotals, NutritionalInsights } from '@/lib/types/meal-types';


// Estado separado en slices más pequeños
interface MealPlansState {
  // Plan actual
  currentPlan: DayPlan[] | null;
  lastFormValues: MealPlansFormValues | null;
  
  // Items bloqueados
  lockedItems: MealItem[];
  
  // Planes guardados
  savedPlans: SavedMealPlan[];
  
  // Estados de carga
  loading: boolean;
  regeneratingMeal: string | null;
}

interface MealPlansActions {
  // Generación de planes
  generateMealPlan: (formData: MealPlansFormValues, locked?: MealItem[]) => Promise<void>;
  regenerateMeal: (dayIndex: number, mealIndex: number, meal: Meal) => Promise<void>;
  
  // Gestión de planes guardados
  saveMealPlan: (name: string, tags?: string[]) => void;
  loadMealPlan: (planId: string) => void;
  deleteMealPlan: (planId: string) => void;
  toggleFavorite: (planId: string) => void;
  
  // Items bloqueados
  toggleLockItem: (item: MealItem) => void;
  clearLockedItems: () => void;
  
  // Reset
  reset: () => void;
}

// Hook principal
export const useMealPlansStore = create<MealPlansState & MealPlansActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        currentPlan: null,
        lastFormValues: null,
        lockedItems: [],
        savedPlans: [],
        loading: false,
        regeneratingMeal: null,

        // Acciones principales
        generateMealPlan: async (formData, lockedItems = []) => {
          set({ loading: true, lastFormValues: formData });
          
          try {
            const requestData: MealPlanAPIRequest = {
              ...formData,
              locked_items: lockedItems.length > 0 ? lockedItems : get().lockedItems
            };

            const response = await fetch('/api/generate-meal-plan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestData),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Error generating meal plan');
            }

            const { mealPlan } = await response.json();
            set({ currentPlan: mealPlan });
            toast.success('¡Plan generado exitosamente!');

          } catch (error: any) {
            toast.error(error.message);
            throw error;
          } finally {
            set({ loading: false });
          }
        },

        regenerateMeal: async (dayIndex, mealIndex, meal) => {
          const { currentPlan, lastFormValues } = get();
          if (!currentPlan || !lastFormValues) return;

          const mealId = `${currentPlan[dayIndex]?.day}-${meal.mealName}-${mealIndex}`;
          set({ regeneratingMeal: mealId });

          try {
            const requestData: MealPlanAPIRequest = {
              ...lastFormValues,
              meal_to_regenerate: {
                day_index: dayIndex,
                meal_index: mealIndex,
                current_meal: meal
              },
              existing_meal_plan: currentPlan
            };

            const response = await fetch('/api/generate-meal-plan', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestData),
            });

            if (!response.ok) throw new Error('Error regenerating meal');

            const { mealPlan } = await response.json();
            set({ currentPlan: mealPlan });
            toast.success('¡Comida regenerada!');

          } catch (error) {
            toast.error('Error al regenerar la comida');
          } finally {
            set({ regeneratingMeal: null });
          }
        },

        saveMealPlan: (name, tags = []) => {
          const { currentPlan, lastFormValues, savedPlans } = get();
          
          if (!currentPlan || !lastFormValues) {
            toast.error('No hay plan para guardar');
            return;
          }

          const newPlan: SavedMealPlan = {
            id: crypto.randomUUID(),
            name: name.trim() || `Plan ${new Date().toLocaleDateString()}`,
            plan: currentPlan,
            preferences: lastFormValues,
            createdAt: new Date().toISOString(),
            isFavorite: false,
            tags
          };

          set({ savedPlans: [newPlan, ...savedPlans] });
          toast.success('¡Plan guardado!');
        },

        loadMealPlan: (planId) => {
          const plan = get().savedPlans.find(p => p.id === planId);
          if (plan) {
            set({ 
              currentPlan: plan.plan, 
              lastFormValues: plan.preferences 
            });
            toast.success(`Plan "${plan.name}" cargado`);
          }
        },

        deleteMealPlan: (planId) => {
          set(state => ({ 
            savedPlans: state.savedPlans.filter(p => p.id !== planId) 
          }));
          toast.success('Plan eliminado');
        },

        toggleFavorite: (planId) => {
          set(state => ({
            savedPlans: state.savedPlans.map(plan =>
              plan.id === planId ? { ...plan, isFavorite: !plan.isFavorite } : plan
            )
          }));
        },

        toggleLockItem: (item) => {
          const { lockedItems } = get();
          const isLocked = lockedItems.some(i => i.food === item.food);
          
          if (isLocked) {
            set({ lockedItems: lockedItems.filter(i => i.food !== item.food) });
            toast.info(`Desbloqueado: ${item.food}`);
          } else {
            set({ lockedItems: [...lockedItems, item] });
            toast.info(`Bloqueado: ${item.food}`);
          }
        },

        clearLockedItems: () => {
          set({ lockedItems: [] });
          toast.info('Elementos desbloqueados');
        },

        reset: () => {
          set({
            currentPlan: null,
            lastFormValues: null,
            lockedItems: [],
            loading: false,
            regeneratingMeal: null,
          });
        },
      }),
      {
        name: 'meal-plans-storage',
        partialize: (state) => ({
          savedPlans: state.savedPlans,
          currentPlan: state.currentPlan,
          lastFormValues: state.lastFormValues,
        })
      }
    )
  )
);

// Hooks de utilidad separados
export const useMealPlansUtils = () => {
  const currentPlan = useMealPlansStore(state => state.currentPlan);
  const lockedItems = useMealPlansStore(state => state.lockedItems);

  const calculateDailyTotals = (meals: Meal[]): NutritionalTotals => {
    return meals.reduce(
      (acc, meal) => {
        meal.items.forEach(item => {
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

  const generateShoppingList = (plan?: DayPlan[]): string[] => {
    const targetPlan = plan || currentPlan;
    if (!targetPlan) return [];
    
    const allFoods = targetPlan.flatMap(day =>
      day.meals.flatMap(meal => 
        meal.items.map(item => item.food)
      )
    );
    return [...new Set(allFoods)].sort();
  };

  const getNutritionalInsights = (plan?: DayPlan[]): NutritionalInsights | null => {
    const targetPlan = plan || currentPlan;
    if (!targetPlan?.length) return null;

    const dailyTotals = targetPlan.map(day => calculateDailyTotals(day.meals));
    const avgDaily = dailyTotals.reduce((acc, day) => ({
      totalCalories: acc.totalCalories + day.totalCalories / targetPlan.length,
      totalProtein: acc.totalProtein + day.totalProtein / targetPlan.length,
      totalCarbs: acc.totalCarbs + day.totalCarbs / targetPlan.length,
      totalFats: acc.totalFats + day.totalFats / targetPlan.length,
    }), { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 });

    return {
      dailyTotals,
      avgDaily,
      proteinPercent: (avgDaily.totalProtein * 4 / avgDaily.totalCalories) * 100,
      carbsPercent: (avgDaily.totalCarbs * 4 / avgDaily.totalCalories) * 100,
      fatsPercent: (avgDaily.totalFats * 9 / avgDaily.totalCalories) * 100,
    };
  };

  const isItemLocked = (foodName: string): boolean => {
    return lockedItems.some(item => item.food === foodName);
  };

  return {
    calculateDailyTotals,
    generateShoppingList,
    getNutritionalInsights,
    isItemLocked,
  };
};