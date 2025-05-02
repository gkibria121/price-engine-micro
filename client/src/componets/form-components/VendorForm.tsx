"use client";
import { useForm, useFieldArray } from "react-hook-form";
import TextField from "./TextField";
import Button from "../Button";
import { toast } from "react-toastify";
import { setValidationErrors, wait } from "@/util/funcitons";
import { useRouter } from "next/navigation";
import { Vendor } from "@/types";
import UploadCSV from "../UploadCSV";

interface VendorFormProps {
  vendor?: Vendor;
  isEdit?: boolean;
}

type VendorFormType = {
  vendors: {
    name: string;
    email: string;
    address: string;
    rating: number;
  }[];
};

export default function VendorForm({
  vendor,
  isEdit = false,
}: VendorFormProps) {
  const router = useRouter();

  const defaultValues: VendorFormType = {
    vendors: vendor
      ? [{ ...vendor }]
      : [
          {
            name: "",
            email: "",
            address: "",
            rating: 0,
          },
        ],
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VendorFormType>({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vendors",
  });

  const onSubmit = async (formData: VendorFormType) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendors/${
          isEdit && vendor ? vendor.id : "bulk-store"
        }`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: isEdit ? "PUT" : "POST",
          body: isEdit
            ? JSON.stringify(formData.vendors[0])
            : JSON.stringify({ vendors: formData.vendors }),
        }
      );

      if (!response.ok) {
        if (response.status === 422) {
          const data = await response.json();
          toast(data.message, {
            type: "error",
            autoClose: 1000,
          });

          setValidationErrors(data.errors, setError);
        } else {
          throw new Error("Something went wrong!");
        }
        return;
      }

      toast(`Vendors ${isEdit ? "updated" : "added"} successfully!`, {
        autoClose: 1000,
      });

      await wait(1.5);
      router.push("/vendors");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(error.message, { type: "error" });
      }
    }
  };

  function importVendors(vendorData: unknown[]) {
    const vendors = vendorData as Vendor[];
    if (
      vendors.some(
        (vendor) =>
          !vendor.address || !vendor.email || !vendor.name || !vendor.rating
      )
    ) {
      toast(
        "Invalid CSV format. Please provide CSV with name,rating,email,address",
        {
          type: "warning",
          autoClose: 3000,
        }
      );
      throw new Error(
        "Invalid CSV format. Please provide CSV with name,rating,email,address"
      );
    }
    const exsistingVendors = getValues("vendors");
    setValue("vendors", [...exsistingVendors, ...vendors]);
    console.log(vendors, exsistingVendors);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-4xl">
      {!isEdit && (
        <div className="flex justify-end">
          <UploadCSV handleFileUpload={importVendors} name="vendors" />
        </div>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="p-4 border rounded-md space-y-4 relative pt-9"
        >
          {fields.length > 1 && (
            <button
              type="button"
              className="absolute top-2 right-2 text-red-500"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          )}
          <TextField
            label="Vendor Name"
            error={errors.vendors?.[index]?.name?.message}
            {...register(`vendors.${index}.name`, {
              required: "Vendor name is required",
            })}
          />
          <TextField
            label="Email"
            type="email"
            error={errors.vendors?.[index]?.email?.message}
            {...register(`vendors.${index}.email`, {
              required: "Email is required",
            })}
          />
          <TextField
            label="Rating"
            type="number"
            step="0.1"
            error={errors.vendors?.[index]?.rating?.message}
            {...register(`vendors.${index}.rating`, {
              required: "Rating is required",
              min: { value: 0, message: "Rating must be greater than 0" },
            })}
          />
          <TextField
            label="Address"
            type="text"
            error={errors.vendors?.[index]?.address?.message}
            {...register(`vendors.${index}.address`, {
              required: "Address is required",
            })}
          />
        </div>
      ))}

      <div className="flex gap-4">
        <Button type="btnWhite" href="/vendors">
          Cancel
        </Button>
        {!isEdit && (
          <Button
            type="btnSecondary"
            buttonType="button"
            onClick={() =>
              append({
                name: "",
                email: "",
                address: "",
                rating: 0,
              })
            }
          >
            Add Vendor
          </Button>
        )}

        <Button type="btnPrimary" buttonType="submit">
          {isSubmitting
            ? "Loading..."
            : isEdit
            ? "Update Vendors"
            : "Submit Vendors"}
        </Button>
      </div>
    </form>
  );
}
