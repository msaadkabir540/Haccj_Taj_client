import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";

import Input from "@/components/input";
import Table from "@/components/table";
import Modal from "@/components/modal";
import Button from "@/components/button";
import Pagination from "@/components/pagination";
import createNotification from "@/common/create-notification";

import { addEmployees, getAllEmployees } from "@/api-services/user";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import { Columns } from "./columns";

import { EmployeeDataInterface, TryNowFormInterface, defaultFormValues } from "./user-interface";

import styles from "./index.module.scss";
import HeadingText from "@/components/heading-text";
import Paginations from "@/components/paginations";

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

  const employeesData = useMemo(() => {
    return allEmployees?.sort((a, b) => {
      const dateA = new Date(b.updated_at);
      const dateB = new Date(a.updated_at);
      return dateA.getTime() - dateB.getTime();
    });
  }, [allEmployees]);

  useEffect(() => {
    handleAllEmployee();
  }, [isAdding]);

  return (
    <>
      <div className={styles.userContainer}>
        <div className={styles.mainContainer}>
          <div>
            <div className={styles.btnContainer}>
              <div className={styles.header}>
                <HeadingText
                  heading={"Employee"}
                  text="There is all employee data of the Taj Mahal Restaurant"
                />
              </div>
              <Button
                title="Create User"
                handleClick={() => setIsUser(true)}
                className={styles.btn}
              />
            </div>
          </div>
          <Table
            rows={employeesData as EmployeeDataInterface[]}
            columns={Columns}
            isLoading={isLoading}
            tableCustomClass={styles.tableCustomClass}
            actions={({ row }) => {
              return (
                <td key={row?.id}>
                  <div className={styles.iconRow}>
                    <Button
                      type="button"
                      icon={editIcon}
                      className={styles.iconsBtn}
                      loaderClass={styles.loading}
                    />
                    <Button
                      type="button"
                      icon={delIcon}
                      className={styles.iconsBtn}
                      loaderClass={styles.loading}
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
              <div className={styles.heading}>Add Employee</div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <div className={styles.inputFieldsContainer}>
                    <Input
                      required
                      type="number"
                      name="employeecode"
                      register={register}
                      label={"Enter Employee Code *"}
                      className={styles.labelClass}
                      inputClass={styles.inputClass}
                    />
                    <Input
                      required
                      name="name"
                      type="text"
                      register={register}
                      label={"Enter Employee Name *"}
                      className={styles.labelClass}
                      inputClass={styles.inputClass}
                    />
                  </div>
                  <div className={styles.inputFieldsContainer}>
                    <Input
                      required
                      name="email"
                      type="email"
                      register={register}
                      label={"Enter Employee Email *"}
                      className={styles.labelClass}
                      inputClass={styles.inputClass}
                    />
                    <Input
                      required
                      type="text"
                      name="contact_no"
                      register={register}
                      label={"Enter Contact Number *"}
                      className={styles.labelClass}
                      inputClass={styles.inputClass}
                    />
                  </div>
                  <div className={styles.inputFieldsContainer}>
                    <Input
                      type="text"
                      name="address"
                      register={register}
                      label={"Enter Address *"}
                      className={styles.labelClass}
                      inputClass={styles.inputClass}
                    />
                    <Input
                      type="text"
                      name="department"
                      register={register}
                      label={"Enter Department *"}
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
    </>
  );
};
export default User;
