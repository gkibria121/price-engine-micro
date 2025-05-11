import { Schema, model, models } from "mongoose";

const PricingRuleMetaSchema = new Schema(
  {
    attribute: { type: String, required: true },
    default: { type: Number, required: false },
    values: [{ type: String, required: true }],
    inputType: { type: String, required: true },
    required: { type: Boolean, required: false },
    description: { type: String, required: false },
    hasOther: { type: String, required: false },
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

export default models.PricingRuleMeta ||
  model("PricingRuleMeta", PricingRuleMetaSchema);
