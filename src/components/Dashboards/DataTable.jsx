import { Fragment } from "react";

export default function DataTable({
  headers,
  data,
  renderRow,
  renderMobileCard,
  emptyMessage = "No transactions found.",
}) {
  return (
    <>
      {renderMobileCard && (
        <div className="lg:hidden space-y-3">
          {data.length === 0 ? (
            <p className="p-6 text-center text-slate-600 dark:text-slate-500 text-sm">
              {emptyMessage}
            </p>
          ) : (
            data.map((item, index) => (
              <Fragment key={item?.id ?? index}>
                {renderMobileCard(item, index)}
              </Fragment>
            ))
          )}
        </div>
      )}
      <div className="hidden lg:block lg:max-h-[calc(100vh-280px)] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-400">
          <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-950 text-xs font-semibold uppercase text-slate-600 dark:text-slate-500 shadow-sm shadow-slate-200/50 dark:shadow-slate-800/50">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-3 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
            {data.map((item, index) => (
              <Fragment key={item?.id ?? index}>
                {renderRow(item, index)}
              </Fragment>
            ))}
          </tbody>
        </table>
        {data.length === 0 && !renderMobileCard && (
          <p className="p-6 text-center text-slate-600 dark:text-slate-500 text-sm">
            {emptyMessage}
          </p>
        )}
      </div>
      {!renderMobileCard && (
        <div className="lg:hidden">
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-400">
              <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-950 text-xs font-semibold uppercase text-slate-600 dark:text-slate-500">
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className="px-2 py-2 whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                {data.map((item, index) => (
                  <Fragment key={item?.id ?? index}>
                    {renderRow(item, index)}
                  </Fragment>
                ))}
              </tbody>
            </table>
            {data.length === 0 && (
              <p className="p-6 text-center text-slate-600 dark:text-slate-500 text-sm">
                {emptyMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
