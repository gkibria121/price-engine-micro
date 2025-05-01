import { toInitialCap } from "@/util/funcitons";
import React from "react";

function SelectionField({
  options,
  label,
  className,
  ...others
}: {
  label: string;
  className?: string;
  options: { name: string; value: string }[];
  others?: React.HTMLAttributes<HTMLSelectElement>;
}) {
  return (
    <div>
      <label
        form={label}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {toInitialCap(label)}
      </label>
      <select
        className={`"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " ${className}`}
        {...others}
      >
        <option value="" disabled>
          Select a {toInitialCap(label)}
        </option>
        {options.map((product) => (
          <option key={product.value} value={product.value}>
            {product.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectionField;
