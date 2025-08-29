import { calculateBMI } from '../bmi';

describe('Additional BMI Test Cases', () => {
    // Metric System (kg, cm)
    test('should classify as "Normal" with a weight of 68kg and a height of 175cm', () => {
        const values = { units: 'metric', weight: 68, height: 175 };
        const result = calculateBMI(values);
        expect(result.bmi).toBeCloseTo(22.20, 2);
        expect(result.classification).toBe('Normal');
    });

    test('should classify as "Overweight" with a weight of 85kg and a height of 170cm', () => {
        const values = { units: 'metric', weight: 85, height: 170 };
        const result = calculateBMI(values);
        expect(result.bmi).toBeCloseTo(29.41, 2);
        expect(result.classification).toBe('Overweight');
    });

    test('should classify as "Obese" with a weight of 110kg and a height of 185cm', () => {
        const values = { units: 'metric', weight: 110, height: 185 };
        const result = calculateBMI(values);
        expect(result.bmi).toBeCloseTo(32.14, 2);
        expect(result.classification).toBe('Obese');
    });

    test('should handle edge case for BMI 18.5 (metric)', () => {
        const values = { units: 'metric', weight: 60.1, height: 180 };
        const result = calculateBMI(values);
        expect(result.bmi).toBeCloseTo(18.55, 2);
        expect(result.classification).toBe('Normal');
    });

    test('should handle edge case for BMI 25 (metric)', () => {
        const values = { units: 'metric', weight: 81, height: 180 };
        const result = calculateBMI(values);
        expect(result.bmi).toBeCloseTo(25.00, 2);
        expect(result.classification).toBe('Overweight');
    });

    // Imperial System (lbs, in)
    test('should classify as "Normal" with a weight of 145lbs and a height of 68in', () => {
        const values = { units: 'imperial', weight: 145, height: 68 };
        const result = calculateBMI(values);
        expect(result.bmi).toBeCloseTo(22.05, 2);
        expect(result.classification).toBe('Normal');
    });

    test('should classify as "Overweight" with a weight of 175lbs and a height of 67in', () => {
        const values = { units: 'imperial', weight: 175, height: 67 };
        const result = calculateBMI(values);
        expect(result.bmi).toBeCloseTo(27.41, 2);
        expect(result.classification).toBe('Overweight');
    });

    test('should classify as "Obese" with a weight of 220lbs and a height of 72in', () => {
        const values = { units: 'imperial', weight: 220, height: 72 };
        const result = calculateBMI(values);
        expect(result.bmi).toBeCloseTo(29.84, 2);
        expect(result.classification).toBe('Overweight');
    });

    test('should handle a low weight and height in imperial units', () => {
        const values = { units: 'imperial', weight: 95, height: 60 };
        const result = calculateBMI(values);
        expect(result.bmi).toBeCloseTo(18.55, 2);
        expect(result.classification).toBe('Normal');
    });

    test('should handle a high weight and height in imperial units', () => {
        const values = { units: 'imperial', weight: 250, height: 75 };
        const result = calculateBMI(values);
        expect(result.bmi).toBeCloseTo(31.25, 2);
        expect(result.classification).toBe('Obese');
    });
});