import { Fragment } from "react";

export default function DataTable({
  headers,
  data,
  renderRow,
  emptyMessage = "No transactions found.",
}) {
  return (
    <div className="overflow-y-auto overflow-x-hidden max-h-[calc(100vh-280px)] rounded-xl border border-slate-800 bg-slate-900 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="sticky top-0 z-10 bg-slate-950 text-xs font-semibold uppercase text-slate-500 shadow-sm shadow-slate-800/50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {data.map((item, index) => (
            <Fragment key={item?.id ?? index}>
              {renderRow(item, index)}
            </Fragment>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <p className="p-6 text-center text-slate-500 text-sm">{emptyMessage}</p>
      )}
    </div>
  );
}
