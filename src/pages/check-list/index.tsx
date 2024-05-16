import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Table from "@/components/table";
import Button from "@/components/button";
import Selection from "@/components/selection";
import Pagination from "@/components/pagination";
import HeadingText from "@/components/heading-text";

import styles from "./index.module.scss";
import { useClients } from "@/context/context-collection";
import {
  addCheckList,
  deleteCheckList,
  getCheckListByEmployeeCode,
  updateCheckList,
} from "@/api-services/check-list";
import Input from "@/components/input";
import Modal from "@/components/modal";
import createNotification from "@/common/create-notification";
import { Columns } from "./columns";
import TableBtnStructure from "@/components/table-btn-structure";

const CheckList = () => {
  const { control, register, watch, setValue, reset } = useForm();

  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [getAllCheckList, setGetAllCheckList] = useState();
  const [filtersData, setFiltersData] = useState<any>();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isCreate, setIsCreate] = useState<{
    isLoading?: boolean;
    isOpenImageModal?: boolean;
    url?: string;
    isTableLoading?: boolean;
    isUpdateRowId?: number;
    isAddUpdate?: number | undefined;
  }>({
    url: "",
    isAddUpdate: 0,
    isLoading: false,
    isTableLoading: false,
    isOpenImageModal: false,
  });

  const employeeCode = localStorage.getItem("employeecode");

  const context = useClients();
  const allEmployees = context ? context?.allEmployees : "";
  const loggedInUser = context ? context?.loggedInUser : "";
  const getUserUsername = context ? context?.getUserUsername : "";
  const loggedAdminStatus = context ? context?.loggedAdminStatus : "";
  const isAdmin = loggedAdminStatus === "1" ? true : false;

  const getAllCheckListByName = getAllCheckList?.map((data) => ({
    ...data,
    assign_to_name: getUserUsername[data?.assign_to as string] || data?.assign_to,
    created_by_name: getUserUsername[data?.created_by as string] || data?.created_by,
  }));
  const findLoggedInEmployee = allEmployees?.find((user) => {
    return user?.employeecode === Number(employeeCode);
  });

  const employeeOptions =
    allEmployees?.map((data: any) => ({
      value: data?.employeecode,
      label: data?.name,
    })) || [];

  const handleGetCheckList = async ({
    date,
    edate,
    assign_to,
  }: {
    date: any;
    edate: any;
    assign_to: string;
  }) => {
    try {
      const applyFilter = {
        employee: filtersData?.employeeCode,
        employeecode: Number(loggedInUser),
      };

      setIsCreate((prev) => ({ ...prev, isTableLoading: true }));
      const res = await getCheckListByEmployeeCode({
        data: { ...applyFilter, date, edate, assign_to },
      });
      const checkListData = res?.data === "N/A" ? [] : res?.data;

      if (res.status === true) {
        setGetAllCheckList(checkListData);
        setIsCreate((prev) => ({ ...prev, isTableLoading: false }));
      }
    } catch (error) {
      setIsCreate((prev) => ({ ...prev, isTableLoading: false }));
      console.error(error);
    }
  };

  const handleAddCheckList = async () => {
    if (watch("assignTo")?.value === "") {
      setError("Please Enter Employee");
    } else {
      setIsLoading(true);
      setError("");
      try {
        const data = {
          employeecode: findLoggedInEmployee?.employeecode,
          task: watch("task"),
          message: watch("message"),
          assign_to: Number(watch("assignTo")?.value),
        };

        const res = isUpdate
          ? await updateCheckList({
              data: { id: isCreate?.isUpdateRowId, ...data },
            })
          : await addCheckList({
              data,
            });
        isUpdate
          ? createNotification({
              type: "success",
              message: res.message || "Task update successfully.",
            })
          : createNotification({
              type: "success",
              message: res.message || "Task add successfully",
            });
        if (res.status === true) {
          reset({});
          setIsOpen(false);
          setIsUpdate(false);
          setIsLoading(false);
          setIsCreate((prev) => ({ ...prev, isAddUpdate: 1 + 1 }));
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
  };

  const handleFilterOpen = (argu: boolean) => {
    setIsFilter(argu);
  };

  const handleApplyFilter = () => {
    const employeeData = watch("employeeCode")?.value;
    const date = watch("from");
    const edate = watch("toDate");
    const assign_to = watch("assign_to")?.value;
    setFiltersData({ employeeCode: employeeData, date, edate, assign_to });
    setIsFilter(false);
  };

  const handleOpenCreate = () => setIsOpen(true);

  const handleEdit = ({ editId }: { editId: number }) => {
    const updatedData = getAllCheckList?.find((data) => {
      return data?.id === editId;
    });
    setIsCreate((prev) => ({ ...prev, isUpdateRowId: editId }));
    setValue("message", updatedData?.message);
    setValue("task", updatedData?.task);
    const setAssignTo = employeeOptions?.find((data) => {
      return data?.value === updatedData?.assign_to;
    });

    setValue("assignTo", setAssignTo);
    setIsOpen(true);
    setIsUpdate(true);
  };

  const handleDelete = async ({ deleteId }: { deleteId: number }) => {
    setIsCreate((prev) => ({ ...prev, isDelete: true }));
    try {
      const res = await deleteCheckList({ id: deleteId });
      if (res.status === true) {
        const updatedData = getAllCheckList?.filter((item) => item.id != deleteId);
        setGetAllCheckList(updatedData);
        setIsCreate((prev) => ({ ...prev, isDelete: false }));

        createNotification({ type: "success", message: res?.message });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetCheckList({
      date: filtersData?.date,
      edate: filtersData?.edate,
      assign_to: filtersData?.assign_to,
    });
  }, [filtersData, isCreate?.isAddUpdate]);

  useEffect(() => {
    if (employeeCode) {
      setEmployeeName(findLoggedInEmployee?.name);
      setValue?.("employee", findLoggedInEmployee?.name);
    }
  }, [employeeCode, findLoggedInEmployee, setValue]);

  return (
    <div>
      <TableBtnStructure
        isDate={true}
        isExport={isAdmin}
        fileName="CheckList"
        isCreate={isAdmin}
        control={control}
        isFilter={isFilter}
        isAdmin={isAdmin}
        isFilterValid={true}
        ColumnsData={Columns}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        register={register}
        isAssignTo={true}
        headingText="Check List"
        rowData={getAllCheckListByName}
        handleOpenCreate={handleOpenCreate}
        handleFilterOpen={handleFilterOpen}
        handleApplyFilter={handleApplyFilter}
        SelectOption={employeeOptions as any}
        isTableLoading={isCreate?.isTableLoading as boolean}
        headerPassage="Recordable path tracking"
      />

      {isOpen && (
        <Modal
          open={isOpen}
          showCross={true}
          handleCross={() => {
            reset({});
            setIsLoading(false);
            setIsOpen(false);
            setIsUpdate(false);
          }}
          className={`${styles.modalWrapper}`}
        >
          <div>
            <div className={styles.heading}>Add Check List</div>
            <form>
              <div>
                <div className={styles.inputFieldsContainer}>
                  <Input
                    type="text"
                    name="employee"
                    isDisable={true}
                    value={employeeName}
                    label={"Assign By"}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                  <Input
                    required
                    type="text"
                    name="task"
                    register={register}
                    label={"Enter Task"}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                </div>
                <div className={styles.inputFieldsContainer}>
                  <Input
                    required
                    type="text"
                    name="message"
                    register={register}
                    label={"Enter Message"}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                  <div className={styles.Selections}>
                    <Selection
                      label="Assign To"
                      isMulti={false}
                      name="assignTo"
                      control={control}
                      options={employeeOptions}
                    />
                  </div>
                </div>

                <div className={styles.modalBtnContainer}>
                  <Button
                    title="Close "
                    handleClick={() => {
                      reset({});
                      setIsLoading(false);
                      setIsOpen(false);
                      setIsUpdate(false);
                    }}
                    className={styles.btn2}
                  />
                  <Button
                    title="Save"
                    isLoading={isLoading}
                    className={styles.btn}
                    handleClick={() => handleAddCheckList()}
                  />
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};
export default CheckList;
