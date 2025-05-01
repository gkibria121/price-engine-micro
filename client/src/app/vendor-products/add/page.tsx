import VendorProductForm from "@/componets/form-components/VendorProductForm";
import { Product, Vendor } from "@/types";

export default async function AddProductPage() {
  const response1 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  const products = (await response1.json()).products as Product[];
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendors`);
  const vendors = (await response2.json()).vendors as Vendor[];
  const response3 = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/delivery-slots`
  );
  const deliveryMethods = await response3.json();
  console.log(deliveryMethods);
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
}
