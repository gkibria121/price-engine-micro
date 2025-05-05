import React, { PropsWithChildren } from "react";

function FieldError({ children }: PropsWithChildren) {
  return <p className="text-red-500 text-sm my-2 ml-2">{children}</p>;
}

export default FieldError;
