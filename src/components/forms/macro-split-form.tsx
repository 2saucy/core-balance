"use client"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { macroSplitFormSchema, macroSplitFormValues } from "@/lib/validation/macro-split-schema"
import { MacroSplitFormProps } from "@/lib/types/macro-split.types"

// ---------------- CALC FUNCTIONS ----------------
function calculateBMR(values: macroSplitFormValues) {
    const { units, gender, age, height, weight } = values;

    const weightKg = units === "imperial" ? weight * 0.453592 : weight;
    const heightCm = units === "imperial" ? height * 2.54 : height;

    // Mifflin-St Jeor Equation
    if (gender === "male") {
        return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else if (gender === "female") {
        return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
    // Fallback for "other" or undefined gender, using average
    return (10 * weightKg) + (6.25 * heightCm) - (5 * age);
}

function calculateTDEE(bmr: number, activityLevel: macroSplitFormValues["activity_level"]) {
    const activityMultipliers: Record<macroSplitFormValues["activity_level"], number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9,
    };
    return bmr * activityMultipliers[activityLevel];
}

function calculateCalorieTarget(tdee: number, goal: macroSplitFormValues["goal"]) {
    if (goal === "lose") {
        return tdee - 500;
    } else if (goal === "gain") {
        return tdee + 500;
    }
    return tdee;
}

export default function MacroSplitForm({ onCalculate }: MacroSplitFormProps) {
    const form = useForm<macroSplitFormValues>({
        resolver: zodResolver(macroSplitFormSchema),
        defaultValues: {
            units: "metric",
            gender: "male",
            age: undefined,
            height: undefined,
            weight: undefined,
            activity_level: "sedentary",
            goal: "maintain",
            bodyfat_percentage: undefined,
            diet_preference: "balanced"
        }
    });

    const onSubmit = (values: macroSplitFormValues) => {
        try {
            const bmr = calculateBMR(values);
            const tdee = calculateTDEE(bmr, values.activity_level);
            const calorieTarget = calculateCalorieTarget(tdee, values.goal);

            onCalculate({
                bmr: Math.round(bmr),
                tdee: Math.round(tdee),
                calorieTarget: Math.round(calorieTarget),
                formValues: values,
            });

            toast.success("Calories calculated successfully!");
        } catch (error) {
            toast.error("An error occurred during calculation.");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Gender */}
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="male" /></FormControl>
                                        <FormLabel className="font-normal">Male</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="female" /></FormControl>
                                        <FormLabel className="font-normal">Female</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="other" /></FormControl>
                                        <FormLabel className="font-normal">Other</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Units & Age */}
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="units"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Units</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select units" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                                        <SelectItem value="imperial">Imperial (lbs, in)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Age</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Weight & Height */}
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Weight ({form.getValues("units") === "metric" ? "kg" : "lbs"})</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Height ({form.getValues("units") === "metric" ? "cm" : "in"})</FormLabel>
                                <FormControl><Input type="number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Activity Level */}
                <FormField
                    control={form.control}
                    name="activity_level"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Activity Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select activity level" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                                    <SelectItem value="light">Lightly active (1-3 days/week)</SelectItem>
                                    <SelectItem value="moderate">Moderately active (3-5 days/week)</SelectItem>
                                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                                    <SelectItem value="very_active">Very active (twice a day)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Goal */}
                <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Goal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select your goal" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                                    <SelectItem value="lose">Weight Loss</SelectItem>
                                    <SelectItem value="gain">Weight Gain</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Calculate</Button>
            </form>
        </Form>
    )
}
