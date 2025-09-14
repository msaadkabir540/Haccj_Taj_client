import { TableColumnRenderProps, TableColumns } from "@/components/table/table-interface";
import Button from "@/components/button";
import moment from "moment";
import styles from "./index.module.scss";

import location from "@/assets/assets/location.png";

const Columns: TableColumns[] = [
  {
    key: "employeeName",
    title: "Employee Name",
    render: ({ value }: TableColumnRenderProps) => value as string,
  },
  {
    key: "check_in",
    title: "Check In",
    render: ({ value }: TableColumnRenderProps) =>
      value ? moment.utc(value as string).format("MMM DD, YYYY | HH:mm") : "-",
  },
  {
    key: "check_out",
    title: "Check Out",
    render: ({ value }: TableColumnRenderProps) =>
      value ? moment.utc(value as string).format("MMM DD, YYYY | HH:mm") : "-",
  },
  {
    key: "total_hours",
    title: "Working Hours",
    render: ({ value }: any) => value || "-",
  },
  {
    key: "check_in_location",
    title: "Check In Location",
    render: ({ value, row }: TableColumnRenderProps & { row: any }) =>
      value ? (
        <div className={styles.mapBtn}>
          <img
            src={location}
            alt={"button icon"}
            width={24}
            height={24}
            onClick={() => row.onOpenMap(row.check_in_lat, row.check_in_lng)}
          />
        </div>
      ) : (
        // <Button
        //   type="button"
        //   // title="View on Map"
        //   // className={styles.mapBtn}
        //   handleClick={() => row.onOpenMap(row.check_in_lat, row.check_in_lng)}
        // />
        "-"
      ),
  },
  {
    key: "check_out_location",
    title: "Check Out Location",
    render: ({ value, row }: TableColumnRenderProps & { row: any }) =>
      value ? (
        <div className={styles.mapBtn}>
          <img
            src={location}
            alt={"button icon"}
            width={24}
            height={24}
            onClick={() => row.onOpenMap(row.check_out_lat, row.check_out_lng)}
          />
        </div>
      ) : (
        "-"
      ),
  },
];

export { Columns };
