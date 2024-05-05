import { useEffect, useMemo, useState } from "react";

import Button from "@/components/button";

import { addEquipment, getAllEquipment } from "@/api-services/equipment";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import { EquipmentsInterface } from "./equipments-interface";

import styles from "./index.module.scss";
import Table from "@/components/table";
import { Columns } from "./columns";
import Modal from "@/components/modal";
import Input from "@/components/input";
import createNotification from "@/common/create-notification";
import Pagination from "@/components/pagination";
import HeadingText from "@/components/heading-text";
import { useForm } from "react-hook-form";
import MultiSelectBox from "@/components/multi-select-box";
import Selection from "@/components/selection";
import ReactDatePicker from "react-datepicker";
import DatePicker from "@/components/date-picker";

const Equipment = () => {
  const { control } = useForm();
  const [isAdd, setIsAdd] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [startDate, setStartDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getEquipment, setGetEquipment] = useState<EquipmentsInterface[]>();

  const handleAddEquipments = async () => {
    setIsAdding(true);
    try {
      if (!value || value.trim().length === 0) {
        setError("Please Enter Equipment");
      } else {
        const employeeCode = localStorage.getItem("employeecode");
        if (!employeeCode) {
          createNotification({ type: "error", message: "Please login again" });
          setIsAdding(false);
          setIsOpen(false);
        } else {
          const data = { employeecode: Number(employeeCode), equipment_name: value };
          const response = await addEquipment({ data });
          if (response?.status === true) {
            setIsAdd((prev) => prev + 1);
            setIsAdding(false);
            setIsOpen(false);
          }
        }
      }
    } catch (error) {
      console.error(error);
      setIsAdding(false);
      // Handle errors if needed
    }
  };
  const handleGetEquipment = async () => {
    setIsLoading(true);
    try {
      const response = await getAllEquipment();
      if (response?.status === true) {
        setGetEquipment(response?.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const equipmentData = useMemo(() => {
    return getEquipment?.sort((a, b) => {
      const dateA = new Date(b.updated_at);
      const dateB = new Date(a.updated_at);
      return dateA.getTime() - dateB.getTime();
    });
  }, [getEquipment]);

  const handleChange = ({ date }: { date: any }) => {
    setStartDate(date);
  };

  useEffect(() => {
    handleGetEquipment();
  }, [isAdd]);

  return (
    <div className={styles.userContainer}>
      <div>
        <div className={styles.btnContainer}>
          <div className={styles.header}>
            <HeadingText heading="Equipment" text="Equipment demo passage of here" />
          </div>
          <div>
            <Button
              title="Add Equipment"
              handleClick={() => setIsOpen(true)}
              className={styles.btn}
            />
          </div>
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.selectionList}>
          <div className={styles.selectionsContainer}>
            <Selection
              label="Equipment Name"
              isMulti={false}
              name="name"
              options={SelectOption}
              control={control}
              singleValueMaxWidth={"120px"}
              singleValueMinWidth="200px"
              customWidth="200px"
            />
            <Selection
              label="Employee "
              isMulti={false}
              name="name"
              options={SelectOption}
              control={control}
              singleValueMaxWidth={"120px"}
              singleValueMinWidth="200px"
              customWidth="200px"
            />
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
        <Table
          rows={equipmentData as EquipmentsInterface[]}
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
            <div className={styles.heading}>Add Equipment</div>
            <form>
              <div>
                <div className={styles.inputFieldsContainer}>
                  <Input
                    required
                    type="text"
                    name="equipment"
                    label={"Enter Equipment *"}
                    className={styles.labelClass}
                    errorMessage={error}
                    inputClass={styles.inputClass}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>

                <div className={styles.modalBtnContainer}>
                  <Button
                    title="Close "
                    handleClick={() => {
                      setValue("");
                      setIsOpen(false);
                    }}
                    className={styles.btn2}
                  />
                  <Button
                    title="Add User"
                    handleClick={() => handleAddEquipments()}
                    className={styles.btn}
                    isLoading={isAdding}
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
export default Equipment;

const SelectOption = [{ value: "name", label: "name" }];
