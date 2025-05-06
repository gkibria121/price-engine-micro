import React from "react";
import FieldError from "./FieldError";
import { toInitialCap } from "@/util/funcitons";

function TextField({
  error,
  label = undefined,
  step,
  variant = "floating",
  type = "text",
  placeholder,

  defaultValue,
  readonly = false,
  ...others
}: {
  error?: string | string[];
  label?: string;
  step?: string;
  variant?: "floating" | "stacked";
  defaultValue?: string;
  readonly?: boolean;
  type?: HTMLInputElement["type"];
  others?: React.HTMLAttributes<HTMLInputElement>;
  placeholder?: string;
}) {
  const style: Record<typeof variant, string> = {
    stacked: "w-full p-2 border rounded border-slate-200 outline-slate-200",
    floating: `block px-2.5 pb-2.5 ${
      label ? " pt-4 " : " pt-2 "
    } w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-blue-600 peer`,
  };
  const labels: Record<typeof variant, React.JSX.Element> = {
    floating: (
      <label className="absolute text-sm text-gray-500   duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white   px-2 peer-focus:px-2 peer-focus:text-blue-600   peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-[80%] peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
        {toInitialCap(label)}
      </label>
    ),
    stacked: (
      <label className="block font-medium mb-2 ">{toInitialCap(label)}</label>
    ),
  };

  return (
    <div className="relative mb-6">
      {variant === "stacked" && label && labels["stacked"]}
      <input
        type={type}
        {...others}
        defaultValue={defaultValue}
        readOnly={readonly}
        step={step ? step : undefined}
        className={style[variant]}
        placeholder={placeholder ?? " "}
      />
      {variant === "floating" && labels["floating"]}

      {typeof error === "string" ? (
        <FieldError>{error}</FieldError>
      ) : (
        error?.map((e) => <FieldError key={e}>{e}</FieldError>)
      )}
    </div>
  );
}

export default TextField;
