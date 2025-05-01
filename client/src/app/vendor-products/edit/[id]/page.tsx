import VendorProductForm from "@/componets/form-components/VendorProductForm";
import { Product, Vendor, VendorProduct } from "@/types";

type PageProps = {
  params: { id: string };
};
export default async function page({ params }: PageProps) {
  const { id } = await params;
  try {
    const [vendorProductRes, productsRes, vendorsRes, deliveryRes] =
      await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor-products/${id}`, {
          cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors`, {
          cache: "no-store",
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-slots`, {
          cache: "no-store",
        }),
      ]);

    if (
      !vendorProductRes.ok ||
      !productsRes.ok ||
      !vendorsRes.ok ||
      !deliveryRes.ok
    ) {
      throw new Error("One or more API responses failed.");
    }

    const productsData = await productsRes.json();
    const vendorsData = await vendorsRes.json();
    const deliveryData = await deliveryRes.json();

    const vendorProductData = await vendorProductRes.json();
    const products = productsData.products as Product[];
    const vendors = vendorsData.vendors as Vendor[];
    const vendorProduct = vendorProductData.vendorProduct as VendorProduct;
    const deliveryMethods = deliveryData;

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Add New Vendor Product</h1>
        <VendorProductForm
          products={products}
          vendors={vendors}
          vendorProduct={vendorProduct}
          deliveryMethods={deliveryMethods}
          isEdit={true}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading form data:", error);
    return (
      <p className="text-red-500">
        Failed to load form data. Please try again later.
      </p>
    );
  }
}
