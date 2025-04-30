import React, { PropsWithChildren } from "react";

function PageError({ children }: PropsWithChildren) {
  return <div className="text-center mt-5">{children}</div>;
}

export default PageError;
