import React, { PropsWithChildren } from "react";

function FieldError({ children }: PropsWithChildren) {
  return <p className="text-red-500 text-sm mt-1">{children}</p>;
}

export default FieldError;
