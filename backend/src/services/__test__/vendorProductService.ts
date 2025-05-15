import mongoose from "mongoose";
import VendorProductModel from "../../models/VendorProductModel";
import { getVendorsByProductAndDelivery } from "../vendorProductService"; // adjust the path accordingly
import { DeliverySlot } from "../../type";

// Mock Mongoose model
jest.mock("../models/VendorProductModel");

const mockedAggregate = jest.fn();
(VendorProductModel as any).aggregate = mockedAggregate;

describe("getVendorsByProductAndDelivery", () => {
  const mockDeliverySlot: DeliverySlot = {
    label: "Morning Delivery",
    price: 0,
    deliveryTimeStartDate: 0,
    deliveryTimeStartTime: "08:00",
    deliveryTimeEndDate: 0,
    deliveryTimeEndTime: "10:00",
    cutoffTime: "07:00",
  };

  beforeEach(() => {
    mockedAggregate.mockReset();
  });

  it("should return vendor IDs sorted by rating (desc)", async () => {
    const fakeVendorIds = [
      { vendor: new mongoose.Types.ObjectId("663f8fc2996f7e001f8b63c1") },
      { vendor: new mongoose.Types.ObjectId("663f8fc2996f7e001f8b63c2") },
    ];

    mockedAggregate.mockResolvedValueOnce(fakeVendorIds);

    const result = await getVendorsByProductAndDelivery(
      "663f8fc2996f7e001f8b63aa",
      mockDeliverySlot,
      10,
      "desc"
    );

    expect(mockedAggregate).toHaveBeenCalled();
    expect(result).toEqual([
      new mongoose.Types.ObjectId("663f8fc2996f7e001f8b63c1"),
      new mongoose.Types.ObjectId("663f8fc2996f7e001f8b63c2"),
    ]);
  });

  it("should return empty array on error", async () => {
    mockedAggregate.mockRejectedValueOnce(new Error("DB error"));

    const result = await getVendorsByProductAndDelivery(
      "663f8fc2996f7e001f8b63aa",
      mockDeliverySlot
    );

    expect(result).toEqual([]);
  });
});
