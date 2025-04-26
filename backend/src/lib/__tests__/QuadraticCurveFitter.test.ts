// __tests__/QuadraticCurveFitter.extended.test.ts

import QuadraticCurveFitter from "../QuadraticCurveFitter";
import QuantityPricing from "../product/QuantityPricing";

describe("QuadraticCurveFitter - Extended Tests", () => {
  it("should fit a linear relationship (when a=0)", () => {
    const points = [
      new QuantityPricing(0, 5),
      new QuantityPricing(1, 7),
      new QuantityPricing(2, 9),
      new QuantityPricing(3, 11),
    ];

    const fitter = new QuadraticCurveFitter();
    fitter.fit(points);

    expect(fitter.a).toBeCloseTo(0, 5);
    expect(fitter.b).toBeCloseTo(2);
    expect(fitter.c).toBeCloseTo(5);

    expect(fitter.predict(4)).toBeCloseTo(13);
    expect(fitter.predict(5)).toBeCloseTo(15);
  });

  it("should handle larger datasets", () => {
    const points = [
      new QuantityPricing(0, 3),
      new QuantityPricing(1, 6),
      new QuantityPricing(2, 11),
      new QuantityPricing(3, 18),
      new QuantityPricing(4, 27),
      new QuantityPricing(5, 38),
      new QuantityPricing(6, 51),
    ];

    const fitter = new QuadraticCurveFitter();
    fitter.fit(points);

    expect(fitter.predict(0)).toBeCloseTo(3, 1);
    expect(fitter.predict(3)).toBeCloseTo(18, 1);
    expect(fitter.predict(6)).toBeCloseTo(51, 1);

    // Looser check for interpolation
    const pred = fitter.predict(2.5);
    expect(pred).toBeGreaterThan(13);
    expect(pred).toBeLessThan(16);

    // Extrapolation check
    expect(fitter.predict(7)).toBeGreaterThan(65);
    expect(fitter.predict(7)).toBeLessThan(70);
  });

  it("should handle floating point quantities", () => {
    const points = [
      new QuantityPricing(0.5, 4.25),
      new QuantityPricing(1.5, 9.25),
      new QuantityPricing(2.5, 16.25),
    ];

    const fitter = new QuadraticCurveFitter();
    fitter.fit(points);

    expect(fitter.predict(0.5)).toBeCloseTo(4.25);
    expect(fitter.predict(1.5)).toBeCloseTo(9.25);
    expect(fitter.predict(2.5)).toBeCloseTo(16.25);
    expect(fitter.predict(3.5)).toBeCloseTo(25.25, 1);
  });

  it("should handle duplicate x values by minimizing error", () => {
    const points = [
      new QuantityPricing(1, 5),
      new QuantityPricing(1, 7),
      new QuantityPricing(2, 10),
      new QuantityPricing(3, 15),
    ];

    const fitter = new QuadraticCurveFitter();
    fitter.fit(points);

    const predictionAtOne = fitter.predict(1);
    expect(predictionAtOne).toBeGreaterThanOrEqual(5);
    expect(predictionAtOne).toBeLessThanOrEqual(7);
  });

  it("should handle only two data points", () => {
    const points = [new QuantityPricing(1, 5), new QuantityPricing(2, 10)];

    const fitter = new QuadraticCurveFitter();
    fitter.fit(points);

    expect(fitter.predict(1)).toBeCloseTo(5, 1);
    expect(fitter.predict(2)).toBeCloseTo(10, 1);
    expect(fitter.predict(3)).toBeCloseTo(15, 1);
  });

  it("should handle extreme values", () => {
    const points = [
      new QuantityPricing(1000, 3000000),
      new QuantityPricing(2000, 12000000),
      new QuantityPricing(3000, 27000000),
    ];

    const fitter = new QuadraticCurveFitter();
    fitter.fit(points);

    expect(fitter.predict(1000)).toBeCloseTo(3000000, -2);
    expect(fitter.predict(2000)).toBeCloseTo(12000000, -2);
    expect(fitter.predict(3000)).toBeCloseTo(27000000, -2);
    expect(fitter.predict(4000)).toBeCloseTo(48000000, -2);
  });

  it("should test the solve method with a simple system", () => {
    const fitter = new QuadraticCurveFitter();

    const matrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    const vector = [5, 7, 9];

    const result = fitter.solve(matrix, vector);

    expect(result).toEqual([5, 7, 9]);
  });

  it("should fit a perfect parabola y = x²", () => {
    const points = [
      new QuantityPricing(0, 0),
      new QuantityPricing(1, 1),
      new QuantityPricing(2, 4),
      new QuantityPricing(3, 9),
      new QuantityPricing(4, 16),
    ];

    const fitter = new QuadraticCurveFitter();
    fitter.fit(points);

    expect(fitter.a).toBeCloseTo(1);
    expect(fitter.b).toBeCloseTo(0, 5);
    expect(fitter.c).toBeCloseTo(0, 5);

    expect(fitter.predict(5)).toBeCloseTo(25);
    expect(fitter.predict(6)).toBeCloseTo(36);
  });
});
