import { Fragment, memo } from "react";

import Loading from "@/components/loading";

import sortUp from "@/assets/sortUp.svg";
import sortDown from "@/assets/sortDown.svg";
import sort from "@/assets/sort-svgrepo-com.svg";

import { TableInterface } from "./table-interface";

const Table: React.FC<TableInterface> = ({
  rows,
  columns,
  editing,
  actions,
  rowStyles,
  isLoading,
  sortColumn,
  handleSort,
  handleRowClick,
  tableCustomClass,
}) => {
  return (
    <>
      {!isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="max-h-[500px] overflow-y-auto rounded-2xl">
            <table className={`min-w-full divide-y divide-gray-200 ${tableCustomClass ?? ""}`}>
              {/* Header */}
              <thead className="bg-[#438afe] text-[#fff]">
                <tr>
                  {columns?.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-left text-[15px] font-medium text-[#fff] uppercase tracking-wider cursor-pointer select-none"
                      onClick={() =>
                        !sortColumn || column?.sortKey !== sortColumn?.sortBy
                          ? handleSort &&
                            handleSort({ sortBy: column?.sortKey || "", sortOrder: "asc" })
                          : sortColumn.sortOrder === "asc"
                            ? handleSort &&
                              handleSort({ sortBy: column.sortKey, sortOrder: "desc" })
                            : handleSort && handleSort({ sortBy: column.sortKey, sortOrder: "asc" })
                      }
                    >
                      <div className="flex items-center gap-1">
                        {column?.title}
                        {column?.sortKey && (
                          <>
                            {!sortColumn || column?.sortKey !== sortColumn?.sortBy ? (
                              <img src={sort} height={16} width={16} alt="sort" />
                            ) : sortColumn?.sortOrder === "asc" ? (
                              <img src={sortUp} height={16} width={16} alt="sortUp" />
                            ) : (
                              <img src={sortDown} height={16} width={16} alt="sortDown" />
                            )}
                          </>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body */}
              {rows?.length > 0 && (
                <tbody className="divide-y divide-gray-200 bg-white">
                  {rows?.map((row, index) => (
                    <Fragment key={index}>
                      <tr
                        key={row?.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                        style={rowStyles ? rowStyles(row) : {}}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick && handleRowClick(row);
                        }}
                      >
                        {columns?.map((column, colIndex) => {
                          if (column?.key === "actions")
                            return (
                              actions && (
                                <td
                                  key={row?.id}
                                  className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                                >
                                  {actions({ row, index: colIndex })}
                                </td>
                              )
                            );

                          return (
                            <td
                              key={`${colIndex}-${column.key}`}
                              className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                            >
                              {column?.render &&
                                column?.render({
                                  row,
                                  index,
                                  value: row?.[column?.key] || "",
                                  editing,
                                })}
                            </td>
                          );
                        })}
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              )}

              {/* Empty State */}
              {(rows?.length === 0 || rows === undefined || null) && (
                <tbody>
                  <tr>
                    <td
                      colSpan={columns?.length ?? 1}
                      className="px-6 py-8 text-center text-gray-500 text-sm"
                    >
                      No Data
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        </div>
      ) : (
        <Loading
          pageLoader={true}
          loaderClass="flex items-center justify-center"
          diffHeight={600}
        />
      )}
    </>
  );
};

export default memo(Table);
