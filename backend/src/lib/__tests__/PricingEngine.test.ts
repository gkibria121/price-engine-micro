// __tests__/PricingEngine.test.ts

import PriceCalculationRequest from "../PriceCalculationRequest";
import PricingEngine from "../PriceEngine";
import DeliveryRule from "../product/DeliveryRule";
import PricingRule from "../product/PricingRule";
import Product from "../product/Product";
import QuantityPricing from "../product/QuantityPricing";

describe("PricingEngine", () => {
  const product = new Product("Poster");

  // Train with quantities from 10 to 20
  product.quantityPricing = [
    new QuantityPricing(10, 800),
    new QuantityPricing(15, 1100),
    new QuantityPricing(20, 1400),
  ];

  product.pricingRules = [
    new PricingRule("Color", "Red", 10), // 10% extra for Red color
    new PricingRule("Size", "Large", 20), // 20% extra for Large size
  ];

  product.deliveryRules = [
    new DeliveryRule("Standard", 10),
    new DeliveryRule("Express", 25),
  ];

  let engine: PricingEngine;

  beforeEach(() => {
    engine = new PricingEngine(product);
  });

  it("should calculate total price without any attributes", () => {
    const request = new PriceCalculationRequest("Poster", 15, [], "Standard");

    const result = engine.calculatePrice(request);

    expect(result.totalPrice).toBeCloseTo(1110); // 1100 + 10 delivery fee
    expect(result.breakdown.basePrice).toBeCloseTo(1100);
    expect(result.breakdown.attributeCost).toBeCloseTo(0);
    expect(result.breakdown.deliveryCharge).toBeCloseTo(10);
  });

  it("should apply attribute price changes", () => {
    const request = new PriceCalculationRequest(
      "Poster",
      15,
      [{ name: "Color", value: "Red" }],
      "Standard"
    );

    const result = engine.calculatePrice(request);

    // base 1100 + 10% = 1210 + 10 delivery
    expect(result.totalPrice).toBeCloseTo(1220);
    expect(result.breakdown.basePrice).toBeCloseTo(1100);
    expect(result.breakdown.attributeCost).toBeCloseTo(110);
    expect(result.breakdown.deliveryCharge).toBeCloseTo(10);
  });

  it("should apply multiple attribute price changes", () => {
    const request = new PriceCalculationRequest(
      "Poster",
      15,
      [
        { name: "Color", value: "Red" },
        { name: "Size", value: "Large" },
      ],
      "Express"
    );

    const result = engine.calculatePrice(request);

    // 1100 + 10% = 1210
    // 1210 + 20% = 1452
    // 1452 + 25 = 1477
    expect(result.totalPrice).toBeCloseTo(1477);
    expect(result.breakdown.basePrice).toBeCloseTo(1100);
    expect(result.breakdown.attributeCost).toBeCloseTo(352);
    expect(result.breakdown.deliveryCharge).toBeCloseTo(25);
  });

  it("should throw error for invalid delivery method", () => {
    const request = new PriceCalculationRequest("Poster", 15, [], "Rocket");

    expect(() => {
      engine.calculatePrice(request);
    }).toThrow("Invalid delivery nature");
  });

  it("should handle interpolation between quantity pricing", () => {
    const request = new PriceCalculationRequest("Poster", 12, [], "Standard");

    const result = engine.calculatePrice(request);

    // 12 is between 10 (800) and 15 (1100)
    // linear interpolation:
    // price = 800 + ((1100-800)/(15-10))*(12-10)
    // price = 800 + (300/5)*2 = 800 + 120 = 920
    // total = 920 + 10 = 930
    expect(result.breakdown.basePrice).toBeCloseTo(920);
    expect(result.totalPrice).toBeCloseTo(930);
  });

  // *** NEW TEST ***
  it("should calculate price for small quantity (below trained range)", () => {
    const request = new PriceCalculationRequest("Poster", 5, [], "Standard");

    const result = engine.calculatePrice(request);

    // Since 5 < minimum quantity (10), extrapolate or clamp.
    // Your engine might:
    // - clamp to minimum (800)
    // - or extrapolate (depending on design)

    // Assuming clamping to lowest (800)
    expect(result.breakdown.basePrice).toBeCloseTo(800);
    expect(result.totalPrice).toBeCloseTo(810); // +10 delivery
  });
  it("should handle zero or negative quantity gracefully", () => {
    const zeroQuantityRequest = new PriceCalculationRequest(
      "Poster",
      0,
      [],
      "Standard"
    );
    const negativeQuantityRequest = new PriceCalculationRequest(
      "Poster",
      -3,
      [],
      "Standard"
    );

    const zeroResult = engine.calculatePrice(zeroQuantityRequest);
    const negativeResult = engine.calculatePrice(negativeQuantityRequest);

    // For quantity = 0
    expect(zeroResult.totalPrice).toBeCloseTo(0);
    expect(zeroResult.breakdown.basePrice).toBeCloseTo(0);
    expect(zeroResult.breakdown.attributeCost).toBeCloseTo(0);
    expect(zeroResult.breakdown.deliveryCharge).toBeCloseTo(0);

    // For quantity < 0
    expect(negativeResult.totalPrice).toBeCloseTo(0);
    expect(negativeResult.breakdown.basePrice).toBeCloseTo(0);
    expect(negativeResult.breakdown.attributeCost).toBeCloseTo(0);
    expect(negativeResult.breakdown.deliveryCharge).toBeCloseTo(0);
  });

  it("should handle large quantities correctly", () => {
    const request = new PriceCalculationRequest("Poster", 100, [], "Standard");

    const result = engine.calculatePrice(request);

    // Base price should be based on the 100 quantity
    expect(result.totalPrice).toBeGreaterThan(10000); // Expect a total over 10000
    expect(result.breakdown.basePrice).toBeGreaterThan(10000); // Check base price
  });
});
