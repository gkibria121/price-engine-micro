import React, { useEffect } from "react";
import { useProductOrderFlow } from "@/hooks/useProductOrderFlow";
import { ProductOrderFlowFormType } from "@/types";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import TextFieldWithSuggestion from "../TextFieldWithSuggestion";
import RadioBox from "./RadioBox";
import TextField from "./TextField";
import { getMatchedVendorProducts } from "@/services/vendorProductService";
import { useAsyncEffect } from "@/hooks/useAsyncEffect";
import Loading from "../Loading";

function ProductAttributeSelection() {
  const {
    deliverySlots,
    setLoading,
    setPricingRuleMetas,
    setVendorProduct,
    vendorProduct,
    isLoading,
  } = useProductOrderFlow();
  const { register, setValue, getValues, control } =
    useFormContext<ProductOrderFlowFormType>();
  const { errors } = useFormState({
    name: ["product", "quantity", "pricingRules"],
  });
  const quantityPricings = vendorProduct?.quantityPricings ?? [];
  const pricingRuleMetas = vendorProduct?.pricingRuleMetas ?? [];

  useEffect(() => {
    if (!vendorProduct) {
      return;
    }
    const pricingRuleMetas = vendorProduct.pricingRuleMetas.map((rule) => ({
      attribute: rule.attribute,
      value: rule.values[rule.default],
    }));
    setValue("pricingRules", pricingRuleMetas);
  }, [vendorProduct, setValue]);
  const pricingRulesValues = useWatch({
    control,
    name: "pricingRules",
  });
  useAsyncEffect({
    asyncFn: async () => {
      const productId = getValues("product");
      const deliverySlotLabel = getValues("deliveryMethod.label");
      const deliverySlot = deliverySlots.find(
        (ds) => ds.label === deliverySlotLabel
      );

      const vendorProducts = await getMatchedVendorProducts(
        productId,
        deliverySlot
      );

      return vendorProducts[0];
    },
    onSuccess: (data) => {
      setVendorProduct(data);
    },

    deps: [setPricingRuleMetas, getValues, deliverySlots, setLoading],
    onError: () => console.error("Something went wrong!"),
    setLoading,
  });
  console.log(isLoading);
  if (isLoading)
    return (
      <div className="w-full   flex justify-center items-center h-[60vh]">
        <Loading radius={40} />
      </div>
    );
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Product Type */}

        <TextField
          label="Product"
          variant="stacked"
          readonly={true}
          defaultValue={vendorProduct?.product?.name}
        />
        {/* Quantity */}
        <TextFieldWithSuggestion
          label="Quantity"
          placeholder="10"
          onSuggestionClick={(value) => {
            setValue("quantity", parseInt(value));
          }}
          {...register("quantity", { valueAsNumber: true })}
          options={quantityPricings.map((qp) => ({
            label: qp.quantity,
            value: qp.quantity,
          }))}
          error={errors.quantity?.message?.toString()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pricingRuleMetas.map((rule, index) => {
          const value = pricingRulesValues?.[index]?.value;
          const showOther = value === "other";
          return (
            <RadioBox
              title={rule.attribute}
              required={rule.required}
              key={index}
              description={rule.description}
            >
              <input
                type="hidden"
                {...register(`pricingRules.${index}.attribute`)}
                value={rule.attribute}
              />
              {rule.values.map((option, idx) => (
                <RadioBox.RadioInput
                  label={option}
                  key={idx}
                  value={option}
                  {...register(`pricingRules.${index}.value`)}
                />
              ))}

              {rule.hasOther && (
                <>
                  <RadioBox.RadioInput
                    label="Other"
                    value="other"
                    {...register(`pricingRules.${index}.value`)}
                  />

                  <div
                    className={`  w-full overflow-hidden transition-all duration-500 ease-in-out ${
                      showOther ? "max-h-[100px] py-2" : "max-h-0 py-0"
                    }`}
                  >
                    <TextField
                      placeholder={rule.values[0].replace(/\(.*?\)/g, "")}
                      {...register(`pricingRules.${index}.otherValue`, {
                        required: "This field cannot be empty",
                      })}
                      error={errors.pricingRules?.[index]?.otherValue?.message}
                    />
                  </div>
                </>
              )}
            </RadioBox>
          );
        })}
      </div>
    </div>
  );
}

export default ProductAttributeSelection;
