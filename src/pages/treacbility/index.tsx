import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Modal from "@/components/modal";
import Table from "@/components/table";
import Input from "@/components/input";
import Button from "@/components/button";
import Selection from "@/components/selection";
import HeadingText from "@/components/heading-text";
import createNotification from "@/common/create-notification";

import { useClients } from "@/context/context-collection";

import {
  deleteTrasability,
  getAllTreacbility,
  updateTrasability,
} from "@/api-services/treacbility";

import { Columns } from "./columns";

import { downloadReport } from "@/utils/helper";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import { OptionType } from "@/components/selection/selection-interface";

import styles from "./index.module.scss";

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
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [filtersData, setFiltersData] = useState<any>();

  const context = useClients();
  const employeeOptions = context ? context?.employeeOptions : "";
  const loggedInUser = context ? context?.loggedInUser : "";
  const loggedAdminStatus = context ? context?.loggedAdminStatus : "";
  const isAdmin = loggedAdminStatus === "1" ? true : false;

  const getUserUsername = context ? context?.getUserUsername : {};

  const getTreacbilityByName = getTreacbility?.map((data) => ({
    ...data,
    created_by_name: getUserUsername[data?.created_by as string] || data?.created_by,
  }));

  const handleGetTreacbility = async ({
    date,
    edate,
    // expire_at,
  }: {
    date: any;
    edate: any;
  }) => {
    setIsLoading(true);

    const applyFilter = {
      employee: filtersData?.employeeCode,
      employeecode: Number(loggedInUser),
      date,
      edate,
      // expire_at,
    };
    try {
      const response = await getAllTreacbility({ data: applyFilter });
      if (response?.status === true) {
        setGetTreacbility(response?.trasabilityData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleEditTemperature = ({ tracId }: { tracId: number }) => {
    const updatedData = getTreacbility?.find((data) => {
      return data?.id === tracId;
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
      expire_at: watch("expireAt"),
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
              trasability_name: data.trasability_name,
              trasability_type: data.trasability_type,
              expire_at: data.expire_at,
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
    const date = watch("from");
    const edate = watch("toDate");
    setFiltersData({ employeeCode: employeeData, date, edate });
    setIsFilter(false);
  };

  useEffect(() => {
    handleGetTreacbility({
      date: filtersData?.date,
      edate: filtersData?.edate,
    });
  }, [filtersData]);

  const handleOpenModal = ({ url }: { url: string }) => {
    setImageModal((prev) => ({ ...prev, url: url, isOpenImageModal: true }));
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <HeadingText heading="Trasability" text="Represent the Products Records" />
        </div>
        <div className={styles.btnContainer}>
          <Button
            title="Filter"
            handleClick={() => setIsFilter(true)}
            className={styles.filterButton}
          />
          {isAdmin && (
            <Button
              title="Export Data"
              handleClick={() =>
                downloadReport({ data: getTreacbilityByName, fileName: "Treacbility" })
              }
              className={styles.filterButton}
            />
          )}
        </div>

        <Table
          rows={getTreacbilityByName as any}
          columns={Columns({ handleOpenModal })}
          isLoading={isLoading}
          actions={({ row }) => {
            return (
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
            );
          }}
        />

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
            <Input
              type="date"
              name="expireAt"
              label={"Expire At"}
              className={styles.labelClass}
              register={register}
              // errorMessage={error}
              inputClass={styles.dateClass}
              // onChange={(e) => setValue(e.target.value)}
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
              {isAdmin && (
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
              )}
            </div>

            <Input
              type="date"
              name="from"
              label={"From"}
              register={register}
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
              register={register}
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
