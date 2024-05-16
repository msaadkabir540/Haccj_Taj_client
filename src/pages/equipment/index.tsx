import { useEffect, useMemo, useState } from "react";

import Button from "@/components/button";

import { addEquipment, deleteEquipment, getAllEquipment } from "@/api-services/equipment";

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

const Equipment = () => {
  const [isAdd, setIsAdd] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [value, setValue] = useState<string>("");
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
        if (Array.isArray(response?.data)) {
          // If response.data is already an array
          setGetEquipment(response.data);
        } else {
          const dataArray = [];
          setGetEquipment(dataArray);
        }

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleDelete = async ({ deleteId }: { deleteId: number }) => {
    // setUpdatedValues((prev) => ({ ...prev, isDeleted: true }));
    try {
      const res = await deleteEquipment({ id: deleteId });
      if (res.status === true) {
        const updatedData = getEquipment?.filter((item) => item.id != deleteId);
        setGetEquipment(updatedData);
        // setUpdatedValues((prev) => ({ ...prev, isDeleted: false }));
        createNotification({ type: "success", message: res?.message });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetEquipment();
  }, [isAdd]);

  return (
    <div className={styles.userContainer}>
      <div className={styles.mainContainer}>
        <div>
          <div className={styles.btnContainer}>
            <div className={styles.header}>
              <HeadingText heading="Equipment" text="Add Temperature Equipment List" />
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

        <Table
          rows={getEquipment as EquipmentsInterface[]}
          columns={Columns}
          isLoading={isLoading}
          actions={({ row }) => {
            return (
              <td key={row?.id}>
                <div className={styles.iconRow}>
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
                    title="Save"
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
