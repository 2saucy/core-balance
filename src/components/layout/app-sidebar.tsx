import { BicepsFlexed, Calculator, ChartColumn, Dumbbell, Home, Search, Settings, Vegan } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"
import { SettingsDropdown } from "../settings-dropdown"

const items = [
    {
        title: "Home",
        url: "/",
        icon: Home,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: ChartColumn,
    },
    {
        title: "Workout",
        icon: Dumbbell,
        children: [
            {
                title: "Custom Routine Builder",
                url: "/workout/custom-routine-builder"
            },
            {
                title: "Reps Tracker",
                url: "/workout/reps-tracker"
            },
            {
                title: "Platform Workouts",
                url: "/workout/platform-workouts"
            },
            {
                title: "Tutorials",
                url: "/workout/tutorials"
            }

        ],
    },
    {
        title: "Diet",
        icon: Vegan,
        children: [
            { title: "Meal Plans", url: "/diet/meal-plans" },
            { title: "Recipes", url: "/calculators/bodyfat" },
            { title: "Grocery List", url: "/calculators/calories" },
            { title: "Calorie Tracker", url: "/calculators/macro-split" },
        ],
    },
    {
        title: "Calculator Tools",
        icon: Calculator,
        children: [
            { title: "BMI Calculator", url: "/calculators/bmi-calculator" },
            { title: "Body Fat %", url: "/calculators/body-fat-calculator" },
            { title: "Calories", url: "/calculators/calories-calculator" },
            { title: "Macro Split", url: "/calculators/macro-split-calculator" },
            { title: "Ideal Weight", url: "/calculators/ideal-weight-calculator" },
        ],
    },
]


export function AppSidebar() {
    return (
        <Sidebar className="p-2">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <BicepsFlexed />
                    <h1 className="text-xl font-bold">CoreBalance</h1>
                </div>
                <p className="text-sm text-muted-foreground">Your fitness companion</p>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.children ? (
                                        <Collapsible defaultOpen={false} className="group/collapsible">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {item.children.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <a href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </a>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SettingsDropdown />
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}