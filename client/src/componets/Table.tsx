import React, { PropsWithChildren } from "react";
type tableHeader =
  | string
  | { value: string; colSpan?: number; rowSpan?: number; isCenter?: boolean };
function Table({
  headers,
  children,
}: {
  headers: tableHeader[];
} & PropsWithChildren) {
  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((th) => (
              <th
                key={typeof th == "string" ? th : th.value}
                colSpan={
                  typeof th !== "string" && th.colSpan !== 0 ? th.colSpan : 1
                }
                rowSpan={
                  typeof th !== "string" && th.rowSpan !== 0 ? th.rowSpan : 1
                }
                className={`px-6 py-3  text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  typeof th !== "string" && th.isCenter
                    ? "text-center"
                    : "text-left"
                }`}
              >
                {typeof th === "string" ? th : th.value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
      </table>
    </div>
  );
}

function Row({ children }: PropsWithChildren) {
  return <tr className="hover:bg-gray-50">{children}</tr>;
}
function Col({
  children,
  className = "",
}: PropsWithChildren & {
  className?: string;
}) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
  );
}
Table.Row = Row;
Table.Col = Col;
export default Table;
