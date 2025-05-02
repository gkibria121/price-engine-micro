import React, { useState } from "react";
import UploadCSV from "../UploadCSV";
import Button from "../Button";
import { useForm, UseFormSetValue } from "react-hook-form";
import { Product, Vendor, VendorProductFormType } from "@/types";
import { toast } from "react-toastify";
import FieldError from "./FieldError";
type ProductNameWithVendorEmail = {
  product_name: string;
  vendor_email: string;
};

type VendorCSVFormType = {
  pricingRules: (VendorProductFormType["vendorProducts"][number]["pricingRules"][number] &
    ProductNameWithVendorEmail)[];
  deliverySlots: (VendorProductFormType["vendorProducts"][number]["deliverySlots"][number] &
    ProductNameWithVendorEmail)[];
  quantityPricings: (VendorProductFormType["vendorProducts"][number]["quantityPricings"][number] &
    ProductNameWithVendorEmail)[];
};

export function extractUniqueVendorProductIdentifiers(
  combinedData: { product_name: string; vendor_email: string }[]
) {
  return combinedData.reduce(
    (acc: { product_name: string; vendor_email: string }[], curr) => {
      if (
        !acc.some(
          (el) =>
            el.vendor_email === curr.vendor_email &&
            el.product_name === curr.product_name
        )
      ) {
        acc.push(curr);
      }
      return acc;
    },
    []
  );
}
function VendorProductCSVImport({
  products,
  vendors,
  setVendorsValue,
}: {
  products: Product[];
  vendors: Vendor[];
  setVendorsValue: UseFormSetValue<VendorProductFormType>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const {
    setValue,
    setError,
    clearErrors,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorCSVFormType>({});
  const handlePricingRuleImport = (pricingRuleData: unknown[]) => {
    const pricingRules = pricingRuleData as VendorCSVFormType["pricingRules"];
    for (const pricingRule of pricingRules) {
      if (
        pricingRule.attribute &&
        pricingRule.price &&
        pricingRule.product_name &&
        pricingRule.value &&
        pricingRule.vendor_email
      ) {
        continue;
      }
      toast(
        "Inavlid CSV format, Please import csv with attribute,value,price,product_name,vendor_email",
        {
          type: "warning",
          autoClose: 1000,
        }
      );
      setError("pricingRules", {
        type: "custom",
        message:
          "Import csv with attribute, value, price, product_name, vendor_email",
      });
      return;
    }
    clearErrors("pricingRules");
    setValue("pricingRules", pricingRules);
  };
  const handleDeliveryRuleImport = (pricingRuleData: unknown[]) => {
    const deliverySlots = pricingRuleData as VendorCSVFormType["deliverySlots"];
    for (const deliverySlot of deliverySlots) {
      if (
        deliverySlot.cutoffTime &&
        deliverySlot.deliveryTimeEndDate !== undefined &&
        deliverySlot.deliveryTimeEndTime &&
        deliverySlot.deliveryTimeStartDate !== undefined &&
        deliverySlot.deliveryTimeStartTime &&
        deliverySlot.label &&
        deliverySlot.price &&
        deliverySlot.product_name &&
        deliverySlot.vendor_email
      ) {
        continue;
      }
      toast("Inavlid CSV format for delierySlots", {
        type: "warning",
        autoClose: 1000,
      });
      setError("deliverySlots", {
        type: "custom",
        message:
          "Import csv with label, price, deliveryTimeStartDate, deliveryTimeStartTime, deliveryTimeEndDate, deliveryTimeEndTime, cutoffTime, product_name, vendor_email",
      });
      return;
    }
    clearErrors("deliverySlots");
    setValue("deliverySlots", deliverySlots);
  };
  const handlePiceQuanityImport = (quantityPricingsData: unknown[]) => {
    const quantityPricings =
      quantityPricingsData as VendorCSVFormType["quantityPricings"];
    for (const quantityPricing of quantityPricings) {
      if (
        quantityPricing.price &&
        quantityPricing.quantity !== undefined &&
        quantityPricing.product_name &&
        quantityPricing.vendor_email
      ) {
        continue;
      }
      toast("Inavlid CSV format for quantityPricings", {
        type: "warning",
        autoClose: 1000,
      });
      setError("quantityPricings", {
        type: "custom",
        message: "Import csv with quantity,price,product_name,vendor_email",
      });
      return;
    }
    clearErrors("quantityPricings");
    setValue("quantityPricings", quantityPricings);
  };

  const pricingRules = getValues("pricingRules");
  const deliverySlots = getValues("deliverySlots");
  const quantityPricings = getValues("quantityPricings");

  const onSubmit = () => {
    if (
      !pricingRules?.length ||
      !deliverySlots?.length ||
      !pricingRules?.length
    ) {
      toast("Please import necessary files", {
        type: "info",
        autoClose: 2000,
      });
      return;
    }

    const combinedData = [
      ...pricingRules,
      ...deliverySlots,
      ...quantityPricings,
    ];
    const vendorProductIdentifiers =
      extractUniqueVendorProductIdentifiers(combinedData);
    const vendorProducts = [] as VendorProductFormType["vendorProducts"];

    for (const id of vendorProductIdentifiers) {
      const product = products.find((el) => el.name === id.product_name);
      const vendor = vendors.find((el) => el.email === id.vendor_email);
      const productPricingRules = pricingRules.filter(
        (rule) =>
          rule.product_name === id.product_name &&
          rule.vendor_email === id.vendor_email
      );

      const productDeliverySlots = deliverySlots.filter(
        (slot) =>
          slot.product_name === id.product_name &&
          slot.vendor_email === id.vendor_email
      );

      const productQuantityPricings = quantityPricings.filter(
        (pricing) =>
          pricing.product_name === id.product_name &&
          pricing.vendor_email === id.vendor_email
      );

      vendorProducts.push({
        productId: product?.id ?? "",
        vendorId: vendor?.id ?? "",
        pricingRules: productPricingRules,
        deliverySlots: productDeliverySlots,
        quantityPricings: productQuantityPricings,
      });
    }

    setVendorsValue("vendorProducts", vendorProducts);
    closeModal();
  };
  return (
    <div className="flex flex-col">
      <div className="flex justify-end mb-4">
        <Button type="btnSecondary" onClick={openModal} buttonType="button">
          Import CSV
        </Button>
      </div>

      {/* Modal Backdrop */}
      {isModalOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="fixed inset-0 bg-[rgba(0,0,0,.5)] flex items-center justify-center z-50"
        >
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Import CSV Files</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6">
              <div className="p-4 border rounded-md flex justify-between">
                <div className="font-medium mb-2">
                  Pricing rules{" "}
                  {pricingRules?.length ? `(${pricingRules.length})` : ""}
                  {errors.pricingRules?.message && (
                    <FieldError>{errors.pricingRules?.message}</FieldError>
                  )}
                </div>
                <UploadCSV
                  handleFileUpload={handlePricingRuleImport}
                  name="pricingRules"
                  label="Import Pricing Rules"
                />
              </div>

              <div className="p-4 border rounded-md flex justify-between">
                <div className="font-medium mb-2">
                  Delivery rules
                  {deliverySlots?.length ? `(${deliverySlots.length})` : ""}
                  {errors.deliverySlots?.message && (
                    <FieldError>{errors.deliverySlots?.message}</FieldError>
                  )}
                </div>
                <UploadCSV
                  handleFileUpload={handleDeliveryRuleImport}
                  name="deliveryRules"
                  label="Import Delivery Rules"
                />
              </div>

              <div className="p-4 border rounded-md flex justify-between">
                <div className="font-medium mb-2">
                  Quantity pricings{" "}
                  {quantityPricings?.length
                    ? `(${quantityPricings.length})`
                    : ""}
                  {errors.quantityPricings?.message && (
                    <FieldError>{errors.quantityPricings?.message}</FieldError>
                  )}
                </div>
                <UploadCSV
                  handleFileUpload={handlePiceQuanityImport}
                  name="quantityPricings"
                  label="Import Quantity Pricings"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors mr-2"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                Import
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default VendorProductCSVImport;
