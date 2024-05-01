import { TableColumnRenderProps, TableColumns } from "@/components/table/table-interface";

const Columns: TableColumns[] = [
  {
    key: "employeecode",
    title: "Employee Code",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },
  {
    key: "name",
    title: "Employee Name",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },
  {
    key: "department",
    title: "Department",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "email",
    title: "Email",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
      // return moment(value as string).format("DD-MM-YYYY");
    },
  },
  {
    key: "contact_no",
    title: "Contact Number",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  { key: "actions", title: "Action" },
];

export { Columns };
