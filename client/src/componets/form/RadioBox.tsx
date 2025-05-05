import { toTitleCase } from "@/util/funcitons";
import React, { HTMLAttributes, PropsWithChildren } from "react";

type CheckboxProps = {
  title: string;
  required?: boolean;
  description?: string;
};

function RadioBox({
  title,
  required = undefined,
  description = undefined,
  children,
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
      <div className="space-y-2">{children}</div>
    </div>
  );
}
type RadioInputProps = {
  optinos?: HTMLAttributes<HTMLInputElement>;
  label: string;
};
function RadioInput({ label, ...optinos }: RadioInputProps) {
  return (
    <label className="flex items-center">
      <input type="radio" name="thickness" className="mr-2" {...optinos} />
      <span className="text-slate-700">{label}</span>
    </label>
  );
}
RadioBox.RadioInput = RadioInput;

export default RadioBox;
