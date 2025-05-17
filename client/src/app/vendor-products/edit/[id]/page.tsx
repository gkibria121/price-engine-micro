import VendorProductForm from "@/componets/form/VendorProductForm";
import { getDeliverySlots } from "@/services/deliverySlots";
import { getProducts } from "@/services/productService";
import { getVendorProduct } from "@/services/vendorProductService";
import { getVendors } from "@/services/vendorService";
import { PageProps } from "@/types";

export default async function page({ params }: PageProps) {
  const { id } = await params;
  try {
    const products = await getProducts();

    const vendors = await getVendors();
    const deliveryMethods = await getDeliverySlots();

    const vendorProduct = await getVendorProduct(id);

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Update Vendor Product</h1>
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
