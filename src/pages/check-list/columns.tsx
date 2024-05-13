import { TableColumnRenderProps, TableColumns } from "@/components/table/table-interface";
import moment from "moment";

const Columns: TableColumns[] = [
  {
    key: "task",
    title: "Task",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },

  {
    key: "message",
    title: "Message",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },
  {
    key: "assign_to_name",
    title: "Assign To",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },
  {
    key: "created_by_name",
    title: "Assign By",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },
  {
    key: "created_at",
    title: "Date",
    render: ({ value }: TableColumnRenderProps) => {
      return moment(value as string).format("DD-MM-YYYY") as string;
    },
  },
  { key: "actions", title: "Action" },
];

export { Columns };
