import React from "react";
import RadioBox from "./RadioBox";
import SelectionField from "./SelectionField";
import TextField from "./TextField";
import { useProductOrderFlow } from "@/contexts/prodouctOrderFlowContext";

function ProductSelectionForm({}) {
  const { pricingRuleOptions, vendorProducts } = useProductOrderFlow();
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
        />

        {/* Quantity */}
        <TextField label="Quantity" variant="stacked" placeholder="10" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pricingRuleOptions.map((rule) => (
          <RadioBox
            title={rule.attribute}
            required={rule.required}
            key={rule.attribute}
            description={rule.description}
          >
            {rule.values.map((option) => (
              <RadioBox.RadioInput label={option} key={option} />
            ))}
            {rule.hasOther && (
              <RadioBox.RadioInput label={"Other"} key={"other"} />
            )}
          </RadioBox>
        ))}
      </div>
    </>
  );
}

export default ProductSelectionForm;
