// validateBulkStoreRequest.test.ts

import { validateBulkStoreRequest } from "../bulkInsertOrUpdateService";
import ProductModel from "../../models/ProductModel";
import VendorModel from "../../models/VendorModel";
import VendorProductModel from "../../models/VendorProductModel";
import { CustomValidationException } from "../../Exceptions/CustomValidationException";

// Mock the models directly instead of using jest.mock
jest.mock("../../models/ProductModel", () => ({
  findById: jest.fn(),
}));

jest.mock("../../models/VendorModel", () => ({
  findById: jest.fn(),
}));

jest.mock("../../models/VendorProductModel", () => ({
  findOne: jest.fn(),
}));

describe("validateBulkStoreRequest", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("should pass validation when all data is valid", async () => {
    // Mock data
    const vendorProducts = [
      { productId: "product1", vendorId: "vendor1" },
      { productId: "product2", vendorId: "vendor2" },
    ];

    // Setup mocks to return valid data
    (ProductModel.findById as jest.Mock).mockImplementation((id) =>
      Promise.resolve({ _id: id })
    );
    (VendorModel.findById as jest.Mock).mockImplementation((id) =>
      Promise.resolve({ _id: id })
    );
    (VendorProductModel.findOne as jest.Mock).mockResolvedValue(null); // No existing vendor products

    // Execute the function
    await expect(
      validateBulkStoreRequest(vendorProducts)
    ).resolves.not.toThrow();

    // Verify mocks were called correctly
    expect(ProductModel.findById).toHaveBeenCalledTimes(2);
    expect(VendorModel.findById).toHaveBeenCalledTimes(2);
    expect(VendorProductModel.findOne).toHaveBeenCalledTimes(2);
  });

  test("should throw exception when product not found", async () => {
    // Mock data
    const vendorProducts = [
      { productId: "product1", vendorId: "vendor1" },
      { productId: "invalidProduct", vendorId: "vendor2" },
    ];

    // Setup mocks
    (ProductModel.findById as jest.Mock).mockImplementation((id) => {
      if (id === "product1") return Promise.resolve({ _id: id });
      return Promise.resolve(null); // product not found
    });
    (VendorModel.findById as jest.Mock).mockImplementation((id) =>
      Promise.resolve({ _id: id })
    );
    (VendorProductModel.findOne as jest.Mock).mockResolvedValue(null);

    // Execute and expect error
    await expect(validateBulkStoreRequest(vendorProducts)).rejects.toThrow(
      CustomValidationException
    );
    await expect(
      validateBulkStoreRequest(vendorProducts)
    ).rejects.toMatchObject({
      errors: expect.objectContaining({
        "vendorProducts.1.productId": ["Product not found"],
      }),
    });
  });

  test("should throw exception when vendor not found", async () => {
    // Mock data
    const vendorProducts = [
      { productId: "product1", vendorId: "invalidVendor" },
    ];

    // Setup mocks
    (ProductModel.findById as jest.Mock).mockResolvedValue({ _id: "product1" });
    (VendorModel.findById as jest.Mock).mockResolvedValue(null); // vendor not found
    (VendorProductModel.findOne as jest.Mock).mockResolvedValue(null);

    // Execute and expect error
    await expect(validateBulkStoreRequest(vendorProducts)).rejects.toThrow(
      CustomValidationException
    );
    await expect(
      validateBulkStoreRequest(vendorProducts)
    ).rejects.toMatchObject({
      errors: expect.objectContaining({
        "vendorProducts.0.vendorId": ["Vendor not found"],
      }),
    });
  });

  test("should throw exception when vendor product already exists", async () => {
    // Mock data
    const vendorProducts = [{ productId: "product1", vendorId: "vendor1" }];

    // Setup mocks
    (ProductModel.findById as jest.Mock).mockResolvedValue({ _id: "product1" });
    (VendorModel.findById as jest.Mock).mockResolvedValue({ _id: "vendor1" });
    (VendorProductModel.findOne as jest.Mock).mockResolvedValue({
      _id: "existingId",
      product: "product1",
      vendor: "vendor1",
    }); // vendor product exists

    // Execute and expect error
    await expect(validateBulkStoreRequest(vendorProducts)).rejects.toThrow(
      CustomValidationException
    );
    await expect(
      validateBulkStoreRequest(vendorProducts)
    ).rejects.toMatchObject({
      errors: expect.objectContaining({
        "vendorProducts.0.vendorId": ["VendorProduct already exists"],
        "vendorProducts.0.productId": ["VendorProduct already exists"],
      }),
    });
  });

  test("should handle multiple validation errors in the same request", async () => {
    // Mock data with multiple issues
    const vendorProducts = [
      { productId: "invalidProduct", vendorId: "invalidVendor" },
      { productId: "product2", vendorId: "vendor2" },
    ];

    // Setup mocks
    (ProductModel.findById as jest.Mock).mockImplementation((id) => {
      if (id === "product2") return Promise.resolve({ _id: id });
      return Promise.resolve(null);
    });

    (VendorModel.findById as jest.Mock).mockImplementation((id) => {
      if (id === "vendor2") return Promise.resolve({ _id: id });
      return Promise.resolve(null);
    });

    (VendorProductModel.findOne as jest.Mock).mockImplementation((query) => {
      if (query.product === "product2" && query.vendor === "vendor2") {
        return Promise.resolve({ _id: "existingId" }); // existing for the second one
      }
      return Promise.resolve(null);
    });

    // Execute and expect error
    await expect(validateBulkStoreRequest(vendorProducts)).rejects.toThrow(
      CustomValidationException
    );
    await expect(
      validateBulkStoreRequest(vendorProducts)
    ).rejects.toMatchObject({
      errors: expect.objectContaining({
        "vendorProducts.0.productId": ["Product not found"],
        "vendorProducts.0.vendorId": ["Vendor not found"],
        "vendorProducts.1.productId": ["VendorProduct already exists"],
        "vendorProducts.1.vendorId": ["VendorProduct already exists"],
      }),
    });
  });

  test("should handle empty array input", async () => {
    const vendorProducts: any[] = [];

    // No mocks should be called
    await expect(
      validateBulkStoreRequest(vendorProducts)
    ).resolves.not.toThrow();

    expect(ProductModel.findById).not.toHaveBeenCalled();
    expect(VendorModel.findById).not.toHaveBeenCalled();
    expect(VendorProductModel.findOne).not.toHaveBeenCalled();
  });
});
