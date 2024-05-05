import HeadingText from "@/components/heading-text";
import styles from "./index.module.scss";
import Button from "@/components/button";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import Modal from "@/components/modal";
import Input from "@/components/input";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import createNotification from "@/common/create-notification";
import { addProductType, getProductTypes } from "@/api-services/product-type";
import { Columns } from "./columns";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";
import { useClients } from "@/context/context-collection";

const Products: React.FC = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const loggedInEmployeeCode = localStorage?.getItem("employeecode") || "";
  const [isUser, setIsUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<number>(0);
  const [productData, setProductData] = useState();

  const context = useClients();
  const allEmployees = context ? context?.allEmployees : [];

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

    try {
      const response = await addProductType({ data: productData });

      if (response.status === true) {
        setIsAdding((prev) => prev + 1);
        setIsUser(false);
        setIsAddingUser(false);
        createNotification({ type: "success", message: "Product successfully Add" });
      }
    } catch (error) {
      console.error(error);
      createNotification({ type: "error", message: "error" });
    }
  };

  const handleGetProductType = async () => {
    setIsLoading(false);
    try {
      const response = await getProductTypes();

      if (response.status === true) {
        setProductData(response.data);
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

  const allProducts = useMemo(() => {
    return allProductByName?.sort((a, b) => {
      const dateA = new Date(b.updated_at);
      const dateB = new Date(a.updated_at);
      return dateA.getTime() - dateB.getTime();
    });
  }, [allProductByName]);

  return (
    <div className={styles.userContainer}>
      <div>
        <div className={styles.btnContainer}>
          <div className={styles.header}>
            <HeadingText heading={"Product Type"} text="This is Product Type Data" />
          </div>
          <Button title="Add Product" handleClick={() => setIsUser(true)} className={styles.btn} />
        </div>
      </div>

      <div className={styles.mainContainer}>
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
        <Table
          rows={allProducts as EmployeeDataInterface[]}
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
                    required
                    type="text"
                    name="employeecode"
                    register={register}
                    label={"Enter Employee Code *"}
                    className={styles.labelClass}
                    inputClass={styles.inputClass}
                  />
                  <Input
                    required
                    name="product_type"
                    type="text"
                    register={register}
                    label={"Enter Product Type *"}
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
export default Products;
