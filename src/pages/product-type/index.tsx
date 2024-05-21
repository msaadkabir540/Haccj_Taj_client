import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Table from "@/components/table";
import Modal from "@/components/modal";
import Input from "@/components/input";
import Button from "@/components/button";
import HeadingText from "@/components/heading-text";
import createNotification from "@/common/create-notification";

import { deleteProducts, getProducts } from "@/api-services/product-type";

import { useClients } from "@/context/context-collection";

import { Columns } from "./columns";

import delIcon from "@/assets/del-icon.svg";

import styles from "./index.module.scss";

const ProductType: React.FC = () => {
  const { register, handleSubmit, reset, setValue } = useForm();

  const loggedInEmployeeCode = localStorage?.getItem("employeecode") || "";

  const [isUser, setIsUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<number>(0);
  const [productData, setProductData] = useState();
  const [updatedValues, setUpdatedValues] = useState<{
    tempId?: number;
    employeeCode?: number;
    deleteId?: number;
    isLoading?: boolean;
    isDeleted?: boolean;
  }>({
    isLoading: false,
    deleteId: 0,
    isDeleted: false,
  });

  const context = useClients();
  const allEmployees = context ? context?.allEmployees : [];
  const loggedInUser = context ? context?.loggedInUser : "";

  const getUserUsername: { [key: string]: string } =
    allEmployees?.reduce((acc: { [key: string]: string }, allEmployees) => {
      acc[allEmployees?.employeecode] = allEmployees.name;
      return acc;
    }, {}) || {};

  const allProductByName = productData?.map((data) => ({
    ...data,
    employeeName: getUserUsername[data?.employeecode as string] || data?.employeecode,
  }));

  const onSubmit = async (data: any) => {
    setIsAddingUser(true);
    const productData = {
      Employeecode: Number(loggedInEmployeeCode),
      product_name: data?.product_name,
      product_type: data?.product_type,
    };

    try {
      const response = await updateProducts({ data: productData });

      if (response.status === true) {
        setIsAdding((prev) => prev + 1);
        setIsUser(false);
        setIsAddingUser(false);
        createNotification({ type: "success", message: "Product successfully Add" });
        reset({});
      }
    } catch (error) {
      console.error(error);
      createNotification({ type: "error", message: "error" });
    }
  };

  const handleDelete = async ({ deleteId }: { deleteId: number }) => {
    setUpdatedValues((prev) => ({ ...prev, isDeleted: true, deleteId }));
    try {
      const res = await deleteProducts({ id: deleteId });
      if (res.status === true) {
        const updatedData = productData?.filter((item: any) => item.id != deleteId);
        setProductData(updatedData);
        setUpdatedValues((prev) => ({ ...prev, isDeleted: false, deleteId: 0 }));
        createNotification({ type: "success", message: res?.message });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetProductType = async () => {
    setIsLoading(true);
    try {
      const data = {
        Employeecode: Number(loggedInUser),
      };
      const response = await getProducts({ data });
      const productNameData = response?.data === "N/A" ? [] : response?.data;
      if (response.status === true) {
        setProductData(productNameData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      createNotification({ type: "error", message: "error" });
    }
  };

  const employeeName = getUserUsername[loggedInEmployeeCode] || loggedInEmployeeCode;

  useEffect(() => {
    if (employeeName) {
      setValue?.("employeecode", employeeName);
    }
  }, [employeeName, setValue]);

  useEffect(() => {
    handleGetProductType();
  }, [isAdding]);

  return (
    <div className={styles.userContainer}>
      <div className={styles.mainContainer}>
        <div>
          <div className={styles.btnContainer}>
            <div className={styles.header}>
              <HeadingText heading={"Products"} text="Add Products List" />
            </div>
            {/* <Button
              title="Add Products"
              handleClick={() => setIsUser(true)}
              className={styles.btn}
            /> */}
          </div>
        </div>

        <Table
          rows={allProductByName}
          columns={Columns}
          isLoading={isLoading}
          tableCustomClass={styles.tableCustomClass}
          actions={({ row }) => {
            return (
              <td key={row?.id}>
                <div className={styles.iconRow}>
                  <Button
                    type="button"
                    icon={delIcon}
                    isLoading={updatedValues?.deleteId === row?.id && updatedValues?.isDeleted}
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
            <div className={styles.heading}>Update Product</div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className={styles.inputFieldsContainer}>
                  <Input
                    required
                    name="product_name"
                    type="text"
                    register={register}
                    label={"Enter Product Name"}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                  <Input
                    required
                    name="product_type"
                    type="text"
                    register={register}
                    label={"Enter Product Type"}
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
                    title="Add Product"
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
export default ProductType;
