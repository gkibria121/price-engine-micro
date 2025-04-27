import ProductModel from "../models/ProductModel";
import VendorModel from "../models/VendorModel";
import { faker } from "@faker-js/faker";
import VendorProductModel from "../models/VendorProductModel";
import { ObjectId } from "mongoose";
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

export function createVendorProduct(productId: ObjectId, vendorId: ObjectId) {
  return VendorProductModel.create({
    vendorId: vendorId,
    productId: productId,
    pricingRules: [{ attribute: "Paper", value: "Glossy", price: 687 }],
    deliverySlots: [
      {
        price: 143,
        cutoffTime: "23:56",
        deliveryTimeStartTime: "14:06",
        label: "express",
        deliveryTimeStartDate: 4,
        deliveryTimeEndDate: 21,
        deliveryTimeEndTime: "05:12",
      },
    ],
    quantityPricings: [{ quantity: 10, price: 100 }],
  });
}
