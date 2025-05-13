import { Schema, model, models } from "mongoose";

const VendorProductSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  rating: { type: Number, required: true },
  pricingRules: [
    { type: Schema.Types.ObjectId, ref: "PricingRule", required: true },
  ],
  deliverySlots: [
    { type: Schema.Types.ObjectId, ref: "DeliverySlot", required: true },
  ],
  quantityPricings: [
    { type: Schema.Types.ObjectId, ref: "QuantityPricing", required: true },
  ],
  pricingRuleMetas: [
    { type: Schema.Types.ObjectId, ref: "PricingRuleMeta", required: false },
  ],
});
// Add toJSON transformation
VendorProductSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default models.VendorProduct ||
  model("VendorProduct", VendorProductSchema);
