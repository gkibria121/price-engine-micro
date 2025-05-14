import React, { useEffect } from "react";
import Loading from "../Loading";
import { useProductOrderFlow } from "@/hooks/useProductOrderFlow";
import { ProductOrderFlowFormType } from "@/types";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import TextFieldWithSuggestion from "../TextFieldWithSuggestion";
import RadioBox from "./RadioBox";
import TextField from "./TextField";
import { getMatchedVendorProducts } from "@/services/vendorProductService";

function ProductAttributeSelection() {
  const {
    vendorProducts,
    pricingRuleMetas,
    isProductLoading,
    products,
    deliverySlots,
    setLoading,
    setPricingRuleMetas,
  } = useProductOrderFlow();
  const { register, setValue, getValues, control } =
    useFormContext<ProductOrderFlowFormType>();
  const { errors } = useFormState({
    name: ["product", "quantity", "pricingRules"],
  });
  const productId = useWatch({ control: control, name: "product" });
  const quantityPricings =
    vendorProducts.find((vp) => vp.product.id === productId)
      ?.quantityPricings ?? [];

  const pricingRulesValues = useWatch({
    control,
    name: "pricingRules",
  });

  useEffect(() => {
    let isMounted = true;
    let loadingTimeout: NodeJS.Timeout;

    const fetchPricingRuleMetas = async () => {
      // Delay showing loader to avoid flicker
      loadingTimeout = setTimeout(() => {
        if (isMounted) setLoading(true);
      }, 200); // adjust threshold to your UX preference

      try {
        const productId = getValues("product");
        const deliverySlotLabel = getValues("deliveryMethod.label");
        const deliverySlot = deliverySlots.find(
          (ds) => ds.label === deliverySlotLabel
        );

        const vendorProducts = await getMatchedVendorProducts(
          productId,
          deliverySlot
        );

        if (isMounted) {
          setPricingRuleMetas(vendorProducts[0]?.pricingRuleMetas ?? []);
        }
      } catch (err) {
        console.error("Failed to fetch pricing rule metas:", err);
        if (isMounted) setPricingRuleMetas([]);
      } finally {
        clearTimeout(loadingTimeout);
        if (isMounted) setLoading(false);
      }
    };

    fetchPricingRuleMetas();

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
    };
  }, [setPricingRuleMetas, getValues, deliverySlots, setLoading]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Product Type */}

        <TextField
          label="Product"
          variant="stacked"
          readonly={true}
          defaultValue={
            products.find((product) => product.id === productId).name
          }
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

      {isProductLoading && (
        <div className="flex w-full  justify-center items-center h-[50vh]">
          <Loading radius={24} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!isProductLoading &&
          pricingRuleMetas.map((rule, index) => {
            const value = pricingRulesValues?.[index]?.value;
            const showOther = value === "other";
            return (
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
                        error={
                          errors.pricingRules?.[index]?.otherValue?.message
                        }
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
