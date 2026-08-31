import React from "react";
import { FiInbox } from "react-icons/fi";

export type columns<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type DataTabelType<T> = {
  data: T[];
  columns: columns<T>[];
  actions?: (row: T) => React.ReactNode;
};

function DataTabel<T>({ data, actions, columns }: DataTabelType<T>) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_10px_28px_-14px_rgba(15,23,42,0.18)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_10px_28px_-14px_rgba(0,0,0,0.6)]">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead
            className="border-b border-slate-200 bg-slate-100 font-Morabba-Bold font-semibold tracking-wide text-slate-900
            dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <tr>
              {columns.map((column, colIdx) => (
                <th
                  key={String(column.key) || colIdx}
                  scope="col"
                  className="whitespace-nowrap px-2 py-4 text-center"
                >
                  {column.label}
                </th>
              ))}

              {actions && (
                <th
                  scope="col"
                  className="whitespace-nowrap px-2 py-4 text-center"
                >
                  عملیات
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-Dana-Medium text-slate-700 dark:divide-slate-800/80 dark:text-slate-300">
            {data?.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="group transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {columns.map((column, colIdx) => {
                    const value = row[column.key];
                    return (
                      <td
                        key={String(column.key) || colIdx}
                        className="whitespace-nowrap px-2 py-4 text-center text-sm text-slate-600 transition-colors group-hover:text-slate-950 dark:text-slate-300 dark:group-hover:text-white"
                      >
                        {column.render
                          ? column.render(value, row)
                          : ((value as React.ReactNode) ?? (
                              <span className="text-slate-200 dark:text-slate-900">
                                —
                              </span>
                            ))}
                      </td>
                    );
                  })}

                  {actions && (
                    <td className="whitespace-nowrap px-2 py-4">
                      <div className="flex items-center justify-center gap-x-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="py-14 text-center"
                >
                  <div className="flex flex-col items-center gap-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600">
                      <FiInbox className="h-5 w-5" strokeWidth={1.5} />
                    </div>

                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      داده‌ای برای نمایش یافت نشد.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTabel;
