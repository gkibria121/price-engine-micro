import { Product, Vendor, VendorProduct, VendorProductFormType } from "@/types";
import { useFormContext } from "react-hook-form";
import TextField from "./TextField";
import SelectionField from "./SelectionField";

export default function VendorProductBasicInfo({
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
            <TextField
              label="Rating"
              readonly={readonly}
              type="number"
              defaultValue={vendorProduct.rating}
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
            <TextField
              label="Rating"
              error={errors.vendorProducts?.[index]?.rating?.message}
              type="number"
              defaultValue={0}
              {...register(`vendorProducts.${index}.rating`, {
                valueAsNumber: true,
              })}
            />
          </>
        )}
      </div>
    </div>
  );
}
