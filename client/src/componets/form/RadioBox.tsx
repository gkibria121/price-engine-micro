import { toTitleCase } from "@/util/funcitons";
import React, { HTMLAttributes, PropsWithChildren } from "react";
import FieldError from "./FieldError";

type CheckboxProps = {
  title: string;
  required?: boolean;
  description?: string;
  error?: string;
};

function RadioBox({
  title,
  required = undefined,
  description = undefined,
  children,
  error = undefined,
}: CheckboxProps & PropsWithChildren) {
  return (
    <div className="mb-6">
      <label className="block font-medium mb-2">
        {toTitleCase(title)}{" "}
        {required && <span className="text-red-500">*</span>}
      </label>
      {description ? (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      ) : (
        ""
      )}
      {error && <FieldError>{error}</FieldError>}

      <div className="space-y-2">{children}</div>
    </div>
  );
}
type RadioInputProps = {
  optinos?: HTMLAttributes<HTMLInputElement>;
  label: string;
  value?: string;
  className?: string;
};
function RadioInput({
  label,
  className = "text-slate-700",
  value = undefined,
  ...optinos
}: RadioInputProps) {
  return (
    <label className="flex items-center hover:bg-blue-50 p-1 rounded-xl">
      <input type="radio" value={value} className="mr-2" {...optinos} />
      <span className={` ${className}`}>{label}</span>
    </label>
  );
}
RadioBox.RadioInput = RadioInput;

export default RadioBox;
