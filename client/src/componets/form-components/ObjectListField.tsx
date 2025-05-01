import React, { PropsWithChildren } from "react";
import Button from "../Button";
import { ArrayPath, FieldArray, UseFieldArrayReturn } from "react-hook-form";

function ObjectListField<T extends Record<string, unknown>>({
  children,
  label,
  defaultItem,
  readonly,
  append,
}: PropsWithChildren & {
  label: string;
  defaultItem: FieldArray<T, ArrayPath<T>>;
  append: UseFieldArrayReturn<T>["append"];
  readonly: boolean;
}) {
  return (
    <div className="space-y-4  border-b">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{label}</h2>
        {!readonly && (
          <Button
            type="btnPrimary"
            buttonType="button"
            onClick={() => {
              append(defaultItem);
            }}
          >
            + Add Rule
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
function Table({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-4  pb-4">{children}</div>;
}
function Row({ children }: PropsWithChildren) {
  return <div className="flex gap-4 items-start pb-4">{children}</div>;
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
