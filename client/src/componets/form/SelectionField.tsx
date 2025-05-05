import { toInitialCap } from "@/util/funcitons";
import React from "react";
import FieldError from "./FieldError";

function SelectionField({
  options,
  label,
  className,
  error,
  ...others
}: {
  label: string;
  className?: string;
  error?: string | string[];
  options: { name: string; value: string }[];
  others?: React.HTMLAttributes<HTMLSelectElement>;
}) {
  return (
    <div>
      <label form={label} className="block font-medium mb-2">
        {toInitialCap(label)}
      </label>
      <div className="relative">
        <select
          className={`w-full p-2 border border-slate-200 outline-slate-200 rounded appearance-none ${className}`}
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
        </select>{" "}
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
      {typeof error === "string" ? (
        <FieldError>{error}</FieldError>
      ) : (
        error?.map((e) => <FieldError key={e}>{e}</FieldError>)
      )}
    </div>
  );
}

export default SelectionField;
