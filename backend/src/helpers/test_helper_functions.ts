import ProductModel from "../models/ProductModel";
import VendorModel from "../models/VendorModel";
import { faker } from "@faker-js/faker";
import VendorProductModel from "../models/VendorProductModel";
import { ObjectId } from "mongoose";
import PricingRuleModel from "../models/PricingRuleModel";
import QuantityPricingModel from "../models/QuantityPricingModel";
import DeliverySlotModel from "../models/DeliverySlotModel";
export function createProduct() {
  const product = { name: faker.internet.displayName() };
  return ProductModel.create(product);
}

export function createVendor() {
  return VendorModel.create({
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    rating: Math.floor(Math.random() * 10) + 1,
  });
}

export async function createVendorProduct() {
  const product = await ProductModel.create({
    name: "Product 1",
  });
  const vendor = await VendorModel.create({
    name: "A",
    email: "dup@example.com",
    address: "Addr",
    rating: 4,
  });

  // Create pricing rules
  const pricingRule = await PricingRuleModel.create({
    attribute: "Paper",
    value: "Glossy",
    price: 687,
  });
  // Create multiple quantity pricing entries
  const quantityPricings = await QuantityPricingModel.insertMany([
    { quantity: 10, price: 100 },
    { quantity: 20, price: 180 },
    { quantity: 30, price: 250 },
  ]);
  // Create delivery slots
  const deliverySlot = await DeliverySlotModel.create({
    price: 143,
    cutoffTime: "23:56",
    deliveryTimeStartTime: "14:06",
    label: "express",
    deliveryTimeStartDate: 4,
    deliveryTimeEndDate: 21,
    deliveryTimeEndTime: "05:12",
  });
  // Create VendorProduct
  const vendorProduct = await VendorProductModel.create({
    vendor: vendor._id, // Reference to existing vendor
    product: product._id, // Reference to existing product
    pricingRules: [pricingRule._id], // Reference to created pricing rule
    deliverySlots: [deliverySlot._id], // Reference to created delivery slot
    quantityPricings: quantityPricings, // Reference to created quantity pricing
  });
  return vendorProduct;
}
