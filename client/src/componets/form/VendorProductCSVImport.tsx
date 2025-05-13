import React, { useState, useMemo } from "react";
import { useForm, UseFormSetValue } from "react-hook-form";
import { toast } from "react-toastify";
import {
  extractUniqueVendorProductIdentifiers,
  getPricingRuleMetas,
} from "@/util/funcitons";
// Components
import Button from "../Button";
import UploadCSV from "../UploadCSV";
import FieldError from "./FieldError";
import Modal from "../Modal";

// Types
import { Product, Vendor, VendorProductFormType } from "@/types";

// Type definitions
type ProductNameWithVendorEmail = {
  product_name: string;
  vendor_email: string;
};

type PricingRule =
  VendorProductFormType["vendorProducts"][number]["pricingRules"][number] &
    ProductNameWithVendorEmail;
type DeliverySlot =
  VendorProductFormType["vendorProducts"][number]["deliverySlots"][number] &
    ProductNameWithVendorEmail;
type QuantityPricing =
  VendorProductFormType["vendorProducts"][number]["quantityPricings"][number] &
    ProductNameWithVendorEmail;
type Rating = { rating: number } & ProductNameWithVendorEmail;

type VendorCSVFormType = {
  pricingRules: PricingRule[];
  deliverySlots: DeliverySlot[];
  quantityPricings: QuantityPricing[];
  ratings: Rating[];
};

type CSVImportSectionProps = {
  title: string;
  data: unknown[];
  errorMessage?: string;
  handleFileUpload: (data: unknown[]) => void;
  name: string;
  label: string;
};

// Validation schemas for CSV imports
const csvValidationSchemas = {
  pricingRules: {
    requiredFields: [
      "attribute",
      "value",
      "price",
      "product_name",
      "vendor_email",
    ],
    errorMessage:
      "Import csv with attribute, value, price, product_name, vendor_email",
  },
  deliverySlots: {
    requiredFields: [
      "cutoffTime",
      "deliveryTimeEndDate",
      "deliveryTimeEndTime",
      "deliveryTimeStartDate",
      "deliveryTimeStartTime",
      "label",
      "price",
      "product_name",
      "vendor_email",
    ],
    errorMessage:
      "Import csv with label, price, deliveryTimeStartDate, deliveryTimeStartTime, deliveryTimeEndDate, deliveryTimeEndTime, cutoffTime, product_name, vendor_email",
  },
  quantityPricings: {
    requiredFields: ["price", "quantity", "product_name", "vendor_email"],
    errorMessage: "Import csv with quantity, price, product_name, vendor_email",
  },
  ratings: {
    requiredFields: ["rating", "product_name", "vendor_email"],
    errorMessage: "Import csv with rating, product_name, vendor_email",
  },
};

