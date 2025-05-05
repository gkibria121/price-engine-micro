import React, { useState } from "react";

function ProductSelectionForm() {
  const [quantity, setQuantity] = useState(10);

  return (
    <>
      <div className="border-b pb-2 mb-6">
        <h2 className="text-xl font-semibold">Product Selection</h2>
        <p className="text-gray-500 text-sm">
          To calculate the price, please select a product, specify the quantity,
          choose the desired attributes, and select a delivery method.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {/* Product Type */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Product Type</label>
            <div className="relative">
              <select className="w-full p-2 border rounded appearance-none">
                <option>Flyesrs</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Sides */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Sides <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="sides" className="mr-2" />
                <span>Single Sided</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sides"
                  className="mr-2"
                  defaultChecked
                />
                <span>Double Sided</span>
              </label>
            </div>
          </div>

          {/* Orientation */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Orientation <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="orientation" className="mr-2" />
                <span>Single Sided</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="orientation"
                  className="mr-2"
                  defaultChecked
                />
                <span>Double Sided</span>
              </label>
            </div>
          </div>

          {/* Paper Thickness */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Paper Thickness</label>
            <p className="text-xs text-gray-500 mb-2">
              GSM stands for &apos;Grams per Square Meter&apos;. The higher the
              GSM number, the heavier the paper.
            </p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="thickness" className="mr-2" />
                <span>130 GSM (Thin)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="thickness"
                  className="mr-2"
                  defaultChecked
                />
                <span>170 GSM (Medium)</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="thickness" className="mr-2" />
                <span>250 GSM (Moderately Thick)</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="thickness" className="mr-2" />
                <span>300 GSM (Thick)</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="thickness" className="mr-2" />
                <span>Other</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Quantity</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </div>

          {/* Finished Size */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Finished Size<span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="size" className="mr-2" />
                <span>A6</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="size"
                  className="mr-2"
                  defaultChecked
                />
                <span>A5</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="size" className="mr-2" />
                <span>A4</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="size" className="mr-2" />
                <span>Custom Size</span>
              </label>
            </div>
          </div>

          {/* Paper Type */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Paper Type<span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="paperType" className="mr-2" />
                <span>Silk (Matt)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paperType"
                  className="mr-2"
                  defaultChecked
                />
                <span>Gloss</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductSelectionForm;
