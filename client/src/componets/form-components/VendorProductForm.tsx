"use client";

import { Product, Vendor, VendorProductFormType } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../Button";
import SelectionField from "./SelectionField";
import PricingRulesForm from "./PricingRulesForm";
import DeliveryRulesForm from "./DeliveryRulesForm";
import QuantityPricingsForm from "./QuantityPricingsForm";

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
  const methods = useForm<VendorProductFormType>({
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    formState: { isLoading, errors },
  } = methods;

  const onSubmit = async (data: VendorProductFormType) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {
              <>
                <SelectionField
                  label="Product"
                  error={errors.productId?.message}
                  options={products.map((product) => ({
                    name: product.name,
                    value: product.id,
                  }))}
                  {...register("productId", {
                    required: "Please select a product",
                  })}
                />
                <SelectionField
                  label="Vendor"
                  error={errors.vendorId?.message}
                  options={vendors.map((vendor) => ({
                    name: vendor.name,
                    value: vendor.id,
                  }))}
                  {...register("vendorId", {
                    required: "Please select a vendor",
                  })}
                />
              </>
            }
          </div>
        </div>
        {/* Pricing Rules */}
        <PricingRulesForm />
        {/* Delivery Rules */}
        <DeliveryRulesForm />

        {/* Quantity Pricing */}
        <QuantityPricingsForm />

        <div className="flex justify-start gap-4">
          <Button type="btnWhite" href="/vendors">
            Cancel
          </Button>
          <Button type="btnPrimary">
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
