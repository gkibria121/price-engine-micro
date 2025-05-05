import React, { HTMLAttributes } from "react";

function CheckBox({
  label,
  ...others
}: {
  label: string;
  other?: HTMLAttributes<HTMLInputElement>;
}) {
  return (
    <label className="flex ">
      <input className="mr-2" type="checkbox" {...others} />
      {label}
    </label>
  );
}

export default CheckBox;
