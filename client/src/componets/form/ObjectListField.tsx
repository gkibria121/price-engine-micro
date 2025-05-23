import React, { PropsWithChildren, useState } from "react";
import Button from "../Button";
import { ArrayPath, FieldArray, UseFieldArrayReturn } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";
import ExpandableSection from "../ExpandableSection";
import { AnimatePresence } from "framer-motion";
import FieldError from "./FieldError";

function ObjectListField<T extends Record<string, unknown>>({
  children,
  label,
  defaultItem,
  readonly,
  expanded = false,
  append = undefined,
  error = undefined,
}: PropsWithChildren & {
  label: string;
  defaultItem: FieldArray<T, ArrayPath<T>>;
  append?: UseFieldArrayReturn<T>["append"];
  readonly: boolean;
  expanded?: boolean;
  error?: string;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded);

  return (
    <div className="space-y-4  border-b mt-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-x-4">
          <h2 className="text-xl space-y-1 font-semibold">{label}</h2>
          {!isExpanded ? (
            <ChevronDown
              className="cursor-pointer"
              onClick={setIsExpanded.bind(null, (prev) => !prev)}
            />
          ) : (
            <ChevronUp
              className="cursor-pointer"
              onClick={setIsExpanded.bind(null, (prev) => !prev)}
            />
          )}
        </div>

        {!readonly && append && (
          <Button
            type="btnPrimary"
            buttonType="button"
            onClick={() => {
              append(defaultItem);
              if (!isExpanded) setIsExpanded((prev) => !prev);
            }}
          >
            + Add Rule
          </Button>
        )}
      </div>
      {error && <FieldError>{error}</FieldError>}
      <AnimatePresence initial={false}>
        {isExpanded && <ExpandableSection>{children}</ExpandableSection>}
      </AnimatePresence>
    </div>
  );
}
function Table({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-4">{children}</div>;
}
function Row({
  children,
  className = "pb-4",
}: { className?: string } & PropsWithChildren) {
  return (
    <div className={`flex gap-4 items-start ${className}`}>{children}</div>
  );
}
function Col({ children }: PropsWithChildren & {}) {
  return <div className="flex-1">{children}</div>;
}
function Remove({
  handleClick,
}: {
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button type="link" onClick={handleClick}>
      Remove
    </Button>
  );
}

ObjectListField.Table = Table;
ObjectListField.Row = Row;
ObjectListField.Col = Col;
ObjectListField.Remove = Remove;
export default ObjectListField;
