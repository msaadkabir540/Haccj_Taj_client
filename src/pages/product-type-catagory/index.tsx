import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Table from "@/components/table";
import Modal from "@/components/modal";
import Input from "@/components/input";
import Button from "@/components/button";
import HeadingText from "@/components/heading-text";
import createNotification from "@/common/create-notification";

import {
  addProductivityType,
  deleteProducts,
  deleteProductsType,
  getProducts,
  getProductsType,
  updateProducts,
} from "@/api-services/product-type";

import { useClients } from "@/context/context-collection";

import { Columns } from "./columns";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import styles from "./index.module.scss";

const ProductTypeCatagory: React.FC = () => {
  const { register, handleSubmit, reset, setValue } = useForm();

  const loggedInEmployeeCode = localStorage?.getItem("employeecode") || "";
  console.log({ loggedInEmployeeCode });

  const [isUser, setIsUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<number>(0);
  const [productData, setProductData] = useState();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [updatedValues, setUpdatedValues] = useState<{
    id?: number;
    employeeCode?: number;
    deleteId?: number;
    isLoading?: boolean;
    isDeleted?: boolean;
  }>({
    isLoading: false,
    deleteId: 0,
    isDeleted: false,
  });
  const [imageModal, setImageModal] = useState<{ url: string; isOpenImageModal: boolean }>({
    url: "",
    isOpenImageModal: false,
  });

  const context = useClients();
  const allEmployees = context ? context?.allEmployees : [];
  const loggedInUser = context ? context?.loggedInUser : "";
  const isAdmin = context ? context?.isAdmin : "";

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
      employeecode: Number(loggedInEmployeeCode),
      product_type: data?.product_type,
    };
    console.log({ productData });

    try {
      const response = await addProductivityType({ data: productData });

      if (response.status === true) {
        setIsAdding((prev) => prev + 1);
        setIsUser(false);
        setIsAddingUser(false);
        setIsUpdate(false);
        createNotification({ type: "success", message: "Product successfully Add" });
        reset({});
      }
    } catch (error) {
      setIsAddingUser(false);
      console.error(error);
      createNotification({ type: "error", message: "error" });
    }
  };

  const handleDelete = async ({ deleteId }: { deleteId: number }) => {
    setUpdatedValues((prev) => ({ ...prev, isDeleted: true, deleteId }));
    try {
      const res = await deleteProductsType({ id: deleteId });
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

  const handleEdit = ({ id }: { id: number }) => {
    const updatedData = productData?.find((data) => {
      return data?.id === id;
    });
    setUpdatedValues({
      id: updatedData?.id as number,
      employeeCode: updatedData?.created_by as number,
    });

    setValue?.("product_name", updatedData?.product_name);
    setValue?.("product_type", updatedData?.product_type);
    setIsUpdate(true);
  };
  const handleOpenModal = ({ url }: { url: string }) => {
    setImageModal((prev) => ({ ...prev, url: url, isOpenImageModal: true }));
  };

  const handleGetProductType = async () => {
    setIsLoading(true);
    try {
      const response = await getProductsType();
      const productNameData = response?.data === "N/A" ? [] : response?.data;

      console.log({ response });

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
              <HeadingText heading={"Productivity Product Type"} text="Add Products Type" />
            </div>
            <Button
              title="Add Product Type"
              className={styles.btn}
              handleClick={() => setIsUser(true)}
            />
          </div>
        </div>

        <Table
          rows={allProductByName}
          columns={Columns({ handleOpenModal })}
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
            <div className={styles.heading}>Add Product</div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className={styles.inputFieldsContainer}>
                  <Input
                    required
                    type="text"
                    name="employeecode"
                    register={register}
                    label={"Employee"}
                    isDisable={true}
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
                    title="Save"
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

      <Modal
        {...{
          open: imageModal.isOpenImageModal === true,
          handleClose: () => setImageModal((prev) => ({ ...prev, isOpenImageModal: false })),
        }}
      >
        <img src={imageModal?.url} className={styles.videoPlayer} alt="images" />
      </Modal>
    </div>
  );
};
export default ProductTypeCatagory;
