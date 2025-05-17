import unittest
from app.lib.product.quantity_pricing import QuantityPricing
from app.lib.quadratic_curve_fitter import QuadraticCurveFitter

class TestQuadraticCurveFitterExtended(unittest.TestCase):

    def test_fit_linear_relationship(self):
        points = [
            QuantityPricing(0, 5),
            QuantityPricing(1, 7),
            QuantityPricing(2, 9),
            QuantityPricing(3, 11),
        ]
        fitter = QuadraticCurveFitter()
        fitter.fit(points)
        self.assertAlmostEqual(fitter.a, 0, places=5)
        self.assertAlmostEqual(fitter.b, 2)
        self.assertAlmostEqual(fitter.c, 5)
        self.assertAlmostEqual(fitter.predict(4), 13)
        self.assertAlmostEqual(fitter.predict(5), 15)

    def test_fit_larger_dataset(self):
        points = [
            QuantityPricing(0, 3),
            QuantityPricing(1, 6),
            QuantityPricing(2, 11),
            QuantityPricing(3, 18),
            QuantityPricing(4, 27),
            QuantityPricing(5, 38),
            QuantityPricing(6, 51),
        ]
        fitter = QuadraticCurveFitter()
        fitter.fit(points)
        self.assertAlmostEqual(fitter.predict(0), 3, delta=1)
        self.assertAlmostEqual(fitter.predict(3), 18, delta=1)
        self.assertAlmostEqual(fitter.predict(6), 51, delta=1)
        pred = fitter.predict(2.5)
        self.assertGreater(pred, 13)
        self.assertLess(pred, 16)
        self.assertGreater(fitter.predict(7), 65)
        self.assertLess(fitter.predict(7), 70)

    def test_fit_with_floats(self):
        points = [
            QuantityPricing(0.5, 4.25),
            QuantityPricing(1.5, 9.25),
            QuantityPricing(2.5, 16.25),
        ]
        fitter = QuadraticCurveFitter()
        fitter.fit(points)
        self.assertAlmostEqual(fitter.predict(0.5), 4.25)
        self.assertAlmostEqual(fitter.predict(1.5), 9.25)
        self.assertAlmostEqual(fitter.predict(2.5), 16.25)
        self.assertAlmostEqual(fitter.predict(3.5), 25.25, delta=1)

    def test_duplicate_x_values(self):
        points = [
            QuantityPricing(1, 5),
            QuantityPricing(1, 7),
            QuantityPricing(2, 10),
            QuantityPricing(3, 15),
        ]
        fitter = QuadraticCurveFitter()
        fitter.fit(points)
        pred = fitter.predict(1)
        self.assertGreaterEqual(pred, 5)
        self.assertLessEqual(pred, 7)

    def test_two_points(self):
        points = [QuantityPricing(1, 5), QuantityPricing(2, 10)]
        fitter = QuadraticCurveFitter()
        fitter.fit(points)
        self.assertAlmostEqual(fitter.predict(1), 5, delta=1)
        self.assertAlmostEqual(fitter.predict(2), 10, delta=1)
        self.assertAlmostEqual(fitter.predict(3), 15, delta=1)

    def test_extreme_values(self):
        points = [
            QuantityPricing(1000, 3000000),
            QuantityPricing(2000, 12000000),
            QuantityPricing(3000, 27000000),
        ]
        fitter = QuadraticCurveFitter()
        fitter.fit(points)
        self.assertAlmostEqual(fitter.predict(1000), 3000000, delta=10000)
        self.assertAlmostEqual(fitter.predict(2000), 12000000, delta=10000)
        self.assertAlmostEqual(fitter.predict(3000), 27000000, delta=10000)
        self.assertAlmostEqual(fitter.predict(4000), 48000000, delta=10000)

    def test_solve_identity_matrix(self):
        fitter = QuadraticCurveFitter()
        matrix = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ]
        vector = [5, 7, 9]
        result = fitter.solve(matrix, vector)
        self.assertEqual(result, [5, 7, 9])

    def test_perfect_parabola(self):
        points = [
            QuantityPricing(0, 0),
            QuantityPricing(1, 1),
            QuantityPricing(2, 4),
            QuantityPricing(3, 9),
            QuantityPricing(4, 16),
        ]
        fitter = QuadraticCurveFitter()
        fitter.fit(points)
        self.assertAlmostEqual(fitter.a, 1)
        self.assertAlmostEqual(fitter.b, 0, places=5)
        self.assertAlmostEqual(fitter.c, 0, places=5)
        self.assertAlmostEqual(fitter.predict(5), 25)
        self.assertAlmostEqual(fitter.predict(6), 36)

if __name__ == '__main__':
    unittest.main()
