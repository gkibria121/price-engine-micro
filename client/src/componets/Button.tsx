import React, { PropsWithChildren } from "react";

type ButtonKind = "link";

const styles = {
  link: "text-red-600 cursor-pointer ml-2 hover:text-red-900",
} as Record<ButtonKind, string>;

function Button({
  children,
  type,
  buttonType = "submit",
  className,
  ...others
}: PropsWithChildren &
  React.HtmlHTMLAttributes<HTMLButtonElement> & {
    type: ButtonKind;
    clasName?: string;
    buttonType?: HTMLButtonElement["type"];
  }) {
  return (
    <button
      {...others}
      className={styles[type] + " " + className}
      type={buttonType}
    >
      {children}
    </button>
  );
}

export default Button;
