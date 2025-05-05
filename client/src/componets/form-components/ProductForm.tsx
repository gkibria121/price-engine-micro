"use client";
import { useForm } from "react-hook-form";
import Button from "../Button";
import TextField from "./TextField";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { setValidationErrors, wait } from "@/util/funcitons";
import { Product } from "@/types";
import UploadCSV from "../UploadCSV";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@daynightprint/shared";

type ProductFormType = Omit<Product, "id">;
type props = {
  isEdit?: boolean;
  product?: Product;
};
export default function ProductForm({ isEdit = false, product }: props) {
  const defaultValues: Omit<Product, "id"> = product || {
    name: "",
  };
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isLoading },
  } = useForm<ProductFormType>({
    defaultValues,
    resolver: zodResolver(productSchema.omit({ id: true })),
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
  const uploadBulk = async (productData: unknown[]) => {
    const products = productData as Partial<Product>[];

    const isError = products.some(
      (product) => !product.name || Object.keys(product).length !== 1
    );
    if (isError) {
      toast("Invalid CSV format. Please provide CSV with only name", {
        type: "warning",
        autoClose: 3000,
      });
      return;
    }

    const respone = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/bulk-upload`,
      {
        method: "POST",
        body: JSON.stringify({ products }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!respone.ok) {
      if (respone.status === 422) {
        const data = await respone.json();

        setValidationErrors(data.errors, undefined, toast, "toast");
      } else {
        toast("Something went wrong!", {
          type: "error",
        });
        throw new Error("Something went wrong!");
      }
    }
    const data = await respone.json();
    toast(data.message, {
      type: "success",
    });
  };

  return (
    <>
      <div className="flex justify-end">
        <UploadCSV name="prodcuts" handleFileUpload={uploadBulk} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="name"
              error={errors.name?.message}
              {...register("name")}
            />
          </div>
        </div>

        <div className="flex justify-start gap-4">
          <Button type="btnWhite" href="/products">
            Cancel
          </Button>
          <Button type="btnPrimary">
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </form>
    </>
  );
}
