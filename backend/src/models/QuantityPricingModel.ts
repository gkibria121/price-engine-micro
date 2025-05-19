import { Schema, model, models } from "mongoose";

const QuantityPricingSchema = new Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export default models.QuantityPricing ||
  model("QuantityPricing", QuantityPricingSchema);
