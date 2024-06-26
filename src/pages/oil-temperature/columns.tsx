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
    key: "machine_name",
    title: "Machine Name",
    render: ({ value }: TableColumnRenderProps) => {
      // return value?.[0] || "";
      return value as string;
    },
  },
  {
    key: "machine_type",
    title: "Machine Type",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
    },
  },
  {
    key: "oil_temperature",
    title: "Oil Temperature",
    render: ({ value }: TableColumnRenderProps) => {
      return value as string;
      // return moment(value as string).format("MMM DD, YYYY | HH:mm");
    },
  },
  {
    key: "created_at",
    title: "Create",
    render: ({ value }: TableColumnRenderProps) => {
      return moment.utc(value as string).format("MMM DD, YYYY | HH:mm") as string;
    },
  },
  { key: "actions", title: "Action" },
];

export { Columns };
