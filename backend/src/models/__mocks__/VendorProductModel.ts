// Your mock should be:
jest.mock("../../models/VendorProductModel", () => ({
  VendorProductModel: {
    aggregate: jest.fn().mockResolvedValue([]),
  },
}));
