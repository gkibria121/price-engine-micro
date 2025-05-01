"use client";

import { Product, Vendor, VendorProductFormType } from "@/types";
import { useFieldArray, useForm } from "react-hook-form";
import Button from "../Button";
import SelectionField from "./SelectionField";

interface ProductFormProps {
  isEdit?: boolean;
  products: Product[];
  vendors: Vendor[];
}

export default function VendorProductForm({
  products,
  vendors,
}: ProductFormProps) {
  const defaultValues: VendorProductFormType = {
    productId: "",
    vendorId: "",
    pricingRules: [{ attribute: "", value: "", price: 0 }],
    deliverySlots: [],
    quantityPricings: [{ quantity: 1, price: 0 }],
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { isLoading },
  } = useForm<VendorProductFormType>({
    defaultValues,
  });
  const {
    fields: quantityFields,
    append: appendQuantity,
    remove: removeQuantity,
  } = useFieldArray({ control, name: "quantityPricings" });
  const {
    fields: pricingFields,
    append: appendPricing,
    remove: removePricing,
  } = useFieldArray({ control, name: "pricingRules" });

  const onSubmit = async (data: VendorProductFormType) => {
    console.log(data);
  };
  const {
    fields: deliveryFields,
    append: appendDelivery,
    remove: removeDelivery,
  } = useFieldArray({ control, name: "deliverySlots" });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {
            <>
              <SelectionField
                label="Product"
                options={products.map((product) => ({
                  name: product.name,
                  value: product.id,
                }))}
                {...register("productId", {
                  required: "Vendor Product is required",
                })}
              />
              <SelectionField
                label="Vendor"
                options={vendors.map((vendor) => ({
                  name: vendor.name,
                  value: vendor.id,
                }))}
                {...register("vendorId", { required: "Vendor is required" })}
              />
            </>
          }
        </div>
      </div>

      {/* Pricing Rules */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Pricing Rules</h2>
          <button
            type="button"
            onClick={() =>
              appendPricing({ attribute: "", value: "", price: 0 })
            }
            className="text-blue-600 text-sm"
          >
            + Add Rule
          </button>
        </div>

        {pricingFields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-start border-b pb-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm">Attribute</label>
              <input
                {...register(`pricingRules.${index}.attribute` as const, {
                  required: "Required",
                })}
                className="w-full border rounded p-2"
                placeholder="e.g. color, size"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm">Value</label>
              <input
                {...register(`pricingRules.${index}.value` as const, {
                  required: "Required",
                })}
                className="w-full border rounded p-2"
                placeholder="e.g. red, large"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm">Price Adjustment</label>
              <input
                type="number"
                step="0.01"
                {...register(`pricingRules.${index}.price` as const, {
                  required: "Required",
                  valueAsNumber: true,
                })}
                className="w-full border rounded p-2"
              />
            </div>
            <button
              type="button"
              onClick={() => removePricing(index)}
              className="text-red-500 mt-6"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Delivery Rules */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Delivery Options</h2>
          <button
            type="button"
            onClick={() =>
              appendDelivery({
                label: "",
                price: 0,
                deliveryTimeStartDate: 0,
                deliveryTimeStartTime: "0:0",
                deliveryTimeEndDate: 0,
                deliveryTimeEndTime: "0:0",
                cutoffTime: "0:0",
              })
            }
            className="text-blue-600 text-sm"
          >
            + Add Option
          </button>
        </div>

        {deliveryFields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-4 border-b pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm">Label</label>
                <input
                  {...register(`deliverySlots.${index}.label` as const, {
                    required: "Required",
                  })}
                  className="w-full border rounded p-2"
                  placeholder="e.g. Standard, Express"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register(`deliverySlots.${index}.price` as const, {
                    required: "Required",
                    valueAsNumber: true,
                  })}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm">Start Date (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  {...register(
                    `deliverySlots.${index}.deliveryTimeStartDate` as const,
                    {
                      required: "Required",
                      valueAsNumber: true,
                    }
                  )}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">Start Time</label>
                <input
                  type="time"
                  {...register(
                    `deliverySlots.${index}.deliveryTimeStartTime` as const,
                    {
                      required: "Required",
                    }
                  )}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm">End Date (0-30)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  {...register(
                    `deliverySlots.${index}.deliveryTimeEndDate` as const,
                    {
                      required: "Required",
                      valueAsNumber: true,
                    }
                  )}
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm">End Time</label>
                <input
                  type="time"
                  {...register(
                    `deliverySlots.${index}.deliveryTimeEndTime` as const,
                    {
                      required: "Required",
                    }
                  )}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm">Cutoff Time</label>
              <input
                type="time"
                {...register(`deliverySlots.${index}.cutoffTime` as const, {
                  required: "Required",
                })}
                className="w-full border rounded p-2"
              />
            </div>

            <button
              type="button"
              onClick={() => removeDelivery(index)}
              className="text-red-500 mt-4"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {/* Quantity Pricing */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Quantity Pricing</h2>
          <button
            type="button"
            onClick={() => appendQuantity({ quantity: 1, price: 0 })}
            className="text-blue-600 text-sm"
          >
            + Add Tier
          </button>
        </div>

        {quantityFields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-start border-b pb-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm">Quantity</label>
              <input
                type="number"
                {...register(`quantityPricings.${index}.quantity` as const, {
                  required: "Required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1" },
                })}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm">Price Per Unit</label>
              <input
                type="number"
                step="0.01"
                {...register(`quantityPricings.${index}.price` as const, {
                  required: "Required",
                  valueAsNumber: true,
                })}
                className="w-full border rounded p-2"
              />
            </div>
            <button
              type="button"
              onClick={() => removeQuantity(index)}
              className="text-red-500 mt-6"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-start gap-4">
        <Button type="btnWhite" href="/vendors">
          Cancel
        </Button>
        <Button type="btnPrimary">{isLoading ? "Loading..." : "Submit"}</Button>
      </div>
    </form>
  );
}