// Utility function to validate CSV data against schema
const validateCSVData = (data: unknown[], requiredFields: string[]) => {
  return data.every((item) =>
    requiredFields.every((field) => {
      const value = item[field];
      return value !== undefined && value !== null && value !== "";
    })
  );
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
  <div className="p-4 border rounded-md flex justify-between items-center mb-4">
    <div className="font-medium">
      {title}{" "}
      {data?.length ? (
        <span className="text-green-600 ml-1">({data.length})</span>
      ) : (
        ""
      )}
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
  setVendorsValue: UseFormSetValue<VendorProductFormType>; // Using any here for simplicity, but ideally should be properly typed
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    setValue,
    setError,
    clearErrors,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VendorCSVFormType>({
    defaultValues: {
      pricingRules: [],
      deliverySlots: [],
      quantityPricings: [],
      ratings: [],
    },
  });

  // Modal handlers
  const openModal = () => {
    reset();
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Generic CSV import handler
  const createImportHandler =
    (
      field: keyof VendorCSVFormType,
      schema: (typeof csvValidationSchemas)[keyof typeof csvValidationSchemas]
    ) =>
    (csvData: unknown[]) => {
      if (!Array.isArray(csvData) || csvData.length === 0) {
        toast("Empty or invalid CSV file", { type: "error", autoClose: 3000 });
        return;
      }

      if (!validateCSVData(csvData, schema.requiredFields)) {
        toast(`Invalid CSV format for ${field}`, {
          type: "warning",
          autoClose: 3000,
        });
        setError(field, { type: "custom", message: schema.errorMessage });
        return;
      }

      clearErrors(field);
      setValue(field, csvData as VendorCSVFormType[keyof VendorCSVFormType]);
      toast(`Successfully imported ${csvData.length} ${field}`, {
        type: "success",
        autoClose: 2000,
      });
    };

  // Create handlers for each CSV type
  const handlePricingRuleImport = createImportHandler(
    "pricingRules",
    csvValidationSchemas.pricingRules
  );
  const handleDeliveryRuleImport = createImportHandler(
    "deliverySlots",
    csvValidationSchemas.deliverySlots
  );
  const handleQuantityPricingImport = createImportHandler(
    "quantityPricings",
    csvValidationSchemas.quantityPricings
  );
  const handleRatingImport = createImportHandler(
    "ratings",
    csvValidationSchemas.ratings
  );

  // Memoize form data to prevent unnecessary re-renders

  const formData = useMemo(
    () => ({
      pricingRules: getValues("pricingRules") || [],
      deliverySlots: getValues("deliverySlots") || [],
      quantityPricings: getValues("quantityPricings") || [],
      ratings: getValues("ratings") || [],
    }),
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      getValues("pricingRules"),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      getValues("deliverySlots"),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      getValues("quantityPricings"),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      getValues("ratings"),
      getValues,
    ]
  );

  // Check if data is ready to submit
  const isFormComplete = useMemo(() => {
    return (
      formData.pricingRules.length > 0 &&
      formData.deliverySlots.length > 0 &&
      formData.quantityPricings.length > 0 &&
      formData.ratings.length > 0
    );
  }, [formData]);

  // Form submission
  const onSubmit = () => {
    try {
      setIsProcessing(true);

      if (!isFormComplete) {
        toast("Please import all required CSV files", {
          type: "info",
          autoClose: 2000,
        });
        return;
      }

      const combinedData = [
        ...formData.pricingRules,
        ...formData.deliverySlots,
        ...formData.quantityPricings,
        ...formData.ratings,
      ];

      const vendorProductIdentifiers =
        extractUniqueVendorProductIdentifiers(combinedData);
      const vendorProducts: VendorProductFormType["vendorProducts"] = [];

      for (const id of vendorProductIdentifiers) {
        const product = products.find((el) => el.name === id.product_name);
        const vendor = vendors.find((el) => el.email === id.vendor_email);

        if (!product || !vendor) {
          toast(
            `Product or vendor not found: ${id.product_name} / ${id.vendor_email}`,
            { type: "error", autoClose: 3000 }
          );
          continue;
        }

        const productPricingRules = formData.pricingRules.filter(
          (rule) =>
            rule.product_name === id.product_name &&
            rule.vendor_email === id.vendor_email
        );

        const productDeliverySlots = formData.deliverySlots.filter(
          (slot) =>
            slot.product_name === id.product_name &&
            slot.vendor_email === id.vendor_email
        );

        const productQuantityPricings = formData.quantityPricings.filter(
          (pricing) =>
            pricing.product_name === id.product_name &&
            pricing.vendor_email === id.vendor_email
        );

        const rating = formData.ratings.find(
          (el) =>
            el.vendor_email === id.vendor_email &&
            el.product_name === id.product_name
        );

        vendorProducts.push({
          productId: product.id,
          vendorId: vendor.id,
          pricingRules: productPricingRules,
          deliverySlots: productDeliverySlots,
          quantityPricings: productQuantityPricings,
          pricingRuleMetas: getPricingRuleMetas(productPricingRules),
          rating: rating?.rating ?? 0,
        });
      }

      if (vendorProducts.length === 0) {
        toast("No valid vendor-product combinations found", {
          type: "error",
          autoClose: 3000,
        });
        return;
      }

      setVendorsValue("vendorProducts", vendorProducts);
      toast(
        `Successfully imported ${vendorProducts.length} vendor-product combinations`,
        { type: "success", autoClose: 3000 }
      );
      closeModal();
    } catch (error) {
      console.error("Error processing CSV import:", error);
      toast("An error occurred while processing the import", {
        type: "error",
        autoClose: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Modal footer buttons
  const modalFooter = (
    <>
      <button
        onClick={closeModal}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors mr-2"
        type="button"
        disabled={isProcessing}
      >
        Cancel
      </button>
      <button
        className={`px-4 py-2 ${
          isFormComplete
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 cursor-not-allowed"
        } text-white rounded transition-colors flex items-center`}
        type="submit"
        disabled={!isFormComplete || isProcessing}
      >
        {isProcessing ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          "Import"
        )}
      </button>
    </>
  );

  // Import status indicators
  const importStatus = [
    { name: "Pricing Rules", data: formData.pricingRules },
    { name: "Delivery Rules", data: formData.deliverySlots },
    { name: "Quantity Pricing", data: formData.quantityPricings },
    { name: "Ratings", data: formData.ratings },
  ];

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
          onClose={isProcessing ? undefined : closeModal}
          title="Import CSV Files"
          footer={modalFooter}
        >
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium mb-2">Import Status:</h3>
            <div className="flex flex-wrap gap-2">
              {importStatus.map((item) => (
                <span
                  key={item.name}
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.data.length > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item.name}:{" "}
                  {item.data.length > 0
                    ? `${item.data.length} imported`
                    : "Not imported"}
                </span>
              ))}
            </div>
          </div>

          <CSVImportSection
            title="Pricing Rules"
            data={formData.pricingRules}
            errorMessage={errors.pricingRules?.message}
            handleFileUpload={handlePricingRuleImport}
            name="pricingRules"
            label="Import Pricing Rules"
          />

          <CSVImportSection
            title="Delivery Rules"
            data={formData.deliverySlots}
            errorMessage={errors.deliverySlots?.message}
            handleFileUpload={handleDeliveryRuleImport}
            name="deliveryRules"
            label="Import Delivery Rules"
          />

          <CSVImportSection
            title="Quantity Pricings"
            data={formData.quantityPricings}
            errorMessage={errors.quantityPricings?.message}
            handleFileUpload={handleQuantityPricingImport}
            name="quantityPricings"
            label="Import Quantity Pricings"
          />

          <CSVImportSection
            title="Ratings"
            data={formData.ratings}
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
