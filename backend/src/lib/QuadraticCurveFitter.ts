import QuantityPricing from "./product/QuantityPricing";

// Quadratic Curve Fitter
export default class QuadraticCurveFitter {
  a: number;
  b: number;
  c: number;

  constructor() {
    this.a = 0;
    this.b = 0;
    this.c = 0;
  }

  fit(points: QuantityPricing[]): void {
    if (!points || points.length === 0) {
      throw new Error("Points list cannot be null or empty.");
    }
    if (points.length === 2) {
      const [p1, p2] = points;

      // Linear fitting: y = bx + c
      const b = (p2.price - p1.price) / (p2.quantity - p1.quantity);
      const c = p1.price - b * p1.quantity;

      this.a = 0; // No quadratic term
      this.b = b;
      this.c = c;
      return;
    }
    const n = points.length;
    let sumX = 0,
      sumX2 = 0,
      sumX3 = 0,
      sumX4 = 0;
    let sumY = 0,
      sumXY = 0,
      sumX2Y = 0;

    points.forEach((p) => {
      sumX += p.quantity;
      sumX2 += p.quantity ** 2;
      sumX3 += p.quantity ** 3;
      sumX4 += p.quantity ** 4;
      sumY += p.price;
      sumXY += p.quantity * p.price;
      sumX2Y += p.quantity ** 2 * p.price;
    });

    const matrix = [
      [n, sumX, sumX2],
      [sumX, sumX2, sumX3],
      [sumX2, sumX3, sumX4],
    ];

    const vector = [sumY, sumXY, sumX2Y];

    const [c, b, a] = this.solve(matrix, vector);

    this.a = a;
    this.b = b;
    this.c = c;
  }

  predict(quantity: number): number {
    return this.a * quantity ** 2 + this.b * quantity + this.c;
  }

  solve(matrix: number[][], vector: number[]): number[] {
    const n = vector.length;
    const result = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const ratio = matrix[j][i] / matrix[i][i];
        for (let k = i; k < n; k++) {
          matrix[j][k] -= ratio * matrix[i][k];
        }
        vector[j] -= ratio * vector[i];
      }
    }

    for (let i = n - 1; i >= 0; i--) {
      result[i] = vector[i];
      for (let j = i + 1; j < n; j++) {
        result[i] -= matrix[i][j] * result[j];
      }
      result[i] /= matrix[i][i];
    }

    return result;
  }
}
