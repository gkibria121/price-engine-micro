import Link from "next/link";
import React, { PropsWithChildren } from "react";

type ButtonKind =
  | "link"
  | "btn"
  | "btnPrimary"
  | "btnWhite"
  | "btnDanger"
  | "btnSecondary";

const styles = {
  link: "text-red-600 cursor-pointer ml-2 hover:text-red-900",
  btnSecondary:
    "text-white bg-gray-600 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none",
  btnPrimary:
    "text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none",
  btnDanger:
    "text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none",
  btnWhite:
    "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2",
} as Record<ButtonKind, string>;

type ButtonProps = React.HtmlHTMLAttributes<HTMLButtonElement>;
function Button({
  children,
  type,
  buttonType = "submit",
  className,
  href,
  ...others
}:
  | PropsWithChildren & {
      type: ButtonKind;
      isLink?: boolean;
      className?: string;
      buttonType?: HTMLButtonElement["type"];
      href?: string;
    } & ButtonProps) {
  if (href)
    return (
      <Link href={href} className={styles[type] + " " + className}>
        {children}
      </Link>
    );
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
