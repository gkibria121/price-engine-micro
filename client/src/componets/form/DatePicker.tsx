import React, { HTMLAttributes } from "react";
import FieldError from "./FieldError";

type DatePickerProps = {
  label?: string;
  error?: string;
  defaultValue?: string;
} & HTMLAttributes<HTMLInputElement>;

const DatePicker: React.FC<DatePickerProps> = ({ label, error, ...other }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type="date"
        className={`w-full p-2 border rounded ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        {...other}
      />

      {error && <FieldError>{error}</FieldError>}
    </div>
  );
};

export default DatePicker;
