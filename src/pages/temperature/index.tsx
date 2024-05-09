import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Table from "@/components/table";
import Modal from "@/components/modal";
import Input from "@/components/input";
import Button from "@/components/button";
import Selection from "@/components/selection";
import Pagination from "@/components/pagination";
import HeadingText from "@/components/heading-text";
import createNotification from "@/common/create-notification";

import { Columns } from "./columns";

import {
  deleteTemperature,
  getAllTemperature,
  updateTemperature,
} from "@/api-services/temperature";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import { useClients } from "@/context/context-collection";

import { TemperatureInterface } from "./temperature-interface";
import { OptionType } from "@/components/selection/selection-interface";

import styles from "./index.module.scss";

const Temperature: React.FC = () => {
  const { control, watch, register, setValue } = useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [updatedValues, setUpdatedValues] = useState<{
    tempId?: number;
    employeeCode?: number;
    isLoading?: boolean;
    isDeleted?: boolean;
  }>({
    isLoading: false,
    isDeleted: false,
  });
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [filtersData, setFiltersData] = useState<any>();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [getTemperature, setGetTemperature] = useState<TemperatureInterface[]>();

  const context = useClients();
  const employeeOptions = context ? context?.employeeOptions : [];

  const handleGetTemperature = async ({ employeeCode }: { employeeCode: string }) => {
    setIsLoading(true);
    try {
      const employeecode = Number(employeeCode);
      const response = await getAllTemperature({ id: employeecode });
      if (response?.status === true) {
        setGetTemperature(response?.temperatureData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleEditTemperature = ({ tempId }: { tempId: number }) => {
    const updatedData = getTemperature?.find((data) => {
      return data?.id === tempId;
    });
    setUpdatedValues({
      tempId: updatedData?.id as number,
      employeeCode: updatedData?.created_by as number,
    });
    setValue?.("equipment_name", updatedData?.equipment_name);
    setValue?.("temperature_value", updatedData?.temperature_value);
    setIsUpdate(true);
  };

  const handleUpdateTemp = async () => {
    setUpdatedValues((prev) => ({ ...prev, isLoading: true }));
    const data = {
      id: updatedValues?.tempId,
      equipment_name: watch("equipment_name"),
      temperature_value: watch("temperature_value"),
      employeecode: updatedValues?.employeeCode,
    };

    try {
      const res = await updateTemperature({ data });

      if (res.status === true) {
        const updatedData = getTemperature?.find((item) => item.id === data.id);

        if (updatedData) {
          const indexToUpdate = getTemperature?.findIndex((temp) => temp.id === data.id);

          if (indexToUpdate !== -1) {
            getTemperature[indexToUpdate] = {
              ...getTemperature[indexToUpdate],
              equipment_name: data.equipment_name,
              temperature_value: data.temperature_value,
            };
            setGetTemperature([...getTemperature]);
          }
        }

        setUpdatedValues((prev) => ({ ...prev, isLoading: false }));
        setIsUpdate(false);
        setValue?.("equipment_name", "");
        setValue?.("temperature_value", "");
        createNotification({ type: "success", message: res?.message });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async ({ deleteId }: { deleteId: number }) => {
    setUpdatedValues((prev) => ({ ...prev, isDeleted: true }));
    try {
      const res = await deleteTemperature({ id: deleteId });
      if (res.status === true) {
        const updatedData = getTemperature?.filter((item) => item.id != deleteId);
        setGetTemperature(updatedData);
        setUpdatedValues((prev) => ({ ...prev, isDeleted: false }));
        createNotification({ type: "success", message: res?.message });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTemperatureData = useMemo(() => {
    return getTemperature?.sort((a, b) => {
      const dateA = new Date(b.updated_at);
      const dateB = new Date(a.updated_at);
      return dateA.getTime() - dateB.getTime();
    });
  }, [getTemperature]);

  const handleApplyFilter = () => {
    const employeeData = watch("employeeCode")?.value;

    setFiltersData(employeeData);
  };

  useEffect(() => {
    handleGetTemperature({ employeeCode: filtersData });
  }, [filtersData]);

  return (
    <>
      <div className={styles.loading}>
        <HeadingText heading={"Temperature"} text="Temperature demo passage of here" />
        <div className={styles.btnContainer}>
          <Button
            title="Filter"
            handleClick={() => setIsFilter(true)}
            className={styles.filterButton}
          />
        </div>
        <div className={styles.pagination}>
          <Table
            rows={getTemperatureData as TemperatureInterface[]}
            columns={Columns}
            isLoading={isLoading}
            actions={({ row }) => {
              return (
                <td key={row?.id}>
                  <div className={styles.iconRow}>
                    <Button
                      type="button"
                      icon={editIcon}
                      className={styles.iconsBtn}
                      loaderClass={styles.loading}
                      handleClick={() => handleEditTemperature({ tempId: row?.id })}
                    />
                    <Button
                      type="button"
                      icon={delIcon}
                      className={styles.iconsBtn}
                      loaderClass={styles.loading}
                      handleClick={() => handleDelete({ deleteId: row?.id })}
                    />
                  </div>
                </td>
              );
            }}
          />
          <div className={styles.pagination}>
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
      </div>

      <Modal
        {...{
          open: isUpdate === true,
          handleClose: () => setIsUpdate(false),
        }}
        className={styles.ModalClassName}
      >
        <div className={styles.selectionsContainer}>
          <div className={styles.modalHeading}>Update Temperature</div>
          <div className={styles.selectionContainer}></div>

          <Input
            type="text"
            register={register}
            name="equipment_name"
            label={"Equipment Name"}
            className={styles.labelClass}
            inputClass={styles.dateClass}
          />

          <Input
            type="text"
            register={register}
            name="temperature_value"
            label={"Temperature Value"}
            className={styles.labelClass}
            inputClass={styles.dateClass}
          />
          <div className={styles.modalBtnContainer}>
            <Button
              title="cancel "
              handleClick={() => {
                setIsUpdate(false);
              }}
              className={styles.btn2}
            />
            <Button
              title="Update"
              className={styles.btn}
              handleClick={handleUpdateTemp}
              isLoading={updatedValues?.isLoading}
            />
          </div>
        </div>
      </Modal>

      <Modal
        {...{
          open: isFilter === true,
          handleClose: () => setIsFilter(false),
        }}
        className={styles.ModalClassName}
      >
        <div className={styles.selectionsContainer}>
          <div className={styles.modalHeading}>Temperature Filter</div>
          <div className={styles.selectionContainer}>
            <div className={styles.selections}>
              <Selection
                label="Employee "
                isMulti={false}
                name="employeeCode"
                options={employeeOptions as OptionType[]}
                control={control}
              />
            </div>
          </div>

          <Input
            type="date"
            name="from"
            label={"From"}
            className={styles.labelClass}
            inputClass={styles.dateClass}
          />

          <Input
            type="date"
            name="toDate"
            label={"To"}
            className={styles.labelClass}
            inputClass={styles.dateClass}
          />
          <div className={styles.modalBtnContainer}>
            <Button
              title="cancel "
              handleClick={() => {
                setIsFilter(false);
              }}
              className={styles.btn2}
            />
            <Button handleClick={handleApplyFilter} title="Apply Filter" className={styles.btn} />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Temperature;
