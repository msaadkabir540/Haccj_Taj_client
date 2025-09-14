// import { useEffect, useMemo, useState } from "react";

// import Input from "@/components/input";
// import Modal from "@/components/modal";
// import Table from "@/components/table";
// import Button from "@/components/button";
// import HeadingText from "@/components/heading-text";
// import createNotification from "@/common/create-notification";

// import { Columns } from "./columns";

// import { addEquipment, deleteEquipment, getAllEquipment } from "@/api-services/equipment";

// import delIcon from "@/assets/del-icon.svg";

// import { EquipmentsInterface } from "./equipments-interface";
// import { RowsInterface } from "@/interface/tables-interface";

// import styles from "./index.module.scss";
// import Selection from "@/components/selection";
// import { useForm } from "react-hook-form";

// const Equipment = () => {
//   const { control, watch } = useForm();

//   const [isAdd, setIsAdd] = useState<number>(0);
//   const [error, setError] = useState<string>("");
//   const [value, setValue] = useState<string>("");
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [isAdding, setIsAdding] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [getEquipment, setGetEquipment] = useState<EquipmentsInterface[]>();
//   const [updatedValues, setUpdatedValues] = useState<{
//     isDelete: boolean;
//     deleteId: number;
//   }>({
//     isDelete: true,
//     deleteId: 0,
//   });

//   const sortedEquipment = useMemo(() => {
//     const sortedData = getEquipment?.sort((a, b) => {
//       const dateA: any = new Date(a.updated_at);
//       const dateB: any = new Date(b.updated_at);
//       return dateB - dateA;
//     });

//     return sortedData?.map((data: any) => ({
//       ...data,
//       equipment_name: `${data?.equipment_name} (${data?.category === "1" ? "Positive" : "Negative"})`,
//     }));
//   }, [getEquipment]);

//   console.log("====================================");
//   console.log({ sortedEquipment });
//   console.log("====================================");

//   const handleAddEquipments = async () => {
//     setIsAdding(true);
//     try {
//       if (!value || value.trim().length === 0) {
//         setError("Please Enter Equipment");
//       } else {
//         const employeeCode = localStorage.getItem("employeecode");
//         if (!employeeCode) {
//           createNotification({ type: "error", message: "Please login again" });
//           setIsAdding(false);
//           setIsOpen(false);
//         } else {
//           const data = {
//             category: watch("category")?.value,
//             employeecode: Number(employeeCode),
//             equipment_name: value,
//           };
//           const response = await addEquipment({ data });
//           if (response?.status === true) {
//             setIsAdd((prev) => prev + 1);
//             setIsAdding(false);
//             setIsOpen(false);
//           }
//         }
//       }
//     } catch (error) {
//       console.error(error);
//       setIsAdding(false);
//       // Handle errors if needed
//     }
//   };

//   const handleGetEquipment = async () => {
//     setIsLoading(true);
//     try {
//       const response = await getAllEquipment();
//       if (response?.status === true) {
//         if (Array.isArray(response?.data)) {
//           // If response.data is already an array

//           console.log("====================================");
//           console.log(response?.data);
//           console.log("====================================");

//           setGetEquipment(response.data);
//         } else {
//           const dataArray: EquipmentsInterface[] | [] = [];
//           setGetEquipment(dataArray);
//         }

//         setIsLoading(false);
//       }
//     } catch (error) {
//       setIsLoading(false);
//       console.error(error);
//     }
//   };

//   const handleDelete = async ({ deleteId }: { deleteId: number }) => {
//     setUpdatedValues((prev) => ({ ...prev, isDeleted: true, deleteId }));
//     try {
//       const res = await deleteEquipment({ id: deleteId });
//       if (res.status === true) {
//         const updatedData = getEquipment?.filter((item) => item.id != deleteId);
//         setGetEquipment(updatedData);
//         setUpdatedValues((prev) => ({ ...prev, isDeleted: false, deleteId: 0 }));
//         createNotification({ type: "success", message: res?.message });
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     handleGetEquipment();
//   }, [isAdd]);

