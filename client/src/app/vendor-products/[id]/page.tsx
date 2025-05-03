import VendorProductForm from "@/componets/form-components/VendorProductForm";
import { getDeliverySlots } from "@/services/deliverySlots";
import { getProducts } from "@/services/productService";
import { getVendors } from "@/services/vendorService";
import { PageProps, VendorProduct } from "@/types";

export default async function page({ params }: PageProps) {
  const { id } = await params;
  try {
    const vendorProductRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/vendor-products/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!vendorProductRes.ok) {
      throw new Error("Vendor Product failed to fetch.");
    }

    const vendorProductData = await vendorProductRes.json();

    const products = await getProducts();
    const vendors = await getVendors();
    const vendorProduct = vendorProductData.vendorProduct as VendorProduct;
    const deliveryMethods = await getDeliverySlots();

    return (
      <div>
        <VendorProductForm
          products={products}
          readonly={true}
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
