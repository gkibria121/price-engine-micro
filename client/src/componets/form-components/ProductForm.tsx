"use client";
import { useForm } from "react-hook-form";
import Button from "../Button";
import TextField from "./TextField";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { wait } from "@/util/funcitons";
import { Product } from "@/types";

type ProductFormType = {
  name: string;
};
type props = {
  isEdit?: boolean;
  product?: Product;
};
export default function ProductForm({ isEdit = false, product }: props) {
  const defaultValues: Partial<Product> = product || {
    name: "",
  };
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isLoading },
  } = useForm<ProductFormType>({
    defaultValues,
  });
  const router = useRouter();

  const onSubmit = async (data: ProductFormType) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products${
          isEdit ? "/" + product?.id : ""
        }`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 422) {
          setError("name", {
            type: "custom",
            message: errorData.message,
          });
        } else {
          throw new Error(errorData.message || "Something went wrong!");
        }
        return;
      }

      toast(`Product ${isEdit ? "updated" : "created"} successfully!`, {
        type: "success",
        autoClose: 1000,
      });
      await wait(1.5);
      router.push("/products");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(error.message, { type: "error" });
      } else {
        toast("An unknown error occurred.", { type: "error" });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="name"
            error={errors.name?.message}
            {...register("name", { required: "Product name is required" })}
          />
        </div>
      </div>

      <div className="flex justify-start gap-4">
        <Button type="btnWhite" href="/products">
          Cancel
        </Button>
        <Button type="btnPrimary">{isLoading ? "Loading..." : "Submit"}</Button>
      </div>
    </form>
  );
}
