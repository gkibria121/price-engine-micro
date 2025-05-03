import VendorProductForm from "@/componets/form-components/VendorProductForm";
import { getDeliverySlots } from "@/services/deliverySlots";
import { getProducts } from "@/services/productService";
import { getVendors } from "@/services/vendorService";
export const dynamic = "force-dynamic";

export default async function AddProductPage() {
  try {
    const products = await getProducts();
    const vendors = await getVendors();
    const deliveryMethods = await getDeliverySlots();

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Add New Vendor Product</h1>
        <VendorProductForm
          products={products}
          vendors={vendors}
          deliveryMethods={deliveryMethods}
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
