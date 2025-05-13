import React, { useState } from "react";
import { useForm, UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import { extractUniqueVendorProductIdentifiers } from "@/util/funcitons";
// Components
import Button from "../Button";
import UploadCSV from "../UploadCSV";
import FieldError from "./FieldError";

// Types
import { Product, Vendor, VendorProductFormType } from "@/types";
import Modal from "../Modal";

// Type definitions
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
  ratings: ({ rating: number } & ProductNameWithVendorEmail)[];
};

type CSVImportSectionProps = {
  title: string;
  data: unknown[];
  errorMessage?: string;
  handleFileUpload: (data: unknown[]) => void;
  name: string;
  label: string;
};

// Sub-components
const CSVImportSection = ({
  title,
  data,
  errorMessage,
  handleFileUpload,
  name,
  label,
}: CSVImportSectionProps) => (
  <div className="p-4 border rounded-md flex justify-between">
    <div className="font-medium mb-2">
      {title} {data?.length ? `(${data.length})` : ""}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </div>
    <UploadCSV handleFileUpload={handleFileUpload} name={name} label={label} />
  </div>
);

// Main component
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

  const {
    setValue,
    setError,
    clearErrors,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<VendorCSVFormType>({});

  // Modal handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // CSV import handlers
  const handlePricingRuleImport = (pricingRuleData: unknown[]) => {
    const pricingRules = pricingRuleData as VendorCSVFormType["pricingRules"];

    const isValidFormat = pricingRules.every(
      (rule) =>
        rule.attribute &&
        rule.price &&
        rule.product_name &&
        rule.value &&
        rule.vendor_email
    );

    if (!isValidFormat) {
      toast(
        "Invalid CSV format, Please import csv with attribute,value,price,product_name,vendor_email",
        { type: "warning", autoClose: 1000 }
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

  const handleDeliveryRuleImport = (deliveryRuleData: unknown[]) => {
    const deliverySlots =
      deliveryRuleData as VendorCSVFormType["deliverySlots"];

    const isValidFormat = deliverySlots.every(
      (slot) =>
        slot.cutoffTime &&
        slot.deliveryTimeEndDate !== undefined &&
        slot.deliveryTimeEndTime &&
        slot.deliveryTimeStartDate !== undefined &&
        slot.deliveryTimeStartTime &&
        slot.label &&
        slot.price &&
        slot.product_name &&
        slot.vendor_email
    );

    if (!isValidFormat) {
      toast("Invalid CSV format for deliverySlots", {
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

  const handleQuantityPricingImport = (quantityPricingsData: unknown[]) => {
    const quantityPricings =
      quantityPricingsData as VendorCSVFormType["quantityPricings"];

    const isValidFormat = quantityPricings.every(
      (pricing) =>
        pricing.price &&
        pricing.quantity !== undefined &&
        pricing.product_name &&
        pricing.vendor_email
    );

    if (!isValidFormat) {
      toast("Invalid CSV format for quantityPricings", {
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
  const handleRatingImport = (ratingsData: unknown[]) => {
    const ratings = ratingsData as VendorCSVFormType["ratings"];

    const isValidFormat = ratings.every(
      (rating) => rating.rating && rating.product_name && rating.vendor_email
    );

    if (!isValidFormat) {
      toast("Invalid CSV format for ratings", {
        type: "warning",
        autoClose: 1000,
      });

      setError("ratings", {
        type: "custom",
        message: "Import csv with rating,product_name,vendor_email",
      });
      return;
    }

    clearErrors("ratings");
    setValue("ratings", ratings);
    console.log(ratings);
  };
  // Form submission
  const onSubmit = () => {
    const pricingRules = getValues("pricingRules") || [];
    const deliverySlots = getValues("deliverySlots") || [];
    const quantityPricings = getValues("quantityPricings") || [];
    const ratings = getValues("ratings") || [];
    if (
      !pricingRules.length ||
      !deliverySlots.length ||
      !quantityPricings.length ||
      !ratings.length
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
      ...ratings,
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
      const rating = ratings.find(
        (el) =>
          el.vendor_email === id.vendor_email &&
          el.product_name === id.product_name
      );
      vendorProducts.push({
        productId: product?.id ?? "",
        vendorId: vendor?.id ?? "",
        pricingRules: productPricingRules,
        deliverySlots: productDeliverySlots,
        quantityPricings: productQuantityPricings,
        pricingRuleMetas: [],
        rating: rating?.rating ?? 0,
      });
    }

    setVendorsValue("vendorProducts", vendorProducts);
    closeModal();
  };

  // Form data
  const pricingRules = getValues("pricingRules") || [];
  const deliverySlots = getValues("deliverySlots") || [];
  const quantityPricings = getValues("quantityPricings") || [];
  const ratings = getValues("ratings") || [];

  // Modal footer buttons
  const modalFooter = (
    <>
      <button
        onClick={closeModal}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors mr-2"
        type="button"
      >
        Cancel
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        type="submit"
      >
        Import
      </button>
    </>
  );

  return (
    <div className="flex flex-col">
      <div className="flex justify-end mb-4">
        <Button type="btnSecondary" onClick={openModal} buttonType="button">
          Import CSV
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Import CSV Files"
          footer={modalFooter}
        >
          <CSVImportSection
            title="Pricing rules"
            data={pricingRules}
            errorMessage={errors.pricingRules?.message}
            handleFileUpload={handlePricingRuleImport}
            name="pricingRules"
            label="Import Pricing Rules"
          />

          <CSVImportSection
            title="Delivery rules"
            data={deliverySlots}
            errorMessage={errors.deliverySlots?.message}
            handleFileUpload={handleDeliveryRuleImport}
            name="deliveryRules"
            label="Import Delivery Rules"
          />

          <CSVImportSection
            title="Quantity pricings"
            data={quantityPricings}
            errorMessage={errors.quantityPricings?.message}
            handleFileUpload={handleQuantityPricingImport}
            name="quantityPricings"
            label="Import Quantity Pricings"
          />
          <CSVImportSection
            title="Ratings"
            data={ratings}
            errorMessage={errors.ratings?.message}
            handleFileUpload={handleRatingImport}
            name="ratings"
            label="Import Ratings"
          />
        </Modal>
      </form>
    </div>
  );
}

export default VendorProductCSVImport;
