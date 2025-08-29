import { calculateBodyFat } from '../body-fat';

describe('calculateBodyFat', () => {
  // Pruebas existentes...

  // --- Casos de Prueba Corregidos ---
  describe('Additional Male Body Fat Calculations', () => {
    test('should calculate body fat for a tall male in metric units', () => {
      const values = {
        gender: 'male',
        units: 'metric',
        height: 195,
        neck: 42,
        waist: 95,
        weight: 90,
      };
      const result = calculateBodyFat(values);
      expect(result.bodyFatPercentage).toBeCloseTo(18.13, 2);
    });

    test('should calculate body fat for a male with high waist-to-neck ratio in imperial units', () => {
      const values = {
        gender: 'male',
        units: 'imperial',
        height: 68,
        neck: 15,
        waist: 40,
        weight: 190,
      };
      const result = calculateBodyFat(values);
      expect(result.bodyFatPercentage).toBeCloseTo(28.59, 2);
    });

    test('should handle a male with a very low body fat percentage', () => {
      const values = {
        gender: 'male',
        units: 'metric',
        height: 175,
        neck: 43,
        waist: 75,
        weight: 70,
      };
      const result = calculateBodyFat(values);
      expect(result.bodyFatPercentage).toBeCloseTo(3.32, 2);
    });
  });

  describe('Additional Female Body Fat Calculations', () => {
    test('should calculate body fat for a female with average build in metric units', () => {
      const values = {
        gender: 'female',
        units: 'metric',
        height: 170,
        neck: 34,
        waist: 80,
        hips: 100,
        weight: 65,
      };
      const result = calculateBodyFat(values);
      expect(result.bodyFatPercentage).toBeCloseTo(30.07, 2);
    });

    test('should calculate body fat for a petite female in imperial units', () => {
      const values = {
        gender: 'female',
        units: 'imperial',
        height: 62,
        neck: 11,
        waist: 28,
        hips: 34,
        weight: 110,
      };
      const result = calculateBodyFat(values);
      expect(result.bodyFatPercentage).toBeCloseTo(25.07, 2);
    });

    test('should handle a female with a low body fat percentage', () => {
      const values = {
        gender: 'female',
        units: 'metric',
        height: 160,
        neck: 32,
        waist: 65,
        hips: 85,
        weight: 50,
      };
      const result = calculateBodyFat(values);
      expect(result.bodyFatPercentage).toBeCloseTo(18.01, 2);
    });
  });

  describe('Mixed Units and Edge Cases', () => {
    test('should correctly convert imperial to metric for a male', () => {
      const values = {
        gender: 'male',
        units: 'imperial',
        height: 65,
        neck: 15.5,
        waist: 32,
        weight: 160,
      };
      const result = calculateBodyFat(values);
      expect(result.bodyFatPercentage).toBeCloseTo(14.49, 2);
    });

    test('should correctly convert imperial to metric for a female', () => {
      const values = {
        gender: 'female',
        units: 'imperial',
        height: 68,
        neck: 13,
        waist: 31,
        hips: 40,
        weight: 140,
      };
      const result = calculateBodyFat(values);
      expect(result.bodyFatPercentage).toBeCloseTo(29.99, 2);
    });

    test('should handle a male with very large measurements', () => {
      const values = {
        gender: 'male',
        units: 'metric',
        height: 185,
        neck: 45,
        waist: 115,
        weight: 120,
      };
      const result = calculateBodyFat(values);
      expect(result.bodyFatPercentage).toBeCloseTo(30.20, 2);
    });

    test('should handle a female with a wide hip circumference', () => {
      const values = {
        gender: 'female',
        units: 'metric',
        height: 168,
        neck: 35,
        waist: 85,
        hips: 115,
        weight: 75,
      };
      const result = calculateBodyFat(values);
      expect(result.bodyFatPercentage).toBeCloseTo(39.43, 2);
    });
  });
});