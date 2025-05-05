import { Schema, model, models } from "mongoose";

const PricingRuleSchema = new Schema({
  attribute: String,
  value: String,
  price: Number,
  isDefault: {
    require: false,
    default: false,
    type: Boolean,
  },
});

export default models.PricingRule || model("PricingRule", PricingRuleSchema);
