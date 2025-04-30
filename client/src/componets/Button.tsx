import Link from "next/link";
import React, { PropsWithChildren } from "react";

type ButtonKind = "link" | "btn" | "btnPrimary";

const styles = {
  link: "text-red-600 cursor-pointer ml-2 hover:text-red-900",
  btnPrimary:
    "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ml-auto mr-1",
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
