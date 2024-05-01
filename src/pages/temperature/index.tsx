import { useEffect, useState } from "react";

import Button from "@/components/button";
import Table from "@/components/table";
import createNotification from "@/common/create-notification";

import { Columns } from "./columns";

import { getAllTemperature } from "@/api-services/temperature";
import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import { TemperatureInterface } from "./temperature-interface";

import styles from "./index.module.scss";
import Pagination from "@/components/pagination";

const Temperature: React.FC = () => {
  const [getTemperature, setGetTemperature] = useState<TemperatureInterface[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGetTemperature = async () => {
    setIsLoading(true);
    try {
      const employeeCode = localStorage.getItem("employeecode");
      if (!employeeCode) {
        createNotification({ type: "error", message: "Please login again" });
        setIsLoading(false);
      } else {
        const employeecode = Number(employeeCode);
        const response = await getAllTemperature({ id: 427 });
        if (response?.status === true) {
          setGetTemperature(response?.temperatureData);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  console.log({ getTemperature });

  useEffect(() => {
    handleGetTemperature();
  }, []);

  return (
    <div className={styles.loading}>
      <div>
        <Table
          rows={getTemperature as TemperatureInterface[]}
          columns={Columns}
          isLoading={isLoading}
          actions={({ row }) => {
            return (
              <td className={styles.iconRow} key={row?.id}>
                <Button
                  type="button"
                  icon={editIcon}
                  className={styles.iconsBtn}
                  loaderClass={styles.loading}

                  // handleClick={() => {
                  //   navigate(`/template/${row?._id}`);
                  // }}
                />
                <Button
                  type="button"
                  icon={delIcon}
                  className={styles.iconsBtn}
                  loaderClass={styles.loading}
                  // isLoading={isDeleting === row?._id}
                  // handleClick={() => handleDelete(row?._id)}
                />
              </td>
            );
          }}
        />
        <Pagination
          page={1}
          pageSize={10}
          totalCount={20}
          // control={control}
          // setValue={setValue}
          perPageText="Records per page"
        />
      </div>
    </div>
  );
};
export default Temperature;
