import unittest

from app.lib.price_engine import PricingEngine, PriceEngineException
from app.lib.price_calculation_request import PriceCalculationRequest
from app.lib.product  import DeliveryRule,PricingRule,QuantityPricing,Product,Attribute


class TestPricingEngine(unittest.TestCase):

    def setUp(self):
        self.product = Product("Poster")

        self.product.quantity_pricings = [
            QuantityPricing(10, 800),
            QuantityPricing(15, 1100),
            QuantityPricing(20, 1400),
        ]

        self.product.pricing_rules = [
            PricingRule("Color", "Red", 10),  # 10% extra for Red color
            PricingRule("Size", "Large", 20),  # 20% extra for Large size
        ]

        self.product.delivery_rules = [
            DeliveryRule("Standard", 10),
            DeliveryRule("Express", 25),
        ]

        self.engine = PricingEngine(self.product)

    def test_price_without_attributes(self):
        request = PriceCalculationRequest("Poster", 15, [], "Standard")
        result = self.engine.calculate_price(request)

        self.assertAlmostEqual(result["totalPrice"], 1110)  # 1100 + 10 delivery fee
        self.assertAlmostEqual(result["breakdown"]["basePrice"], 1100)
        self.assertAlmostEqual(result["breakdown"]["attributeCost"], 0)
        self.assertAlmostEqual(result["breakdown"]["deliveryCharge"], 10)

    def test_price_with_one_attribute(self):
        request = PriceCalculationRequest("Poster", 15, [ Attribute( name="Color", value ="Red")], "Standard")
        result = self.engine.calculate_price(request)

        # base 1100 + 10% = 1210 + 10 delivery
        self.assertAlmostEqual(result["totalPrice"], 1220)
        self.assertAlmostEqual(result["breakdown"]["basePrice"], 1100)
        self.assertAlmostEqual(result["breakdown"]["attributeCost"], 110)
        self.assertAlmostEqual(result["breakdown"]["deliveryCharge"], 10)

    def test_price_with_multiple_attributes(self):
        request = PriceCalculationRequest(
            "Poster",
            15,
            [
               Attribute(name="Color", value="Red"),
        Attribute(name="Size", value="Large"),
            ],
            "Express"
        )
        result = self.engine.calculate_price(request)

        # 1100 + 10% = 1210
        # 1210 + 20% = 1452
        # 1452 + 25 = 1477
        self.assertAlmostEqual(result["totalPrice"], 1477)
        self.assertAlmostEqual(result["breakdown"]["basePrice"], 1100)
        self.assertAlmostEqual(result["breakdown"]["attributeCost"], 352)
        self.assertAlmostEqual(result["breakdown"]["deliveryCharge"], 25)

    def test_invalid_delivery_method_raises(self):
        request = PriceCalculationRequest("Poster", 15, [], "Rocket")

        with self.assertRaises(PriceEngineException) as context:
            self.engine.calculate_price(request)

        self.assertEqual(str(context.exception), "Invalid delivery nature")

    def test_interpolation_between_quantity_pricing(self):
        request = PriceCalculationRequest("Poster", 12, [], "Standard")
        result = self.engine.calculate_price(request)

        # linear interpolation:
        # price = 800 + ((1100-800)/(15-10))*(12-10) = 920
        self.assertAlmostEqual(result["breakdown"]["basePrice"], 920)
        self.assertAlmostEqual(result["totalPrice"], 930)

    def test_quantity_out_of_range_raises(self):
        small_request = PriceCalculationRequest("Poster", 1, [], "Standard")
        large_request = PriceCalculationRequest("Poster", 30, [], "Standard")

        with self.assertRaises(PriceEngineException):
            self.engine.calculate_price(small_request)
        with self.assertRaises(PriceEngineException):
            self.engine.calculate_price(large_request)

    def test_zero_and_negative_quantity(self):
        zero_request = PriceCalculationRequest("Poster", 0, [], "Standard")
        negative_request = PriceCalculationRequest("Poster", -3, [], "Standard")

        zero_result = self.engine.calculate_price(zero_request)
        negative_result = self.engine.calculate_price(negative_request)

        for result in (zero_result, negative_result):
            self.assertAlmostEqual(result["totalPrice"], 0)
            self.assertAlmostEqual(result["breakdown"]["basePrice"], 0)
            self.assertAlmostEqual(result["breakdown"]["attributeCost"], 0)
            self.assertAlmostEqual(result["breakdown"]["deliveryCharge"], 0)


if __name__ == "__main__":
    unittest.main()
