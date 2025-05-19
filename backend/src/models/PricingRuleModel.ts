import { Schema, model, models } from "mongoose";

const PricingRuleSchema = new Schema(
  {
    attribute: String,
    value: String,
    price: Number,
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

export default models.PricingRule || model("PricingRule", PricingRuleSchema);