//   console.log("====================================");
//   console.log(watch("category"));
//   console.log("====================================");

//   return (
//     <div className={styles.userContainer}>
//       <div className={styles.mainContainer}>
//         <div>
//           <div className={styles.btnContainer}>
//             <div className={styles.header}>
//               <HeadingText heading="Equipment" text="Add Temperature Equipment List" />
//             </div>
//             <div>
//               <Button
//                 title="Add Equipment"
//                 handleClick={() => setIsOpen(true)}
//                 className={styles.btn}
//               />
//             </div>
//           </div>
//         </div>

//         <Table
//           rows={sortedEquipment as RowsInterface[]}
//           columns={Columns}
//           isLoading={isLoading}
//           actions={({ row }) => {
//             return (
//              <td key={row?.id} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
//                 <div className={styles.iconRow}>
//                   <Button
//                     type="button"
//                     icon={delIcon}
//                     className={styles.iconsBtn}
//                     loaderClass={styles.loading}
//                     isLoading={
//                       updatedValues?.isDelete === true && updatedValues?.deleteId === row?.id
//                     }
//                     handleClick={() => handleDelete({ deleteId: row?.id })}
//                   />
//                 </div>
//               </td>
//             );
//           }}
//         />
//       </div>

//       {isOpen && (
//         <Modal
//           open={isOpen}
//           showCross={true}
//           handleCross={() => {
//             setIsOpen(false);
//           }}
//           className={`${styles.modalWrapper}`}
//         >
//           <div>
//             <div className={styles.heading}>Add Equipment</div>
//             <form>
//               <div>
//                 <div className={styles.inputFieldsContainer}>
//                   <Input
//                     required
//                     type="text"
//                     name="equipment"
//                     label={"Enter Equipment *"}
//                     className={styles.labelClass}
//                     errorMessage={error}
//                     inputClass={styles.inputClass}
//                     onChange={(e) => setValue(e.target.value)}
//                   />
//                 </div>
//                 <div className={styles.inputFieldsContainer}>
//                   <Selection
//                     label="Category"
//                     isMulti={false}
//                     name="category"
//                     options={categoryOption as any}
//                     control={control}
//                   />
//                 </div>

//                 <div className={styles.modalBtnContainer}>
//                   <Button
//                     title="Close "
//                     handleClick={() => {
//                       setValue("");
//                       setIsOpen(false);
//                     }}
//                     className={styles.btn2}
//                   />
//                   <Button
//                     title="Save"
//                     disabled={value != "" && watch("category") != undefined ? false : true}
//                     handleClick={handleAddEquipments}
//                     className={styles.btn}
//                     isLoading={isAdding}
//                   />
//                 </div>
//               </div>
//             </form>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };
// export default Equipment;

// const SelectOption = [{ value: "name", label: "name" }];
// const categoryOption = [
//   { value: false, label: "Negative" },
//   { value: true, label: "Positive" },
// ];

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Input from "@/components/input";
import Modal from "@/components/modal";
import Table from "@/components/table";
import Button from "@/components/button";
import HeadingText from "@/components/heading-text";
import Selection from "@/components/selection";

import createNotification from "@/common/create-notification";
import { Columns } from "./columns";
import { addEquipment, deleteEquipment, getAllEquipment } from "@/api-services/equipment";

import delIcon from "@/assets/del-icon.svg";

import { EquipmentsInterface } from "./equipments-interface";
import { RowsInterface } from "@/interface/tables-interface";

import styles from "./index.module.scss";
import GridTable from "@/components/grid-table";

const categoryOption = [
  { value: false, label: "Negative" },
  { value: true, label: "Positive" },
];

