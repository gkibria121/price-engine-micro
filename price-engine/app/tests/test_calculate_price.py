import unittest
from unittest.mock import patch, MagicMock
from flask import Flask, json
from app.controllers import api_blueprint


class CalculatePriceTestCase(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(api_blueprint)
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()

    @patch("app.controllers.validate_calculation_request")
    @patch("app.controllers.mongo")
    def test_calculate_price_success(self, mock_mongo, mock_validate):
        # Mock validation data
        mock_validate.return_value = ({
            "productId": "6819a7bde23bd6b3d4989154",
            "vendorId": "6819a7bde23bd6b3d4989154",
            "quantity": 5,
            "attributes": [{"name": "Color", "value": "Red"}],
            "deliveryMethod": {"label": "express"}
        }, None, 200)

        # Mock MongoDB responses
        mock_mongo.db.vendor_products.find_one.return_value = {
            "product": "6819a7bde23bd6b3d4989154",
            "vendor": "6819a7bde23bd6b3d4989154",
            "pricingRules": [{"attribute": "Color", "value": "Red", "price": 100}],
            "quantityPricings": [{"quantity": 5, "price": 500}],
            "deliverySlots": [{"label": "express", "price": 100}]
        }

        mock_mongo.db.products.find_one.return_value = {
            "_id": "6819a7bde23bd6b3d4989154",
            "name": "Test Product"
        }

        # Mock PricingEngine.calculate_price
        with patch("app.controllers.PricingEngine") as MockEngine:
            instance = MockEngine.return_value
            instance.calculate_price.return_value = {
                "totalPrice": 700,
                "breakdown": {
                    "basePrice": 500,
                    "attributeCost": 100,
                    "deliveryCharge": 100
                }
            }

            response = self.client.post("/calculate-price", json={})
            data = response.get_json()

            self.assertEqual(response.status_code, 200)
            self.assertEqual(data["productName"], "Test Product")
            self.assertEqual(data["quantity"], 5)
            self.assertEqual(data["totalPrice"], 700)
            self.assertIn("breakdown", data)


if __name__ == "__main__":
    unittest.main()
