import styles from "./index.module.scss";
import TableBtnStructure from "@/components/table-btn-structure";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  deleteOilTemperature,
  getAllOilTemp,
  getAllOilTempAndMachine,
  updateOilTemp,
} from "@/api-services/oil-temperature";
import { Columns } from "./columns";
import Modal from "@/components/modal";
import { useClients } from "@/context/context-collection";
import createNotification from "@/common/create-notification";
import Input from "@/components/input";
import Button from "@/components/button";

const OilTemperature: React.FC = () => {
  const { register, handleSubmit, reset, setValue, control, watch } = useForm();
  const [isCreate, setIsCreate] = useState<{
    isLoading?: boolean;
    isOpenImageModal?: boolean;
    url?: string;
  }>({
    url: "",
    isLoading: false,
    isOpenImageModal: false,
  });

  const [updatedValues, setUpdatedValues] = useState<{
    id?: number;
    employeeCode?: number;
    deleteId?: number;
    isLoading?: boolean;
    isDeleted?: boolean;
  }>({
    isLoading: false,
    isDeleted: false,
  });

  const [getOilTemperature, setGetOilTemperature] = useState();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [filtersData, setFiltersData] = useState<{
    employeeCode: string;
    date: any;
    edate: any;
  }>();

  const context = useClients();
  const employeeOptions = context ? context?.employeeOptions : "";
  const loggedInUser = context ? context?.loggedInUser : "";
  const isAdmin = context ? context?.isAdmin : false;

  const handleGetTemperature = async ({ date, edate }: { date: any; edate: any }) => {
    setIsCreate((prev) => ({ ...prev, isLoading: true }));

    try {
      const applyFilter = filtersData
        ? {
            employee: filtersData?.employeeCode,
          }
        : {
            employeecode: Number(loggedInUser),
          };
      const response = await getAllOilTempAndMachine({ data: { ...applyFilter, date, edate } });
      if (response?.status === true) {
        setGetOilTemperature(response?.oilTemperatureData);
        setIsCreate((prev) => ({ ...prev, isLoading: false }));
        setIsFilter(false);
      }
    } catch (error) {
      setIsCreate((prev) => ({ ...prev, isLoading: false }));

      console.error(error);
    }
  };

  const handleOpenModal = ({ url }: { url: string }) => {
    setIsCreate((prev) => ({ ...prev, url: url, isOpenImageModal: true }));
  };

  const handleFilterOpen = (argu: boolean) => {
    setIsFilter(argu);
  };

  const handleApplyFilter = () => {
    const employeeData = watch("employeeCode")?.value;
    const date = watch("from");
    const edate = watch("toDate");
    setFiltersData({ employeeCode: employeeData, date, edate });
    setIsFilter(false);
  };

  const handleEdit = ({ editId }: { editId: number }) => {
    const updatedData = getOilTemperature?.find((data) => {
      return data?.id === editId;
    });

    setUpdatedValues((prev) => ({
      ...prev,
      id: updatedData?.id,
      employeeCode: updatedData?.employeecode,
    }));
    setValue?.("machine_type", updatedData?.machine_type);
    setValue?.("oil_temperature", updatedData?.oil_temperature);
    setValue?.("machine_name", updatedData?.machine_name);
    setIsUpdate(true);
  };

  const handleUpdateOilTemp = async () => {
    setUpdatedValues((prev) => ({ ...prev, isLoading: true }));
    const data = {
      id: updatedValues?.id,
      machine_type: watch("machine_type"),
      oil_temperature: watch("oil_temperature"),
      machine_name: watch("machine_name"),
      employeecode: updatedValues?.employeeCode,
    };

    try {
      const res = await updateOilTemp({ data });

      if (res.status === true) {
        const updatedData = getOilTemperature?.find((item) => item.id === data.id);

        if (updatedData) {
          const indexToUpdate = getOilTemperature?.findIndex((temp) => temp.id === data.id);

          if (indexToUpdate !== -1) {
            getOilTemperature[indexToUpdate] = {
              ...getOilTemperature[indexToUpdate],
              machine_type: data.machine_type,
              oil_temperature: data.oil_temperature,
              machine_name: data.machine_name,
            };
            setGetOilTemperature([...getOilTemperature]);
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
    setUpdatedValues((prev) => ({ ...prev, isDeleted: true, deleteId: deleteId }));
    try {
      const res = await deleteOilTemperature({ id: deleteId });
      if (res.status === true) {
        const updatedData = getOilTemperature?.filter((item) => item.id != deleteId);
        setGetOilTemperature(updatedData);
        setUpdatedValues((prev) => ({ ...prev, isDeleted: false }));
        createNotification({ type: "success", message: res?.message });
      }
    } catch (error) {
      setUpdatedValues((prev) => ({ ...prev, isDeleted: false }));
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetTemperature({ date: filtersData?.date, edate: filtersData?.edate });
  }, [filtersData]);

  return (
    <div className={styles.header}>
      <TableBtnStructure
        isCreate={false}
        isExport={true}
        fileName="Oil_Temperature"
        control={control}
        isFilter={isFilter}
        isDate={true}
        register={register}
        isFilterValid={isAdmin as boolean}
        handleDelete={handleDelete}
        rowData={getOilTemperature}
        headingText="Oil Temperature"
        handleEdit={handleEdit}
        deleteId={updatedValues?.deleteId}
        isDeleted={updatedValues?.isDeleted}
        handleFilterOpen={handleFilterOpen}
        handleApplyFilter={handleApplyFilter}
        SelectOption={employeeOptions as any}
        ColumnsData={Columns({ handleOpenModal })}
        isTableLoading={isCreate?.isLoading as boolean}
        headerPassage="Oli Temperature demo passage of here"
      />
      <Modal
        {...{
          open: isCreate?.isOpenImageModal === true,
          handleClose: () => setIsCreate((prev) => ({ ...prev, isOpenImageModal: false })),
        }}
      >
        <img src={isCreate?.url} className={styles.videoPlayer} alt="images" />
      </Modal>

      <Modal
        {...{
          open: isUpdate === true,
          handleClose: () => setIsUpdate(false),
        }}
        className={styles.ModalClassName}
      >
        <div className={styles.selectionsContainer}>
          <div className={styles.modalHeading}>Update Oli Temperature</div>
          <div className={styles.selectionContainer}></div>
          <Input
            type="text"
            register={register}
            name="machine_name"
            label={"Machine Name"}
            className={styles.labelClass}
            inputClass={styles.dateClass}
          />
          <Input
            type="text"
            register={register}
            name="machine_type"
            label={"Machine Type"}
            className={styles.labelClass}
            inputClass={styles.dateClass}
          />

          <Input
            type="text"
            register={register}
            name="oil_temperature"
            label={"Oil Temperature"}
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
              handleClick={handleUpdateOilTemp}
              isLoading={updatedValues?.isLoading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default OilTemperature;
