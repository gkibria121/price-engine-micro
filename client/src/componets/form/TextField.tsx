import React from "react";
import FieldError from "./FieldError";
import { toInitialCap } from "@/util/funcitons";

type TextFieldProps = {
  error?: string | string[];
  label?: string;
  step?: string;
  variant?: "floating" | "stacked";
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  isTextArea?: boolean;
  defaultValue?: string;
  readonly?: boolean;
} & React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

const TextField: React.FC<TextFieldProps> = ({
  error,
  label,
  step,
  variant = "floating",
  type = "text",
  placeholder,
  isTextArea = false,
  defaultValue,
  readonly = false,
  ...others
}) => {
  const inputClass: Record<"floating" | "stacked", string> = {
    stacked: "w-full p-2 border rounded border-slate-200 outline-slate-200",
    floating: [
      "block w-full px-2.5 pb-2.5",
      label ? "pt-4" : "pt-2",
      "text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300",
      "appearance-none focus:outline-none focus:ring-0 focus:border-blue-600",
      "peer",
    ].join(" "),
  };

  const renderLabel = () => {
    if (!label) return null;

    if (variant === "floating") {
      return (
        <label className="absolute text-sm text-gray-500 bg-white px-2 z-10 origin-[0] duration-300 transform -translate-y-4 scale-75 top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-[80%] peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 peer-focus:text-blue-600">
          {toInitialCap(label)}
        </label>
      );
    }

    return (
      <label className="block font-medium mb-2">{toInitialCap(label)}</label>
    );
  };

  return (
    <div className="relative mb-6">
      {variant === "stacked" && renderLabel()}

      {isTextArea ? (
        <textarea
          {...(others as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          readOnly={readonly}
          defaultValue={defaultValue}
          className={inputClass[variant]}
          placeholder={placeholder ?? " "}
        />
      ) : (
        <input
          {...(others as React.InputHTMLAttributes<HTMLInputElement>)}
          type={type}
          readOnly={readonly}
          defaultValue={defaultValue}
          step={step}
          className={inputClass[variant]}
          placeholder={placeholder ?? " "}
        />
      )}

      {variant === "floating" && renderLabel()}

      {typeof error === "string" ? (
        <FieldError>{error}</FieldError>
      ) : (
        error?.map((e) => <FieldError key={e}>{e}</FieldError>)
      )}
    </div>
  );
};

export default TextField;
