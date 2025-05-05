import React, { useEffect } from "react";
import RadioBox from "./RadioBox";
import SelectionField from "./SelectionField";
import TextField from "./TextField";
import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";
import { useFormContext, useFormState } from "react-hook-form";
import { ProductOrderFlowFormType } from "@/types";
import { getPricingRuleOptions } from "@/util/funcitons";

function ProductSelectionForm({}) {
  const { vendorProducts } = useProductOrderFlow();
  const { register, setValue, watch } =
    useFormContext<ProductOrderFlowFormType>();
  const { errors } = useFormState({
    name: ["product", "quantity", "pricingRules"],
  });
  const productId = watch("product");
  const pricingRuleOptions = getPricingRuleOptions(
    vendorProducts.find((vp) => vp.product.id === productId)
  );
  useEffect(() => {
    setValue("pricingRules", [
      ...pricingRuleOptions.map((pro) => ({
        attribute: pro.attribute,
        value: pro.values[pro.default],
      })),
    ]);
  }, [productId, pricingRuleOptions, setValue]);

  return (
    <>
      <div className="border-b border-b-[#D9DBE9] pb-2 mb-6">
        <h2 className="text-xl font-semibold">Product Selection</h2>
        <p className="text-gray-500 text-sm">
          To calculate the price, please select a product, specify the quantity,
          choose the desired attributes, and select a delivery method.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Product Type */}

        <SelectionField
          label="Product Type"
          options={vendorProducts.map((vp) => ({
            name: vp.product.name,
            value: vp.product.id,
          }))}
          {...register("product")}
          error={errors.product?.message?.toString()}
        />

        {/* Quantity */}
        <TextField
          label="Quantity"
          variant="stacked"
          placeholder="10"
          {...register("quantity", { valueAsNumber: true })}
          error={errors.quantity?.message?.toString()}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pricingRuleOptions.map((rule, index) => (
          <RadioBox
            title={rule.attribute}
            required={rule.required}
            key={rule.attribute}
            description={rule.description}
          >
            <input
              type="hidden"
              {...register(`pricingRules.${index}.attribute`)}
              value={rule.attribute}
            />
            {rule.values.map((option) => (
              <RadioBox.RadioInput
                label={option}
                key={option}
                value={option}
                {...register(`pricingRules.${index}.value`)}
              />
            ))}
            {rule.hasOther && (
              <RadioBox.RadioInput
                value={"others"}
                label={"Other"}
                key={"other"}
              />
            )}
          </RadioBox>
        ))}
      </div>
    </>
  );
}

export default ProductSelectionForm;
