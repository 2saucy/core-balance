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

export default function MSAndCaloriesForm({ onCalculate }: MSAndCaloriesFormProps) {
    const form = useForm<MSAndCaloriesFormValues>({
        resolver: zodResolver(MSAndCaloriesFormSchema),
        defaultValues: {
            units: "metric",
            gender: "male",
            age: undefined,
            height: undefined,
            weight: undefined,
            activity_level: "sedentary",
            goal: "maintain"
        },
    })

    const onSubmit = (values: MSAndCaloriesFormValues) => {
        try {
            const results = calculateBMR(values);
            const tdee = calculateTDEE(results, values.activity_level);
            const calorieTarget = calculateCalorieTarget(tdee, values.goal);

            onCalculate({
                bmr: results,
                tdee: tdee,
                calorieTarget: calorieTarget,
                formValues: values
            });

            toast.success("Calculation done!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to calculate.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 h-full">
                <div className="space-y-6">
                    {/* Units */}
                    <FormField
                        control={form.control}
                        name="units"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Units</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                                        <SelectItem value="imperial">Imperial (in, lbs)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                    <FormLabel>Height</FormLabel>
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
                                    <FormLabel>Weight</FormLabel>
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
                                        <SelectItem value="sedentary">Sedentary (no exercise)</SelectItem>
                                        <SelectItem value="lightly_active">Lightly Active (1-3 days a week)</SelectItem>
                                        <SelectItem value="moderately_active">Moderately Active (3-5 days a week)</SelectItem>
                                        <SelectItem value="very_active">Very Active (6-7 days a week)</SelectItem>
                                        <SelectItem value="extra_active">Extra Active (twice a day)</SelectItem>
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