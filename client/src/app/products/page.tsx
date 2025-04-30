import Link from "next/link";
import React from "react";
// import ProductCard from "../../componets/ProductCard";
import { Product } from "@/types";
import EmptyResourceState from "@/componets/EmptyResourceState";
import Table from "@/componets/Table";
import DeleteResourceButton from "@/componets/DeleteResource";
import Button from "@/componets/Button";

async function page() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  if (!response.ok) {
    new Error("Faild to fetch!");
  }

  const data = await response.json();
  const products = data.products as Product[];
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button href="/products/add" type="btnPrimary">
          Add New Product
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyResourceState
          addResource="/products/add"
          resourceName="product"
        />
      ) : (
        <div className="bg-white shadow rounded overflow-hidden">
          <Table headers={["Name", { value: "Actions", isCenter: true }]}>
            {products.map((product) => (
              <Table.Row key={product.id}>
                <Table.Col>
                  <div className="font-medium text-gray-900">
                    {product.name}
                  </div>
                </Table.Col>

                <Table.Col className="text-sm font-medium flex justify-center">
                  <Link
                    href={`/products/edit/${product.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                  <DeleteResourceButton
                    resourcePath="/products"
                    id={product.id}
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
