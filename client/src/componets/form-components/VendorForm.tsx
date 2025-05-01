"use client";
import { useForm } from "react-hook-form";
import TextField from "./TextField";
import Button from "../Button";
import { toast } from "react-toastify";
import { setValidationErrors, wait } from "@/util/funcitons";
import { useRouter } from "next/navigation";

interface VendorFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}
type VendorFormType = {
  name: string;
  email: string;
  address: string;
  rating: 0;
};
export default function VendorForm({}: VendorFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isLoading },
  } = useForm<VendorFormType>({
    defaultValues: {
      name: "",
      email: "",
      address: "",
      rating: 0,
    },
  });

  const onSubmit = async (data: VendorFormType) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/vendors/store`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        if (response.status === 422) {
          const data = await response.json();

          setValidationErrors<VendorFormType>(data.errors, setError);
        } else {
          throw new Error("Something went wrong!");
        }
        return;
      }
      toast("Vendor added sucessfullly!", {
        autoClose: 1000,
      });

      await wait(1.5);

      router.push("/vendors");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(error.message, {
          type: "error",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <TextField
        label="Vendor Name"
        error={errors.name?.message}
        {...register("name", { required: "Vendor name is required" })}
      />
      <TextField
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
        })}
      />
      <TextField
        label="Rating"
        type="number"
        error={errors.rating?.message}
        {...register("rating", {
          required: "Rating is required",
          min: {
            value: 0,
            message: "Rating must be greater than 0",
          },
        })}
      />
      <TextField
        label="address"
        error={errors.address?.message}
        type="text"
        {...register("address", {
          required: "Address is required",
          min: {
            value: 0,
            message: "Rating must be greater then 0",
          },
        })}
      />

      <div className="flex justify-start gap-4">
        <Button type="btnWhite" href="/products">
          Cancel
        </Button>
        <Button type="btnPrimary">{isLoading ? "Loading..." : "Submit"}</Button>
      </div>
    </form>
  );
}
