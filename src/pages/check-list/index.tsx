import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Table from "@/components/table";
import Button from "@/components/button";
import Selection from "@/components/selection";
import Pagination from "@/components/pagination";
import HeadingText from "@/components/heading-text";

import styles from "./index.module.scss";
import { useClients } from "@/context/context-collection";
import { addCheckList, getCheckListByEmployeeCode } from "@/api-services/check-list";
import Input from "@/components/input";
import Modal from "@/components/modal";
import createNotification from "@/common/create-notification";

const CheckList = () => {
  const { control, register, watch, setValue } = useForm();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const employeeCode = localStorage.getItem("employeecode");

  const context = useClients();
  const allEmployees = context ? context?.allEmployees : "";

  const findLoggedInEmployee = allEmployees?.find((user) => {
    return user?.employeecode === Number(employeeCode);
  });

  const employeeOptions =
    allEmployees?.map((data: any) => ({
      value: data?.employeecode,
      label: data?.name,
    })) || [];

  const handleGetCheckList = async ({ empployeecode }: { empployeecode: string }) => {
    try {
      const res = await getCheckListByEmployeeCode({ employeecode: empployeecode });
    } catch (error) {
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

        const res = await addCheckList({
          data,
        });
        createNotification({ type: "success", message: "Task Add successfully" });
        if (res.status === true) {
          setIsOpen(false);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (watch("employeeCode")) {
      handleGetCheckList({ empployeecode: watch("employeeCode")?.value });
    }
  }, [watch("employeeCode")]);

  useEffect(() => {
    if (employeeCode) {
      setEmployeeName(findLoggedInEmployee?.name);
      setValue?.("employee", findLoggedInEmployee?.name);
    }
  }, [employeeCode, findLoggedInEmployee, setValue]);

  return (
    <div className={styles.userContainer}>
      <div>
        <div className={styles.btnContainer}>
          <div className={styles.header}>
            <HeadingText heading="Check List" text="Check List demo passage of here" />
          </div>
          <div>
            <Button
              title="Add Check List"
              handleClick={() => setIsOpen(true)}
              className={styles.btn}
            />
          </div>
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.selectionList}>
          <div className={styles.selectionsContainer}>
            {/* <Selection
              label="Employee "
              isMulti={false}
              name="employeeCode"
              options={employeeOptions}
              control={control}
              singleValueMaxWidth={"120px"}
              singleValueMinWidth="200px"
              customWidth="200px"
            /> */}

            <div>
              {/* <DatePicker label={"From"} startDate={startDate} handleChange={setStartDate} /> */}
              {/* <label htmlFor="">From Date</label>
            <ReactDatePicker
              showIcon
              timeInputLabel="Time:"
              name="From date"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            /> */}
            </div>
          </div>
          <div className={styles.pagination}>
            {/* <Pagination
              page={1}
              pageSize={10}
              totalCount={20}
              // control={control}
              // setValue={setValue}
              perPageText="Records per page"
            /> */}
          </div>
        </div>
        {/* <Table 
        // rows={equipmentData}
        // columns={Columns}
        // isLoading={isLoading}
        // actions={({ row }) => {
        //   return (
        //     <td className={styles.iconRow} key={row?.id}>
        //       <Button
        //         type="button"
        //         icon={editIcon}
        //         className={styles.iconsBtn}
        //         loaderClass={styles.loading}

        //         // handleClick={() => {
        //         //   navigate(`/template/${row?._id}`);
        //         // }}
        //       />
        //       <Button
        //         type="button"
        //         icon={delIcon}
        //         className={styles.iconsBtn}
        //         loaderClass={styles.loading}
        //         // isLoading={isDeleting === row?._id}
        //         // handleClick={() => handleDelete(row?._id)}
        //       />
        //     </td>
        //   );
        // }}
        // /> */}
      </div>

      {isOpen && (
        <Modal
          open={isOpen}
          showCross={true}
          handleCross={() => {
            setIsOpen(false);
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
                    label={"Enter Employee"}
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
                      label="Employee"
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
                      // setValue("");
                      setIsOpen(false);
                    }}
                    className={styles.btn2}
                  />
                  <Button
                    title="Add Check List"
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
