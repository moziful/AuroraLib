export default function DataTable({
  headers,
  data,
  renderRow,
  emptyMessage = "No transactions found.",
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="bg-slate-950 text-xs font-semibold uppercase text-slate-500 border-b border-slate-800">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
      {data.length === 0 && (
        <p className="p-6 text-center text-slate-500 text-sm">{emptyMessage}</p>
      )}
    </div>
  );
}
