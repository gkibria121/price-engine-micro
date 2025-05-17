from typing import List 

from .product.quantity_pricing import QuantityPricing

class QuadraticCurveFitter:
    def __init__(self):
        self.a = 0.0
        self.b = 0.0
        self.c = 0.0

    def fit(self, points: List[QuantityPricing]) -> None:
        if not points or len(points) == 0:
            raise ValueError("Points list cannot be null or empty.")

        if len(points) == 2:
            p1, p2 = points
            b = (p2.price - p1.price) / (p2.quantity - p1.quantity)
            c = p1.price - b * p1.quantity

            self.a = 0.0  # No quadratic term
            self.b = b
            self.c = c
            return

        n = len(points)
        sum_x = sum_x2 = sum_x3 = sum_x4 = 0.0
        sum_y = sum_xy = sum_x2y = 0.0

        for p in points:
            x = p.quantity
            y = p.price
            sum_x += x
            sum_x2 += x ** 2
            sum_x3 += x ** 3
            sum_x4 += x ** 4
            sum_y += y
            sum_xy += x * y
            sum_x2y += x ** 2 * y

        matrix = [
            [n, sum_x, sum_x2],
            [sum_x, sum_x2, sum_x3],
            [sum_x2, sum_x3, sum_x4],
        ]

        vector = [sum_y, sum_xy, sum_x2y]

        c, b, a = self.solve(matrix, vector)

        self.a = a
        self.b = b
        self.c = c

    def predict(self, quantity: float) -> float:
        return self.a * quantity ** 2 + self.b * quantity + self.c

    def solve(self, matrix: List[List[float]], vector: List[float]) -> List[float]:
        n = len(vector)
        result = [0.0 for _ in range(n)]

        # Forward elimination
        for i in range(n):
            for j in range(i + 1, n):
                ratio = matrix[j][i] / matrix[i][i]
                for k in range(i, n):
                    matrix[j][k] -= ratio * matrix[i][k]
                vector[j] -= ratio * vector[i]

        # Back substitution
        for i in range(n - 1, -1, -1):
            result[i] = vector[i]
            for j in range(i + 1, n):
                result[i] -= matrix[i][j] * result[j]
            result[i] /= matrix[i][i]

        return result
