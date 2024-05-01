import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Input from "@/components/input";
import Table from "@/components/table";
import Modal from "@/components/modal";
import Button from "@/components/button";

import { addEmployees, getAllEmployees } from "@/api-services/user";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import { Columns } from "./columns";

import { EmployeeDataInterface, TryNowFormInterface, defaultFormValues } from "./user-interface";

import styles from "./index.module.scss";
import createNotification from "@/common/create-notification";
import Pagination from "@/components/pagination";

const User: React.FC = () => {
  const { register, handleSubmit, reset, control, setValue } = useForm<TryNowFormInterface>({
    defaultValues: defaultFormValues,
  });

  const [isUser, setIsUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<number>(0);
  const [allEmployees, setAllEmployees] = useState<EmployeeDataInterface[]>();

  const onSubmit = async (data: TryNowFormInterface) => {
    setIsAddingUser(true);

    try {
      const response = await addEmployees({ data });

      if (response.status === true) {
        setIsAdding((prev) => prev + 1);
        setIsUser(false);
        setIsAddingUser(false);
        createNotification({ type: "success", message: "Employee successfully Add" });
      }
    } catch (error) {
      console.error(error);
      createNotification({ type: "error", message: "error" });
    }
  };

  const handleAllEmployee = async () => {
    try {
      setIsLoading(true);
      const response = await getAllEmployees();
      if (response?.status === true) {
        setAllEmployees(response?.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    handleAllEmployee();
  }, [isAdding]);

  return (
    <div className={styles.userContainer}>
      <div>
        <div className={styles.btnContainer}>
          <Button title="Create User" handleClick={() => setIsUser(true)} className={styles.btn} />
        </div>
      </div>

      <div className={styles.mainContainer}>
        <Table
          rows={allEmployees as EmployeeDataInterface[]}
          columns={Columns}
          isLoading={isLoading}
          tableCustomClass={styles.tableCustomClass}
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
      </div>
      <Pagination
        page={1}
        pageSize={10}
        totalCount={20}
        // control={control}
        // setValue={setValue}
        perPageText="Records per page"
      />

      {isUser && (
        <Modal
          open={isUser}
          showCross={true}
          handleCross={() => {
            setIsUser(false);
          }}
          className={`${styles.modalWrapper} ${isUser ? styles.open : ""}`}
        >
          <div>
            <div className={styles.heading}>Add User</div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className={styles.inputFieldsContainer}>
                  <Input
                    label={"Enter Employee Code *"}
                    required
                    name="employeecode"
                    type="number"
                    register={register}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                  <Input
                    label={"Enter Employee Name *"}
                    required
                    name="name"
                    type="text"
                    register={register}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                </div>
                <div className={styles.inputFieldsContainer}>
                  <Input
                    label={"Enter Employee Email *"}
                    required
                    name="email"
                    type="email"
                    register={register}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                  <Input
                    label={"Enter Contact Number *"}
                    required
                    name="contact_no"
                    type="text"
                    register={register}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                </div>
                <div className={styles.inputFieldsContainer}>
                  <Input
                    label={"Enter Address *"}
                    required
                    name="address"
                    type="text"
                    register={register}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                  <Input
                    label={"Enter Department *"}
                    required
                    name="department"
                    type="text"
                    register={register}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                </div>

                <div className={styles.modalBtnContainer}>
                  <Button
                    title="Close "
                    handleClick={() => {
                      reset();
                      setIsUser(false);
                    }}
                    className={styles.btn2}
                  />
                  <Button
                    title="Add User"
                    type="submit"
                    className={styles.btn}
                    isLoading={isAddingUser}
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
export default User;
