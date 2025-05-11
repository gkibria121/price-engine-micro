import React, { HTMLAttributes } from "react";
import FieldError from "./FieldError";

function CheckBox({
  label,
  error,
  ...others
}: {
  label: string;
  error?: string | string[];
  other?: HTMLAttributes<HTMLInputElement>;
}) {
  return (
    <>
      <label className="flex ">
        <input className="mr-2" type="checkbox" {...others} />
        {label}
      </label>
      {typeof error === "string" ? (
        <FieldError>{error}</FieldError>
      ) : (
        error?.map((e) => <FieldError key={e}>{e}</FieldError>)
      )}
    </>
  );
}

export default CheckBox;
