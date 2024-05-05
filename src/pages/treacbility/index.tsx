import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Table from "@/components/table";
import Button from "@/components/button";
import Selection from "@/components/selection";
import HeadingText from "@/components/heading-text";

import { useClients } from "@/context/context-collection";

import { getAllTreacbility } from "@/api-services/treacbility";

import { Columns } from "./columns";

import editIcon from "@/assets/edit.svg";
import filter from "@/assets/assets/filter.png";
import delIcon from "@/assets/del-icon.svg";

import styles from "./index.module.scss";
import { OptionType } from "@/components/selection/selection-interface";
import Modal from "@/components/modal";

const Treacbility: React.FC = () => {
  const { control, register, watch, setValue } = useForm();
  const [getTreacbility, setGetTreacbility] = useState();
  const [imageModal, setImageModal] = useState<{ url: string; isOpenImageModal: boolean }>({
    url: "",
    isOpenImageModal: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const context = useClients();
  const employeeOptions = context ? context?.employeeOptions : "";

  const handleGetTreacbility = async ({ employeeCode }: { employeeCode: number }) => {
    setIsLoading(true);
    try {
      const response = await getAllTreacbility({ employeecode: employeeCode });
      if (response?.status === true) {
        setGetTreacbility(response?.trasabilityData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetTreacbility({ employeeCode: Number(watch("employeeCode")?.value) });
  }, [watch("employeeCode")?.value]);

  const handleOpenModal = ({ url }: { url: string }) => {
    setImageModal((prev) => ({ ...prev, url: url, isOpenImageModal: true }));
  };

  return (
    <>
      <div className={styles.header}>
        <HeadingText heading="Treacbility" text="Treacbility data here" />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.selectionList}>
          <div className={styles.selectionsContainer}>
            <div className={styles.selectionContainer}>
              <div className={styles.imgContainer}>
                <img src={filter} alt="" height={30} width={30} />
              </div>
              <div className={styles.selections}>
                <Selection
                  label="Employee "
                  isMulti={false}
                  name="employeeCode"
                  options={employeeOptions as OptionType[]}
                  control={control}
                  singleValueMaxWidth={"120px"}
                  singleValueMinWidth="200px"
                  customWidth="200px"
                />
              </div>
            </div>

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
        <Table
          rows={getTreacbility as any}
          columns={Columns({ handleOpenModal })}
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

        <Modal
          {...{
            open: imageModal.isOpenImageModal === true,
            handleClose: () => setImageModal((prev) => ({ ...prev, isOpenImageModal: false })),
          }}
        >
          <img src={imageModal?.url} className={styles.videoPlayer} alt="images" />
        </Modal>
      </div>
    </>
  );
};
export default Treacbility;
