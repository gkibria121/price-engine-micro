"use client";

import {
  DeliverySlot,
  Product,
  Vendor,
  VendorProduct,
  VendorProductFormType,
} from "@/types";
import {
  FormProvider,
  useFieldArray,
  UseFieldArrayAppend,
  useForm,
  useFormContext,
} from "react-hook-form";
import Button from "../Button";
import SelectionField from "./SelectionField";
import PricingRulesForm from "./PricingRulesForm";
import DeliveryRulesForm from "./DeliveryRulesForm";
import QuantityPricingsForm from "./QuantityPricingsForm";
import { toast } from "react-toastify";
import { setValidationErrors, wait } from "@/util/funcitons";
import { useRouter } from "next/navigation";
import TextField from "./TextField";
import VendorProductCSVImport from "./VendorProductCSVImport";
import { z } from "zod";
import {
  deliverySlotSchem,
  VendorProductFormSchema,
} from "@daynightprint/shared";
import { zodResolver } from "@hookform/resolvers/zod";

interface ProductFormProps {
  isEdit?: boolean;
  products: Product[];
  vendors: Vendor[];
  deliveryMethods: z.infer<typeof deliverySlotSchem>[];
  vendorProduct?: VendorProduct;
  readonly?: boolean;
}

export default function VendorProductForm({
  products,
  vendors,
  isEdit = false,
  vendorProduct,
  readonly = false,
  deliveryMethods,
}: ProductFormProps) {
  const router = useRouter();
  const defaultValues = async (): Promise<VendorProductFormType> => {
    if (isEdit && vendorProduct)
      return {
        vendorProducts: [
          {
            productId: vendorProduct.product.id,
            vendorId: vendorProduct.vendor.id,
            deliverySlots: vendorProduct.deliverySlots,
            pricingRules: vendorProduct.pricingRules,
            quantityPricings: vendorProduct.quantityPricings,
          },
        ],
      };
    return {
      vendorProducts: [
        {
          productId: "",
          vendorId: "",
          pricingRules: [
            { attribute: "", value: "", price: 0, isDefault: false },
          ],
          deliverySlots: deliveryMethods,
          quantityPricings: [{ quantity: 1, price: 0 }],
        },
      ],
    };
  };

  const methods = useForm<VendorProductFormType>({
    defaultValues,
    resolver: zodResolver(VendorProductFormSchema),
  });
  const { handleSubmit, setError, setValue, control } = methods;

  const {
    fields: vendorProducts,
    append: appendVendorProcuts,
    remove: removeVendorProducts,
  } = useFieldArray({ control, name: "vendorProducts" });
  const onSubmit = async (data: VendorProductFormType) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-products/${
        isEdit ? vendorProduct?.id : "bulk-store"
      }`,
      {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: isEdit
          ? JSON.stringify(data.vendorProducts[0])
          : JSON.stringify(data),
      }
    );
    if (!response.ok) {
      if (response.status === 422) {
        const data = await response.json();
        toast(data.message, {
          type: "error",
        });
        if (!data.errors) {
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
      return;
    }
    toast(`VendorProduct ${isEdit ? "updated" : "created"} successfully!`, {
      type: "success",
      autoClose: 1000,
    });
    await wait(1.5);
    router.push("/vendor-products");
  };

  return (
    <FormProvider {...methods}>
      {!isEdit && !readonly && (
        <VendorProductCSVImport
          products={products}
          vendors={vendors}
          setVendorsValue={setValue}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {vendorProducts.map((vendorProductField, index) => (
          <div key={vendorProductField.id ?? index} className="relative">
            <VendorProductBasicInfo
              products={products}
              vendorProduct={vendorProduct}
              vendors={vendors}
              readonly={readonly}
              index={index}
            />
            {vendorProducts.length > 1 && (
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500"
                onClick={() => removeVendorProducts(index)}
              >
                Remove
              </button>
            )}

            {/* Pricing Rules */}
            <PricingRulesForm readonly={readonly} formIndex={index} />
            {/* Delivery Rules */}
            <DeliveryRulesForm readonly={readonly} formIndex={index} />

            {/* Quantity Pricing */}
            <QuantityPricingsForm readonly={readonly} formIndex={index} />
          </div>
        ))}
        <VendorProductFormActions
          appendVendorProcuts={appendVendorProcuts}
          deliveryMethods={deliveryMethods}
          isEdit={isEdit}
        />
      </form>
    </FormProvider>
  );
}

function VendorProductFormActions({
  readonly = undefined,
  isEdit = undefined,
  deliveryMethods,
  appendVendorProcuts,
}: {
  readonly?: boolean;
  isEdit?: boolean;
  deliveryMethods: DeliverySlot[];
  appendVendorProcuts: UseFieldArrayAppend<
    VendorProductFormType,
    "vendorProducts"
  >;
}) {
  const {
    formState: { isSubmitting },
  } = useFormContext<VendorProductFormType>();
  return readonly ? (
    <Button type="btnPrimary" href="/vendor-products">
      Back
    </Button>
  ) : (
    <div className="flex justify-start gap-4">
      <Button type="btnWhite" href="/vendor-products">
        Cancel
      </Button>
      <Button type="btnPrimary">
        {isSubmitting ? "Loading..." : "Submit"}
      </Button>
      {!isEdit && (
        <Button
          type="btnSecondary"
          buttonType="button"
          onClick={() =>
            appendVendorProcuts({
              productId: "",
              vendorId: "",
              pricingRules: [{ attribute: "", value: "", price: 0 }],
              deliverySlots: deliveryMethods,
              quantityPricings: [{ quantity: 1, price: 0 }],
            })
          }
        >
          Add Vendor Product
        </Button>
      )}
    </div>
  );
}

function VendorProductBasicInfo({
  readonly = false,
  vendorProduct,
  vendors,
  index,
  products,
}: {
  readonly?: boolean;
  vendorProduct?: VendorProduct;
  index: number;
  products: Product[];
  vendors: Vendor[];
}) {
  const {
    formState: { errors },
    register,
  } = useFormContext<VendorProductFormType>();
  return (
    <div className="space-y-4 ">
      <h2 className="text-xl font-semibold">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {readonly && vendorProduct ? (
          <>
            <TextField
              label="Product Name"
              readonly={readonly}
              defaultValue={vendorProduct.product.name}
            />
            <TextField
              label="Vendor Name"
              readonly={readonly}
              defaultValue={vendorProduct.vendor.name}
            />
          </>
        ) : (
          <>
            <SelectionField
              label="Product"
              error={errors.vendorProducts?.[index]?.productId?.message}
              options={products.map((product) => ({
                name: product.name,
                value: product.id,
              }))}
              {...register(`vendorProducts.${index}.productId`)}
            />
            <SelectionField
              label="Vendor"
              error={errors.vendorProducts?.[index]?.vendorId?.message}
              options={vendors.map((vendor) => ({
                name: vendor.name,
                value: vendor.id,
              }))}
              {...register(`vendorProducts.${index}.vendorId`)}
            />
          </>
        )}
      </div>
    </div>
  );
}
