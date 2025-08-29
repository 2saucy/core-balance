import { calculateIdealWeight } from '../ideal-weight';

describe('calculateIdealWeight - New Set of 10 Tests', () => {
  describe('Metric System (kg, cm)', () => {
    test('1/10: should calculate ideal weight for a very short person (140cm, medium frame)', () => {
      const values = { units: 'metric', height: 140, bodyFrame: 'medium' };
      const result = calculateIdealWeight(values);
      expect(result.idealWeight).toBe(43);
    });

    test('2/10: should calculate ideal weight for a very tall person (190cm, medium frame)', () => {
      const values = { units: 'metric', height: 190, bodyFrame: 'medium' };
      const result = calculateIdealWeight(values);
      expect(result.idealWeight).toBe(79);
    });

    test('3/10: should handle a precise height (168.3cm, medium frame)', () => {
      const values = { units: 'metric', height: 168.3, bodyFrame: 'medium' };
      const result = calculateIdealWeight(values);
      expect(result.idealWeight).toBe(62);
    });
    
    test('4/10: should calculate ideal weight for a small frame (172cm)', () => {
        const values = { units: 'metric', height: 172, bodyFrame: 'small'};
        const result = calculateIdealWeight(values);
        expect(result.idealWeight).toBe(62);
    });

    test('5/10: should show a large positive difference (185cm, large, current 60kg)', () => {
        const values = { units: 'metric', height: 185, bodyFrame: 'large', currentWeight: 60 };
        const result = calculateIdealWeight(values);
        expect(result.idealWeight).toBe(79);
        expect(result.difference).toBe(19);
    });
  });

  describe('Imperial System (lbs, in)', () => {
    test('6/10: should calculate ideal weight for a very short person (55in, medium frame)', () => {
      const values = { units: 'imperial', height: 55, bodyFrame: 'medium' };
      const result = calculateIdealWeight(values);
      expect(result.idealWeight).toBe(95);
    });

    test('7/10: should calculate ideal weight for a very tall person (76in, medium frame)', () => {
      const values = { units: 'imperial', height: 76, bodyFrame: 'medium' };
      const result = calculateIdealWeight(values);
      expect(result.idealWeight).toBe(181);
    });

    test('8/10: should handle a precise height (69.8in, medium frame)', () => {
      const values = { units: 'imperial', height: 69.8, bodyFrame: 'medium' };
      const result = calculateIdealWeight(values);
      expect(result.idealWeight).toBe(152);
    });
    
    test('9/10: should show a large negative difference (68in, small, current 170lbs)', () => {
        const values = { units: 'imperial', height: 68, bodyFrame: 'small', currentWeight: 170};
        const result = calculateIdealWeight(values);
        expect(result.idealWeight).toBe(137);
        expect(result.difference).toBe(-33);
    });

    test('10/10: should show a small negative difference (67in, large, current 148lbs)', () => {
        const values = { units: 'imperial', height: 67, bodyFrame: 'large', currentWeight: 148};
        const result = calculateIdealWeight(values);
        expect(result.idealWeight).toBe(147);
        expect(result.difference).toBe(-1);
    });
  });
});