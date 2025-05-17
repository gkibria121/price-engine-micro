import Link from "next/link";
import React from "react";
// import ProductCard from "../../componets/ProductCard";
import EmptyResourceState from "@/componets/EmptyResourceState";
import Table from "@/componets/Table";
import DeleteResourceButton from "@/componets/DeleteResource";
import Button from "@/componets/Button";
import { getVendors } from "@/services/vendorService";

async function page() {
  const vendors = await getVendors();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vendors</h1>

        <Button type="btnPrimary" href="/vendors/add">
          Add New Vendors
        </Button>
      </div>

      {vendors.length === 0 ? (
        <EmptyResourceState addResource="/vendors/add" resourceName="vendors" />
      ) : (
        <div className="bg-white shadow rounded overflow-hidden">
          <Table
            headers={[
              "Name",
              "email",
              "address",
              "rating",
              { value: "Actions", isCenter: true },
            ]}
          >
            {vendors.map((vendor) => (
              <Table.Row key={vendor.id}>
                <Table.Col>
                  <div className="font-medium text-gray-900">{vendor.name}</div>
                </Table.Col>
                <Table.Col>{vendor.email}</Table.Col>
                <Table.Col>{vendor.address}</Table.Col>
                <Table.Col className="text-sm font-medium flex justify-center">
                  <Link
                    href={`/vendors/edit/${vendor.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                  <DeleteResourceButton
                    resourcePath="/vendors"
                    id={vendor.id}
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
