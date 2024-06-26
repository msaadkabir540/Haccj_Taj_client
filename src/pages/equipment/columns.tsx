import moment from "moment";

import { TableColumnRenderProps, TableColumns } from "@/components/table/table-interface";

const Columns: TableColumns[] = [
  {
    key: "equipment_name",
    title: "Equipment Name",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },
  {
    key: "created_by",
    title: "Employee ",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },
  {
    key: "updated_at",
    title: "Date",
    render: ({ value }: TableColumnRenderProps) => {
      return moment.utc(value as string).format("MMM DD, YYYY | HH:mm") as string;
    },
  },

  { key: "actions", title: "Action" },
];

export { Columns };
