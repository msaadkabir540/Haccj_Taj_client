import { TableColumnRenderProps, TableColumns } from "@/components/table/table-interface";
import moment from "moment";

const Columns: TableColumns[] = [
  // {
  //   key: "employeeName",
  //   title: "Employee Name",
  //   render: ({ value }: TableColumnRenderProps) => {
  //     // return value?.[0] || "";
  //     return value as string;
  //   },
  // },
  {
    key: "machine_name",
    title: "Product Name",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },

  {
    key: "created_at",
    title: "Created At",
    render: ({ value }: TableColumnRenderProps) => {
      return moment.utc(value as string).format("MMM DD, YYYY | HH:mm") as string;
    },
  },
  { key: "actions", title: "Action" },
];

export { Columns };
