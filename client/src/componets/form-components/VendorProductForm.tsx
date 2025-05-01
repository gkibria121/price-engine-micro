"use client";

import { DeliverySlot, Product, Vendor, VendorProductFormType } from "@/types";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../Button";
import SelectionField from "./SelectionField";
import PricingRulesForm from "./PricingRulesForm";
import DeliveryRulesForm from "./DeliveryRulesForm";
import QuantityPricingsForm from "./QuantityPricingsForm";
import { toast } from "react-toastify";
import { setValidationErrors, wait } from "@/util/funcitons";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  isEdit?: boolean;
  products: Product[];
  vendors: Vendor[];
  deliveryMethods: DeliverySlot[];
}

export default function VendorProductForm({
  products,
  vendors,
  deliveryMethods,
}: ProductFormProps) {
  const router = useRouter();
  const defaultValues: VendorProductFormType = {
    productId: "",
    vendorId: "",
    pricingRules: [{ attribute: "", value: "", price: 0 }],
    deliverySlots: deliveryMethods || [],
    quantityPricings: [{ quantity: 1, price: 0 }],
  };
  const methods = useForm<VendorProductFormType>({
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { isLoading, errors },
  } = methods;

  const onSubmit = async (data: VendorProductFormType) => {
    console.log(data);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-products/store`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) {
      if (response.status === 422) {
        const data = await response.json();
        if (!data.errors) {
          toast(data.message, {
            type: "error",
          });
        } else {
          setValidationErrors(data.errors, setError);
        }
      } else {
        const data = await response.json();
        toast(data.message, {
          type: "error",
          autoClose: 1000,
        });
      }
    }
    toast("VendorProduct created successfully!", {
      type: "success",
      autoClose: 1000,
    });
    await wait(1.5);
    router.push("/vendor-products");
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
