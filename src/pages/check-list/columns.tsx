import { TableColumnRenderProps, TableColumns } from "@/components/table/table-interface";
import moment from "moment";

import styles from "./index.module.scss";

const Columns = ({
  handleOpenModal,
}: {
  handleOpenModal: ({ url }: { url: string }) => void;
}): TableColumns[] => [
  // {
  //   key: "image",
  //   title: "Image",
  //   render: ({ row }: TableColumnRenderProps) => {
  //     return (
  //       <div className={styles.thumbnailContainer}>
  //         <div className={`${styles.iconDiv} flex items-center gap-4`}>
  //           <p>{(row?.index != null ? row.index + 1 : undefined) as number}</p>
  //           <div
  //             className={` ${styles.imagesDiv} `}
  //             onClick={() =>
  //               handleOpenModal?.({
  //                 url: `https://laravel.haccptaj.com/${row.image}`,
  //               })
  //             }
  //           >
  //             {(row as any)?.image && (
  //               <img
  //                 src={`https://laravel.haccptaj.com/${row.image}` as string}
  //                 alt="themeVideoThumbnailUrl"
  //                 style={{ borderRadius: "3px" }}
  //               />
  //             )}
  //             {/* <div className={styles.text}>{row?.image_name}</div> */}
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   },
  // },
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
      return moment.utc(value as string).format("MMM DD, YYYY") as string;
    },
  },
  {
    key: "assign_start",
    title: "Assign From",
    render: ({ value }: TableColumnRenderProps) => {
      return moment.utc(value as string).format("MMM DD, YYYY") as string;
    },
  },
  {
    key: "assign_end",
    title: "Assign End",
    render: ({ value }: TableColumnRenderProps) => {
      return moment.utc(value as string).format("MMM DD, YYYY") as string;
    },
  },
  {
    key: "decision",
    title: "Task Status",
    render: ({ value }: TableColumnRenderProps) => {
      const finalDecision = value === "P" ? "Pending" : "Done";
      return (
        <div
          style={{
            fontWeight: "600",
            // background: value === "P" ? "#ffff4785" : "#00800085",
            color: value === "P" ? "red" : "green",
          }}
        >
          {finalDecision}{" "}
        </div>
      );
    },
  },
  { key: "actions", title: "Action" },
];

export { Columns };
