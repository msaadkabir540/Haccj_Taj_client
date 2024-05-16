import TableBtnStructure from "@/components/table-btn-structure";

import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { useForm } from "react-hook-form";
import Button from "@/components/button";
import { useClients } from "@/context/context-collection";
import { addMachine, deleteMachine } from "@/api-services/machine";
import createNotification from "@/common/create-notification";
import { getAllOilTempAndMachine } from "@/api-services/oil-temperature";
import { Columns } from "./columns";

const Machine: React.FC = () => {
  const { register, setValue, watch, control } = useForm();
  const loggedInEmployeeCode = localStorage?.getItem("employeecode") || "";

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<number>(0);
  const [getAllMachine, setGetAllMachine] = useState<any>();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [filtersData, setFiltersData] = useState<string>("");
  const [isCreateUpdate, setIsCreateUpdate] = useState<{
    isLoading: boolean;
    isUpdated: boolean;
    isGetLoading?: boolean;
  }>({
    isLoading: false,
    isGetLoading: false,
    isUpdated: false,
  });

  const context = useClients();
  const employeeOptions = context ? context?.employeeOptions : "";
  const getUserUsername = context ? context?.getUserUsername : {};
  const loggedInUser = context ? context?.loggedInUser : "";
  const isAdmin = context ? context?.isAdmin : "";

  const handleOpenCreate = () => setIsOpen(true);

  const employeeName = getUserUsername[loggedInEmployeeCode] || loggedInEmployeeCode;

  const allMachineByEmployeeName = getAllMachine?.map((data) => ({
    ...data,
    employeeName: getUserUsername[data?.employeecode as string] || data?.employeecode,
  }));

  const handleCreateUpdateMachine = async () => {
    setIsCreateUpdate((prev) => ({ ...prev, isLoading: true }));
    const data = {
      employeecode: Number(loggedInEmployeeCode),
      machine_name: watch("machine_name"),
    };
    try {
      const res = await addMachine({ data });
      if (res.status) {
        setIsAdded(isAdded + 1);
        setIsOpen(false);
        setIsCreateUpdate((prev) => ({ ...prev, isLoading: false }));
        createNotification({ type: "success", message: "Add Machine successfully." });
      }
    } catch (error) {
      setIsCreateUpdate((prev) => ({ ...prev, isLoading: false }));
      console.error(error);
    }
  };

  const handleGetMachine = async () => {
    setIsCreateUpdate((prev) => ({ ...prev, isGetLoading: true }));
    try {
      const applyFilter = {
        employee: filtersData,
        employeecode: Number(loggedInUser),
      };
      const response = await getAllOilTempAndMachine({ data: applyFilter });
      if (response?.status === true) {
        setGetAllMachine(response?.oilMachineData);
        setIsCreateUpdate((prev) => ({ ...prev, isGetLoading: false }));
      }
    } catch (error) {
      setIsCreateUpdate((prev) => ({ ...prev, isGetLoading: false }));

      console.error(error);
    }
  };

  const handleFilterOpen = (argu: boolean) => {
    setIsFilter(argu);
  };
  const handleApplyFilter = () => {
    const employeeCode = watch("employeeCode")?.value;
    setFiltersData(employeeCode);
    setIsFilter(false);
  };

  const handleDelete = async ({ deleteId }: { deleteId: number }) => {
    setIsCreateUpdate((prev) => ({ ...prev, isDeleted: true, deleteId: deleteId }));
    try {
      const res = await deleteMachine({ id: deleteId });
      if (res.status === true) {
        const updatedData = getAllMachine?.filter((item) => item.id != deleteId);
        setGetAllMachine(updatedData);
        setIsCreateUpdate((prev) => ({ ...prev, isDeleted: false }));
        createNotification({ type: "success", message: res?.message });
      }
    } catch (error) {
      setIsCreateUpdate((prev) => ({ ...prev, isDeleted: false }));
      console.error(error);
    }
  };

  useEffect(() => {
    if (employeeName) {
      setValue?.("employeecode", employeeName);
    }
  }, [employeeName, setValue]);

  useEffect(() => {
    handleGetMachine();
  }, [filtersData, isAdded]);

  return (
    <div className={styles.header}>
      <TableBtnStructure
        isCreate={true}
        isUpdate={false}
        control={control}
        headingText="Machine"
        ColumnsData={Columns}
        handleDelete={handleDelete}
        rowData={allMachineByEmployeeName}
        handleOpenCreate={handleOpenCreate}
        SelectOption={employeeOptions as any}
        headerPassage="Machine demo passage of here"
        isTableLoading={isCreateUpdate?.isGetLoading as boolean}
      />

      <Modal
        {...{
          open: isOpen === true,
          handleClose: () => setIsOpen(false),
        }}
        className={styles.modalClassName}
      >
        <div className={styles.selectionsContainer}>
          <div
            className={styles.modalHeading}
          >{`${isCreateUpdate?.isUpdated ? "Update" : "Create"} Machine`}</div>
          <div className={styles.selectionContainer}></div>
          <Input
            type="text"
            register={register}
            name="employeecode"
            label={"Employee Name"}
            className={styles.labelClass}
            inputClass={styles.dateClass}
          />
          <Input
            type="text"
            register={register}
            name="machine_name"
            label={"machine_name"}
            className={styles.labelClass}
            inputClass={styles.dateClass}
          />

          <div className={styles.modalBtnContainer}>
            <Button
              title="cancel "
              handleClick={() => {
                setIsOpen(false);
              }}
              className={styles.btn2}
            />
            <Button
              type="submit"
              title="Save"
              className={styles.btn}
              handleClick={handleCreateUpdateMachine}
              isLoading={isCreateUpdate?.isLoading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default Machine;
