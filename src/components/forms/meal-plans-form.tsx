"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, ClipboardPaste } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MealPlansFormSchema } from "@/lib/validation/meal-plans-schema";
import { MealPlansFormValues } from "@/lib/types/meal-types";

const dietOptions = [
    { label: "Vegan", value: "vegan" },
    { label: "Vegetarian", value: "vegetarian" },
    { label: "Keto", value: "keto" },
];
const planDurationOptions = [
    { label: "1 Day", value: "1" },
    { label: "3 Days", value: "3" },
    { label: "7 Days", value: "7" },
    { label: "14 Days", value: "14" },
];
const dailyCostOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
];
export default function MealPlansForm({
    onGeneratePlan,
}: {
    onGeneratePlan: (
        values: z.infer<typeof MealPlansFormSchema>
    ) => void;
}) {
    const form = useForm<MealPlansFormValues>({
        resolver: zodResolver(MealPlansFormSchema),
        defaultValues: {
            // All optional fields must have a default value
            type_of_diet: "",
            plan_duration: "7",
            prefered_foods: "",
            excluded_foods: "",
            allergic_and_intolerances: "",
            daily_cost: "",
            protein: undefined, 
            carbs: undefined,
            fats: undefined,
        },
    });

    function onSubmit(data: z.infer<typeof MealPlansFormSchema>) {
        onGeneratePlan(data);
    }

    const handleImportMacros = () => {
        console.log("Importing macros...");
        toast.info("Importar macros feature is under development.");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Fila 1 */}
                    <FormField
                        control={form.control}
                        name="type_of_diet"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Type of Diet</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? dietOptions.find(
                                                          (option) => option.value === field.value
                                                      )?.label
                                                    : "Select a diet"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search diet..." />
                                            <CommandList>
                                                <CommandEmpty>No diet found.</CommandEmpty>
                                                <CommandGroup>
                                                    {dietOptions.map((option) => (
                                                        <CommandItem
                                                            value={option.label}
                                                            key={option.value}
                                                            onSelect={() => {
                                                                form.setValue("type_of_diet", option.value);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    option.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {option.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="plan_duration"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Plan duration <span className="text-red-500">(disabled)</span>
                                </FormLabel>
                                <Select
                                    disabled
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select the duration of the plan" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {planDurationOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="meals_per_day"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Meals per Day <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Fila 2 */}
                    <FormField
                        control={form.control}
                        name="calorie_target"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Calorie Target <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="protein"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Protein</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="carbs"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Carbs</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Fila 3 */}
                    <FormField
                        control={form.control}
                        name="fats"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fats</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="prefered_foods"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preferred Foods</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Salmon, broccoli, rice" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="excluded_foods"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Excluded Foods</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Pork, dairy products" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Fila 4 */}
                    <FormField
                        control={form.control}
                        name="allergic_and_intolerances"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allergic & Intolerances</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Lactose, gluten, nuts" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="daily_cost"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Daily Cost</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a cost option" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {dailyCostOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-end justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-8"
                            onClick={handleImportMacros}
                        >
                            <ClipboardPaste className="mr-2 h-4 w-4" />
                            Importar macros
                        </Button>
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Generar Plan
                </Button>
            </form>
        </Form>
    );
}