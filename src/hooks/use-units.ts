// use-units.ts
import { useState, useEffect } from "react";

type Units = "metric" | "imperial";

export function useUnits() {
  const [units, setUnits] = useState<Units>("metric");

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

  return units;
}