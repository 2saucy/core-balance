// ms-and-calories-form.tsx

"use client"
import { toast } from "sonner"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { calculateBMR, calculateCalorieTarget, calculateTDEE } from "@/lib/calculations/ms-and-calories"
import { MSAndCaloriesFormProps, MSAndCaloriesFormValues } from "@/lib/types/ms-and-calories-types"
import { MSAndCaloriesFormSchema } from "@/lib/validation/ms-and-calories-schema"
import { useUnits } from "@/hooks/use-units"


export default function MSAndCaloriesForm({ onCalculate }: MSAndCaloriesFormProps) {
    const units = useUnits(); // Llama al hook
    const form = useForm<MSAndCaloriesFormValues>({
        resolver: zodResolver(MSAndCaloriesFormSchema),
        defaultValues: {
            gender: "male",
            age: undefined,
            height: undefined,
            weight: undefined,
            activity_level: "sedentary",
            goal: "maintain",
            bodyfat_percentage: undefined,
            diet_preference: undefined
        },
    });

    const onSubmit: SubmitHandler<MSAndCaloriesFormValues> = (values) => {
        try {
            const results = {
                ...values,
                units
            };

            const bmr = calculateBMR(results);
            const tdee = calculateTDEE(bmr, values.activity_level);
            const calorieTarget = calculateCalorieTarget(tdee, values.goal);

            // Agrega `formValues` al objeto para corregir el error de tipo.
            onCalculate({
                bmr,
                tdee,
                calorieTarget,
                formValues: values,
            });

            toast.success("Calculations successful!");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during calculation.");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 h-full">
                <div className="space-y-6">
                    {/* Gender */}
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl><RadioGroupItem value="male" /></FormControl>
                                            <FormLabel className="font-normal">Male</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl><RadioGroupItem value="female" /></FormControl>
                                            <FormLabel className="font-normal">Female</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Combined inputs for age, height, and weight */}
                    <div className="flex gap-4">
                        {/* Age */}
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem className="w-1/3">
                                    <FormLabel>Age</FormLabel>
                                    <FormControl><Input type="number" step="1" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Height */}
                        <FormField
                            control={form.control}
                            name="height"
                            render={({ field }) => (
                                <FormItem className="w-1/3">
                                    <FormLabel>{units === 'metric' ? 'Height (cm)' : 'Height (in)'}</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Weight */}
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-1/3">
                                    <FormLabel>{units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} /></FormControl>
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
                                        <SelectTrigger><SelectValue placeholder="Select your activity level" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {/* Cambia los valores para que coincidan con el esquema */}
                                        <SelectItem value="sedentary">Sedentary (no exercise)</SelectItem>
                                        <SelectItem value="light">Lightly Active (1-3 days a week)</SelectItem>
                                        <SelectItem value="moderate">Moderately Active (3-5 days a week)</SelectItem>
                                        <SelectItem value="active">Very Active (6-7 days a week)</SelectItem>
                                        <SelectItem value="very_active">Extra Active (twice a day)</SelectItem>
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
                </div>

                <Button className="mt-auto" type="submit">Calculate</Button>
            </form>
        </Form>
    )
}