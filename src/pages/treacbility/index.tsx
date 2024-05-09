import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Modal from "@/components/modal";
import Table from "@/components/table";
import Button from "@/components/button";
import Selection from "@/components/selection";
import Pagination from "@/components/pagination";
import HeadingText from "@/components/heading-text";

import { useClients } from "@/context/context-collection";

import {
  deleteTrasability,
  getAllTreacbility,
  updateTrasability,
} from "@/api-services/treacbility";

import { Columns } from "./columns";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import { OptionType } from "@/components/selection/selection-interface";

import styles from "./index.module.scss";
import Input from "@/components/input";
import createNotification from "@/common/create-notification";

const Treacbility: React.FC = () => {
  const { control, watch, setValue, register } = useForm();
  const [getTreacbility, setGetTreacbility] = useState();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [imageModal, setImageModal] = useState<{ url: string; isOpenImageModal: boolean }>({
    url: "",
    isOpenImageModal: false,
  });
  const [updatedValues, setUpdatedValues] = useState<{
    tempId?: number;
    employeeCode?: number;
    isLoading?: boolean;
    isDeleted?: boolean;
  }>({
    isLoading: false,
    isDeleted: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(true);
  const [filtersData, setFiltersData] = useState<any>();

  const context = useClients();
  const employeeOptions = context ? context?.employeeOptions : "";

  const handleGetTreacbility = async ({ employeeCode }: { employeeCode: number }) => {
    setIsLoading(true);
    try {
      const response = await getAllTreacbility({ employeecode: employeeCode });
      if (response?.status === true) {
        setGetTreacbility(response?.trasabilityData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleEditTemperature = ({ tempId }: { tempId: number }) => {
    const updatedData = getTreacbility?.find((data) => {
      return data?.id === tempId;
    });
    setUpdatedValues({
      tempId: updatedData?.id as number,
      employeeCode: updatedData?.created_by as number,
    });
    setValue?.("trasability_name", updatedData?.trasability_name);
    setValue?.("trasability_type", updatedData?.trasability_type);
    setIsUpdate(true);
  };

  const handleUpdateTemp = async () => {
    setUpdatedValues((prev) => ({ ...prev, isLoading: true }));
    const data = {
      id: updatedValues?.tempId,
      trasability_name: watch("trasability_name"),
      trasability_type: watch("trasability_type"),
      employeecode: updatedValues?.employeeCode,
    };

    try {
      const res = await updateTrasability({ data });

      if (res.status === true) {
        const updatedData = getTreacbility?.find((item) => item.id === data.id);

        if (updatedData) {
          const indexToUpdate = getTreacbility?.findIndex((temp) => temp.id === data.id);

          if (indexToUpdate !== -1) {
            getTreacbility[indexToUpdate] = {
              ...getTreacbility[indexToUpdate],
              equipment_name: data.equipment_name,
              temperature_value: data.temperature_value,
            };
            setGetTreacbility([...getTreacbility]);
          }
        }

        setUpdatedValues((prev) => ({ ...prev, isLoading: false }));
        setIsUpdate(false);
        setValue?.("trasability_name", "");
        setValue?.("trasability_type", "");
        createNotification({ type: "success", message: res?.message });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async ({ deleteId }: { deleteId: number }) => {
    setUpdatedValues((prev) => ({ ...prev, isDeleted: true }));
    try {
      const res = await deleteTrasability({ id: deleteId });
      if (res.status === true) {
        const updatedData = getTreacbility?.filter((item) => item.id != deleteId);
        setGetTreacbility(updatedData);
        setUpdatedValues((prev) => ({ ...prev, isDeleted: false }));
        createNotification({ type: "success", message: res?.message });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplyFilter = () => {
    const employeeData = watch("employeeCode")?.value;

    setFiltersData(employeeData);
  };

  useEffect(() => {
    handleGetTreacbility({ employeeCode: filtersData });
  }, [filtersData]);

  const handleOpenModal = ({ url }: { url: string }) => {
    setImageModal((prev) => ({ ...prev, url: url, isOpenImageModal: true }));
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <HeadingText heading="Treacbility" text="Treacbility data here" />
        </div>
        <div className={styles.btnContainer}>
          <Button
            title="Filter"
            handleClick={() => setIsFilter(true)}
            className={styles.filterButton}
          />
        </div>
        <Table
          rows={getTreacbility as any}
          columns={Columns({ handleOpenModal })}
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
                    handleClick={() => handleEditTemperature({ tracId: row?.id })}
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

        <Modal
          {...{
            open: isUpdate === true,
            handleClose: () => setIsUpdate(false),
          }}
          className={styles.ModalClassName}
        >
          <div className={styles.selectionsContainer}>
            <div className={styles.modalHeading}>Update Treacbility</div>
            <div className={styles.selectionContainer}></div>

            <Input
              type="text"
              register={register}
              name="trasability_name"
              label={"Trasability Name"}
              className={styles.labelClass}
              inputClass={styles.dateClass}
            />

            <Input
              type="text"
              register={register}
              name="trasability_type"
              label={"Trasability Type"}
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
            open: imageModal.isOpenImageModal === true,
            handleClose: () => setImageModal((prev) => ({ ...prev, isOpenImageModal: false })),
          }}
        >
          <img src={imageModal?.url} className={styles.videoPlayer} alt="images" />
        </Modal>

        <Modal
          {...{
            open: isFilter === true,
            handleClose: () => setIsFilter(false),
          }}
          className={styles.ModalClassName}
        >
          <div className={styles.selectionsContainer}>
            <div className={styles.modalHeading}>Treacbility Filter</div>
            <div className={styles.selectionContainer}>
              <div className={styles.selections}>
                <Selection
                  label="Employee "
                  isMulti={false}
                  name="employeeCode"
                  options={employeeOptions as OptionType[]}
                  control={control}
                  // singleValueMaxWidth={"10px"}
                  // singleValueMinWidth="200px"
                  // customWidth="200px"
                />
              </div>
            </div>

            <Input
              type="date"
              name="from"
              label={"From"}
              className={styles.labelClass}
              // errorMessage={error}
              inputClass={styles.dateClass}
              // onChange={(e) => setValue(e.target.value)}
            />

            <Input
              type="date"
              name="toDate"
              label={"To"}
              className={styles.labelClass}
              // errorMessage={error}
              inputClass={styles.dateClass}
              // onChange={(e) => setValue(e.target.value)}
            />
            <div className={styles.modalBtnContainer}>
              <Button
                title="cancel "
                handleClick={() => {
                  setIsFilter(false);
                }}
                className={styles.btn2}
              />
              <Button
                handleClick={handleApplyFilter}
                title="Apply Filter"
                className={styles.btn}
                // isLoading={isAddingUser}
              />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
export default Treacbility;
