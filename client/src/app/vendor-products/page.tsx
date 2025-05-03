import Link from "next/link";
import React from "react";
import EmptyResourceState from "@/componets/EmptyResourceState";
import Table from "@/componets/Table";
import DeleteResourceButton from "@/componets/DeleteResource";
import Button from "@/componets/Button";
import { getVendorProducts } from "@/services/vendorProductService";

async function page() {
  const vendorProducts = await getVendorProducts();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button href="/vendor-products/add" type="btnPrimary">
          Add New Vendor Product
        </Button>
      </div>

      {vendorProducts.length === 0 ? (
        <EmptyResourceState
          addResource="/products/add"
          resourceName="product"
        />
      ) : (
        <div className="bg-white shadow rounded overflow-hidden">
          <Table
            headers={[
              "Product",
              "Vendor",
              { value: "Actions", isCenter: true },
            ]}
          >
            {vendorProducts.map((vendorProduct) => (
              <Table.Row key={vendorProduct.id}>
                <Table.Col>
                  <div className="font-medium text-gray-900">
                    {vendorProduct.product.name}
                  </div>
                </Table.Col>
                <Table.Col>
                  <div className="font-medium text-gray-900">
                    {vendorProduct.vendor.name}
                  </div>
                </Table.Col>
                <Table.Col className="text-sm font-medium flex justify-center">
                  <Link
                    href={`/vendor-products/${vendorProduct.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    View
                  </Link>
                  <Link
                    href={`/vendor-products/edit/${vendorProduct.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                  <DeleteResourceButton
                    resourcePath="/vendor-products"
                    id={vendorProduct.id}
                  />
                </Table.Col>
              </Table.Row>
            ))}
          </Table>
        </div>
      )}
    </div>
  );
}

export default page;
