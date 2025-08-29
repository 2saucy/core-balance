"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings, Trash2, Moon, Sun, Monitor } from "lucide-react";

type Units = "metric" | "imperial";

export function SettingsDropdown() {
  const { theme, setTheme } = useTheme();
  const [units, setUnits] = useState<Units>("metric");

  // Carga las unidades guardadas al iniciar
  useEffect(() => {
    try {
      const savedUnits = localStorage.getItem("user_units");
      if (savedUnits) {
        setUnits(savedUnits as Units);
      }
    } catch (error) {
      console.error("Failed to load units:", error);
    }
  }, []);

  // Guarda las unidades en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("user_units", units);
    } catch (error) {
      console.error("Failed to save units:", error);
    }
  }, [units]);

  // Maneja el borrado de historial
  const handleClearHistory = () => {
    try {
      localStorage.removeItem("bmi_history");
      localStorage.removeItem("body_fat_history");
      localStorage.removeItem("ideal_weight_history");
      localStorage.removeItem("ms_calories_history");
      toast.success("All calculation history has been cleared.");
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast.error("Failed to clear history.");
    }
  };

  const getThemeIcon = (currentTheme: string) => {
    switch (currentTheme) {
      case "light":
        return <Sun className="mr-2 h-4 w-4" />;
      case "dark":
        return <Moon className="mr-2 h-4 w-4" />;
      default:
        return <Monitor className="mr-2 h-4 w-4" />;
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full p-0 flex justify-start font-normal" aria-label="Settings">
          <Settings className="h-5 w-5" /> Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right" align="start">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Sección de Apariencia (Tema) como un Submenú */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {getThemeIcon(theme as string)}
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value)}>
                <DropdownMenuRadioItem value="light">
                  <Sun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <Monitor className="mr-2 h-4 w-4" /> System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />

        {/* Sección de Unidades */}
        <DropdownMenuLabel>Units</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={units} onValueChange={(value: string) => setUnits(value as Units)}>
          <DropdownMenuRadioItem value="metric">Metric (kg, cm)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="imperial">Imperial (lbs, in)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />

        {/* Sección de Gestión de Datos */}
        <DropdownMenuLabel>Data</DropdownMenuLabel>
        <DropdownMenuItem onSelect={handleClearHistory} className="text-red-500 hover:text-red-600 focus:text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear History
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}