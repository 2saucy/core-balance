import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateCalories,
  calculateMacroSplit,
} from '../ms-and-calories';

describe('BMR, TDEE, and Calorie Calculations', () => {
  describe('calculateBMR', () => {
    test('should calculate BMR for a male in metric units', () => {
      const values = { units: 'metric', gender: 'male', age: 30, height: 180, weight: 80, activity_level: 'moderate', goal: 'maintain', diet_preference: 'balanced' };
      const result = calculateBMR(values);
      expect(result).toBeCloseTo(1780, 0); 
    });

    test('should calculate BMR for a female in imperial units', () => {
      const values = { units: 'imperial', gender: 'female', age: 25, height: 65, weight: 140, activity_level: 'light', goal: 'maintain', diet_preference: 'balanced' };
      const result = calculateBMR(values);
      expect(result).toBeCloseTo(1380.90, 2); 
    });

    // Nuevas pruebas para BMR
    test('should calculate BMR for a sedentary female in metric units', () => {
        const values = { units: 'metric', gender: 'female', age: 35, height: 165, weight: 60, activity_level: 'sedentary', goal: 'maintain', diet_preference: 'balanced' };
        const result = calculateBMR(values);
        expect(result).toBeCloseTo(1295, 0); 
    });

    test('should calculate BMR for a very active male in imperial units', () => {
        const values = { units: 'imperial', gender: 'male', age: 40, height: 72, weight: 190, activity_level: 'very_active', goal: 'maintain', diet_preference: 'balanced' };
        const result = calculateBMR(values);
        expect(result).toBeCloseTo(1809.82, 2);
    });
  });

  describe('calculateTDEE', () => {
    test('should calculate TDEE correctly', () => {
      const bmr = 1780;
      const activity_level = 'moderate';
      const result = calculateTDEE(bmr, activity_level);
      expect(result).toBeCloseTo(2759, 2);
    });

    // Nuevas pruebas para TDEE
    test('should calculate TDEE for a sedentary individual', () => {
        const bmr = 1500;
        const activity_level = 'sedentary';
        const result = calculateTDEE(bmr, activity_level);
        expect(result).toBeCloseTo(1800, 2);
    });

    test('should calculate TDEE for a very active individual', () => {
        const bmr = 2000;
        const activity_level = 'very_active';
        const result = calculateTDEE(bmr, activity_level);
        expect(result).toBeCloseTo(3800, 2);
    });
  });

  describe('calculateCalorieTarget', () => {
    test('should calculate calorie target for weight loss', () => {
      const tdee = 2759;
      const goal = 'lose';
      const result = calculateCalorieTarget(tdee, goal);
      expect(result).toBe(2259);
    });

    // Nuevas pruebas para el objetivo calórico
    test('should calculate calorie target for weight gain from a BMR and moderate activity', () => {
        const values = { units: 'metric', gender: 'male', age: 30, height: 180, weight: 80, activity_level: 'moderate', goal: 'gain', diet_preference: 'balanced' };
        const result = calculateCalories(values);
        expect(result.calorieTarget).toBeCloseTo(3259, 0);
    });
    
    test('should calculate calorie target for weight loss from a BMR and light activity', () => {
        const values = { units: 'imperial', gender: 'female', age: 25, height: 65, weight: 140, activity_level: 'light', goal: 'lose', diet_preference: 'balanced' };
        const result = calculateCalories(values);
        expect(result.calorieTarget).toBeCloseTo(1399, 0); 
    });
  });

  describe('calculateCalories', () => {
    test('should perform all calculations for a male gaining weight', () => {
      const values = { units: 'metric', gender: 'male', age: 30, height: 180, weight: 80, activity_level: 'moderate', goal: 'gain', diet_preference: 'balanced' };
      const result = calculateCalories(values);
      expect(result.bmr).toBeCloseTo(1780, 0); 
      expect(result.tdee).toBeCloseTo(2759, 0);
      expect(result.calorieTarget).toBeCloseTo(3259, 0);
    });

    // Prueba de integración de todos los cálculos
    test('should perform all calculations for a female losing weight', () => {
        const values = { units: 'metric', gender: 'female', age: 25, height: 165, weight: 70, activity_level: 'light', goal: 'lose', diet_preference: 'low_carb' };
        const result = calculateCalories(values);
        expect(result.bmr).toBeCloseTo(1445, 0);
        expect(result.tdee).toBeCloseTo(1987, 0);
        expect(result.calorieTarget).toBeCloseTo(1487, 0);
    });
  });

  describe('calculateMacroSplit', () => {
    test('should calculate macro split for a high protein diet', () => {
      const calories = 2500;
      const dietPreference = 'high_protein';
      const result = calculateMacroSplit(calories, dietPreference);
      expect(result.protein).toBe(219);
      expect(result.fat).toBe(69);
      expect(result.carbs).toBe(250);
    });

    // Nuevas pruebas para la distribución de macronutrientes
    test('should calculate macro split for a low carb diet', () => {
        const calories = 2000;
        const dietPreference = 'low_carb';
        const result = calculateMacroSplit(calories, dietPreference);
        expect(result.protein).toBe(150);
        expect(result.fat).toBe(100);
        expect(result.carbs).toBe(125);
    });

    test('should calculate macro split for a high carb diet', () => {
        const calories = 3000;
        const dietPreference = 'high_carb';
        const result = calculateMacroSplit(calories, dietPreference);
        expect(result.protein).toBe(113);
        expect(result.fat).toBe(67);
        expect(result.carbs).toBe(488);
    });
    
    test('should calculate macro split for a balanced diet', () => {
        const calories = 2200;
        const dietPreference = 'balanced';
        const result = calculateMacroSplit(calories, dietPreference);
        expect(result.protein).toBe(165);
        expect(result.fat).toBe(61);
        expect(result.carbs).toBe(248);
    });
  });
});