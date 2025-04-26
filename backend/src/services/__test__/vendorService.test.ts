import mongoose from "mongoose";
import { getVendor, getMatchedDeliverySlot } from "../vendorService";
import VendorProductModel from "../../models/VendorProductModel";

// Proper VendorProductModel mock
jest.mock("../../models/VendorProductModel", () => ({
  __esModule: true,
  default: {
    aggregate: jest.fn(),
  },
}));

describe("vendorService", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("getVendor", () => {
    // existing tests...

    it("should match vendors even if attributes are empty", async () => {
      (VendorProductModel.aggregate as jest.Mock).mockResolvedValueOnce([
        { vendorData: { name: "Vendor B", rating: 4 } },
      ]);

      const result = await getVendor(
        new mongoose.mongo.ObjectId().toHexString(),
        [], // no attributes
        {
          label: "Express Delivery",
          price: 20,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "09:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "12:00",
          cutoffTime: "08:00",
        } as any,
        new Date()
      );

      expect(result).toEqual({ name: "Vendor B", rating: 4 });
    });

    it("should correctly parse string currentTime", async () => {
      (VendorProductModel.aggregate as jest.Mock).mockResolvedValueOnce([
        { vendorData: { name: "Vendor C", rating: 3 } },
      ]);

      const result = await getVendor(
        new mongoose.mongo.ObjectId().toHexString(),
        [],
        {
          label: "Express Delivery",
          price: 20,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "09:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "12:00",
          cutoffTime: "08:00",
        } as any,
        new Date("2024-04-25T07:30:00Z") // String format
      );

      expect(result).toEqual({ name: "Vendor C", rating: 3 });
    });

    it("should pick the highest rated vendor if multiple vendors match", async () => {
      (VendorProductModel.aggregate as jest.Mock).mockResolvedValueOnce([
        { vendorData: { name: "Vendor A", rating: 5 } },
        { vendorData: { name: "Vendor B", rating: 3 } },
      ]);

      const result = await getVendor(
        new mongoose.mongo.ObjectId().toHexString(),
        [],
        {
          label: "Express Delivery",
          price: 20,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "09:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "12:00",
          cutoffTime: "08:00",
        } as any,
        new Date()
      );

      expect(result).toEqual({ name: "Vendor A", rating: 5 });
    });

    it("should handle invalid productId gracefully", async () => {
      (VendorProductModel.aggregate as jest.Mock).mockRejectedValueOnce(
        new Error("Invalid ObjectId")
      );

      const result = await getVendor(
        "invalid-id",
        [],
        {
          label: "Express Delivery",
          price: 20,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "09:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "12:00",
          cutoffTime: "08:00",
        } as any,
        new Date()
      );

      expect(result).toBeNull();
    });
  });

  describe("getMatchedDeliverySlot", () => {
    // existing tests...

    it("should return null if deliverySlots array is empty", async () => {
      const findOneMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({ deliverySlots: [] }),
      });

      jest.spyOn(mongoose, "model").mockReturnValue({
        findOne: findOneMock,
      } as any);

      const result = await getMatchedDeliverySlot(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        {
          label: "Morning Delivery",
          price: 10,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "08:00",
          deliveryTimeEndDate: 1,
          deliveryTimeEndTime: "11:00",
          cutoffTime: "07:00",
        } as any
      );

      expect(result).toBeNull();
    });

    it("should return null if delivery slot does not exactly match", async () => {
      const findOneMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          deliverySlots: [
            {
              deliveryTimeStartDate: 0,
              deliveryTimeEndDate: 2, // Different
              deliveryTimeEndTime: "11:00",
            },
          ],
        }),
      });

      jest.spyOn(mongoose, "model").mockReturnValue({
        findOne: findOneMock,
      } as any);

      const result = await getMatchedDeliverySlot(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        {
          label: "Morning Delivery",
          price: 10,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "08:00",
          deliveryTimeEndDate: 1,
          deliveryTimeEndTime: "11:00",
          cutoffTime: "07:00",
        } as any
      );

      expect(result).toBeNull();
    });

    it("should handle undefined populatedVendor gracefully", async () => {
      const findOneMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(undefined),
      });

      jest.spyOn(mongoose, "model").mockReturnValue({
        findOne: findOneMock,
      } as any);

      const result = await getMatchedDeliverySlot(
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        {
          label: "Evening Delivery",
          price: 15,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "18:00",
          deliveryTimeEndDate: 3,
          deliveryTimeEndTime: "21:00",
          cutoffTime: "17:00",
        } as any
      );

      expect(result).toBeNull();
    });
  });
});