const Equipment = () => {
  const {
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [isAdd, setIsAdd] = useState<number>(0);
  const [value, setValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getEquipment, setGetEquipment] = useState<EquipmentsInterface[]>();
  const [updatedValues, setUpdatedValues] = useState<{ isDelete: boolean; deleteId: number }>({
    isDelete: false,
    deleteId: 0,
  });

  const category = watch("category");

  const sortedEquipment = useMemo(() => {
    return getEquipment
      ?.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      ?.map((data: any) => ({
        ...data,
        equipment_name: `${data.equipment_name} (${data.category === "1" ? "Positive" : "Negative"})`,
      }));
  }, [getEquipment]);

  const handleAddEquipments = async () => {
    setIsAdding(true);
    try {
      if (!value.trim()) {
        setError("equipment", { type: "manual", message: "Please enter equipment" });
        setIsAdding(false);
        return;
      }

      if (!category) {
        setError("category", { type: "manual", message: "Category is required" });
        setIsAdding(false);
        return;
      }

      const employeeCode = localStorage.getItem("employeecode");
      if (!employeeCode) {
        createNotification({ type: "error", message: "Please login again" });
        setIsAdding(false);
        setIsOpen(false);
        return;
      }

      const data = {
        category: category.value,
        employeecode: Number(employeeCode),
        equipment_name: value.trim(),
      };

      const response = await addEquipment({ data });
      if (response?.status) {
        setIsAdd((prev) => prev + 1);
        setValue("");
        clearErrors();
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleGetEquipment = async () => {
    setIsLoading(true);
    try {
      const response = await getAllEquipment();
      if (response?.status && Array.isArray(response.data)) {
        setGetEquipment(response.data);
      } else {
        setGetEquipment([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async ({ deleteId }: { deleteId: number }) => {
    setUpdatedValues({ isDelete: true, deleteId });
    try {
      const res = await deleteEquipment({ id: deleteId });
      if (res.status) {
        setGetEquipment((prev) => prev?.filter((item) => item.id !== deleteId));
        createNotification({ type: "success", message: res.message });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatedValues({ isDelete: false, deleteId: 0 });
    }
  };

  useEffect(() => {
    handleGetEquipment();
  }, [isAdd]);

  const isSaveDisabled = !value.trim() || !category;

  return (
    <div className={styles.userContainer}>
      <div className={styles.mainContainer}>
        <div className={styles.btnContainer}>
          <div className={styles.header}>
            <HeadingText heading="Equipment" text="Add Temperature Equipment List" />
          </div>
          <Button
            title="Add Equipment"
            handleClick={() => setIsOpen(true)}
            className={styles.btn}
          />
        </div>

        <Table
          rows={sortedEquipment as RowsInterface[]}
          columns={Columns}
          isLoading={isLoading}
          actions={({ row }) => (
            <div className={styles.iconRow}>
              <button
                onClick={() => handleDelete({ deleteId: row.id })}
                className="rounded-md bg-red-600 cursor-pointer hover:bg-red-700 text-white px-3 py-2 text-sm font-medium shadow-sm transition-colors duration-200"
              >
                {updatedValues.isDelete && updatedValues.deleteId === row.id
                  ? "deleting..."
                  : "Delete"}
              </button>
            </div>
          )}
        />
      </div>

      {isOpen && (
        <Modal
          open={isOpen}
          showCross
          handleCross={() => setIsOpen(false)}
          className={styles.modalWrapper}
        >
          <div>
            <div className={styles.heading}>Add Equipment</div>
            <form>
              <div className={styles.inputFieldsContainer}>
                <Input
                  required
                  type="text"
                  name="equipment"
                  label="Enter Equipment *"
                  className={styles.labelClass}
                  errorMessage={errors.equipment?.message as string}
                  inputClass={styles.inputClass}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (e.target.value.trim()) clearErrors("equipment");
                  }}
                />
              </div>
              <div className={styles.inputFieldsContainer}>
                <Selection
                  label="Category"
                  isMulti={false}
                  name="category"
                  options={categoryOption as any}
                  control={control}
                  errorMessage={errors.category?.message as string}
                />
              </div>
              <div className={styles.modalBtnContainer}>
                <Button
                  title="Close"
                  handleClick={() => {
                    setValue("");
                    clearErrors();
                    setIsOpen(false);
                  }}
                  className={styles.btn2}
                />
                <Button
                  title="Save"
                  disabled={isSaveDisabled}
                  handleClick={handleAddEquipments}
                  className={styles.btn}
                  isLoading={isAdding}
                />
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Equipment;
