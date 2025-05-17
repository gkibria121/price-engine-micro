import React from "react";
import SelectionField from "./SelectionField";
import { useProductOrderFlow } from "@/hooks/useProductOrderFlow";
import { useFormContext, useFormState } from "react-hook-form";
import { ProductOrderFlowFormType } from "@/types";
import Loading from "../Loading";
function ProductSelectionForm({}) {
  const { products, isLoading } = useProductOrderFlow();
  const { register } = useFormContext<ProductOrderFlowFormType>();
  const { errors } = useFormState({
    name: ["product"],
  });
  return (
    <>
      <div className="border-b border-b-[#D9DBE9] pb-2 mb-6">
        <h2 className="text-xl font-semibold">Product Selection</h2>
        <p className="text-gray-500 text-sm">
          To calculate the price, please select a product,select a delivery
          method, specify the quantity, choose the desired attributes
        </p>
      </div>
      <div className="">
        {/* Product Type */}

        <SelectionField
          label="Product Type"
          options={products.map((product) => ({
            name: product.name,
            value: product.id,
          }))}
          {...register("product")}
          error={errors.product?.message?.toString()}
        />
      </div>{" "}
      {isLoading && (
        <div className="w-full   flex justify-center items-center min-h-[20vh] ">
          <Loading radius={40} />
        </div>
      )}
    </>
  );
}

export default ProductSelectionForm;
