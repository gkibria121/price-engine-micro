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
  });

  describe("getVendor", () => {
    it("should return the best matching vendor", async () => {
      // Setup mock data
      const mockVendorData = [{ vendorData: { name: "Vendor A", rating: 5 } }];

      // Clear previous mock calls and set up the mock response
      (VendorProductModel.aggregate as jest.Mock).mockClear();
      (VendorProductModel.aggregate as jest.Mock).mockResolvedValueOnce(
        mockVendorData
      );

      const result = await getVendor(
        new mongoose.mongo.ObjectId().toHexString(),
        [{ name: "color", value: "red" }],
        {
          label: "Morning Delivery",
          price: 10,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "08:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "11:00",
          cutoffTime: "07:00",
        } as any,
        new Date("2024-04-24T06:30:00Z").getTime()
      );

      // Make sure aggregate was called
      expect(VendorProductModel.aggregate).toHaveBeenCalled();

      // Check the arguments to be more specific
      expect(
        (VendorProductModel.aggregate as jest.Mock).mock.calls[0][0]
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ $match: expect.anything() }),
        ])
      );

      expect(result).toEqual({ name: "Vendor A", rating: 5 });
    });
    it("should return null if no vendors match", async () => {
      (VendorProductModel.aggregate as jest.Mock).mockResolvedValue([]);

      const result = await getVendor(
        new mongoose.mongo.ObjectId().toHexString(),
        [],
        {
          label: "Evening Delivery",
          price: 15,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "18:00",
          deliveryTimeEndDate: 0,
          deliveryTimeEndTime: "21:00",
          cutoffTime: "17:00",
        } as any,
        Date.now()
      );

      expect(result).toBeNull();
    });

    it("should handle errors and return null", async () => {
      (VendorProductModel.aggregate as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      const result = await getVendor(
        new mongoose.mongo.ObjectId().toHexString(),
        [],
        {
          label: "Evening Delivery",
          price: 15,
          deliveryTimeStartDate: 0,
          deliveryTimeStartTime: "18:00",
          deliveryTimeEndDate: 3,
          deliveryTimeEndTime: "21:00",
          cutoffTime: "17:00",
        } as any,
        Date.now()
      );

      expect(result).toBeNull();
    });
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
        Date.now()
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
        "2024-04-25T07:30:00Z" // String format
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
        Date.now()
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
        Date.now()
      );

      expect(result).toBeNull();
    });
  });

  describe("getMatchedDeliverySlot", () => {
    it("should return a matched delivery slot", async () => {
      const mockSlot = {
        deliveryTimeStartDate: 0,
        deliveryTimeEndDate: 1,
        deliveryTimeEndTime: "11:00",
      };
      const mockVendorProduct = {
        deliverySlots: [mockSlot],
      };

      const findOneMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockVendorProduct),
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

      expect(result).toEqual(mockSlot);
    });

    it("should return null if no vendor product found", async () => {
      const findOneMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
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
          deliveryTimeEndDate: 3,
          deliveryTimeEndTime: "11:00",
          cutoffTime: "07:00",
        } as any
      );

      expect(result).toBeNull();
    });

    it("should handle errors and return null", async () => {
      const findOneMock = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("DB Error")),
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
