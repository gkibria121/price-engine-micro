import { Schema, model, models } from "mongoose";

const VendorSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
});

// Add toJSON transformation
VendorSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default models.Vendor || model("Vendor", VendorSchema);
