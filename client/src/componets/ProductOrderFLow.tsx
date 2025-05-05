"use client";
import React, { useState } from "react";
import ProgressBar from "./form/ProgressBar";
import ProductSelectionForm from "./ProductSelectionForm";
import FormActions from "./FormActions";

const ProductOrderFlow = () => {
  const [currentStep] = useState(1);
  const options = [
    {
      step: 1,
      label: "Product",
      /* Product Selection Form */
      render: (key: number) => <ProductSelectionForm key={key} />,
    },
    {
      step: 2,
      label: "Delivery Details",
    },
    {
      step: 3,
      label: "Upload Design File (Optional)",
    },
    {
      step: 4,
      label: "Final",
    },
  ];
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress Steps */}
      <ProgressBar options={options} currentStep={currentStep} />

      {/* Form body*/}
      {options.map(
        (option) => option.step === currentStep && option.render?.(option.step)
      )}
      {/* Next Button */}
      <FormActions />
    </div>
  );
};

export default ProductOrderFlow;
