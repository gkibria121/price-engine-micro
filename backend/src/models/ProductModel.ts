import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true, unique: true },
});
ProductSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default models.Product || model("Product", ProductSchema);
