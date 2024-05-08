import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import Modal from "@/components/modal";
import Table from "@/components/table";
import Button from "@/components/button";
import Selection from "@/components/selection";
import Pagination from "@/components/pagination";
import DatePicker from "@/components/date-picker";
import HeadingText from "@/components/heading-text";

import { useClients } from "@/context/context-collection";

import { getAllTreacbility } from "@/api-services/treacbility";

import { Columns } from "./columns";

import editIcon from "@/assets/edit.svg";
import filter from "@/assets/assets/filter.png";
import delIcon from "@/assets/del-icon.svg";

import { OptionType } from "@/components/selection/selection-interface";

import styles from "./index.module.scss";
import Input from "@/components/input";

const Treacbility: React.FC = () => {
  const { control, watch } = useForm();
  const [getTreacbility, setGetTreacbility] = useState();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>();
  const [startDateTo, setStartDateTo] = useState<Date | null>();
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

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleStartDateChangeTo = (date: Date | null) => {
    setStartDateTo(date);
  };

  useEffect(() => {
    handleGetTreacbility({ employeeCode: Number(watch("employeeCode")?.value) });
  }, [watch("employeeCode")?.value]);

  const handleOpenModal = ({ url }: { url: string }) => {
    setImageModal((prev) => ({ ...prev, url: url, isOpenImageModal: true }));
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.header}>
          <HeadingText heading="Treacbility" text="Treacbility data here" />
        </div>
        <div className={styles.btnContainer}>
          <Button
            title="Filter"
            handleClick={() => setIsFilter(true)}
            className={styles.filterButton}
          />
        </div>
        <Table
          rows={getTreacbility as any}
          columns={Columns({ handleOpenModal })}
          isLoading={isLoading}
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
        <Modal
          {...{
            open: imageModal.isOpenImageModal === true,
            handleClose: () => setImageModal((prev) => ({ ...prev, isOpenImageModal: false })),
          }}
        >
          <img src={imageModal?.url} className={styles.videoPlayer} alt="images" />
        </Modal>

        <Modal
          {...{
            open: isFilter === true,
            handleClose: () => setIsFilter(false),
          }}
          className={styles.ModalClassName}
        >
          <div className={styles.selectionsContainer}>
            <div className={styles.modalHeading}>Treacbility Filter</div>
            <div className={styles.selectionContainer}>
              <div className={styles.selections}>
                <Selection
                  label="Employee "
                  isMulti={false}
                  name="employeeCode"
                  options={employeeOptions as OptionType[]}
                  control={control}
                  // singleValueMaxWidth={"10px"}
                  // singleValueMinWidth="200px"
                  // customWidth="200px"
                />
              </div>
            </div>

            <Input
              type="date"
              name="from"
              label={"From"}
              className={styles.labelClass}
              // errorMessage={error}
              inputClass={styles.dateClass}
              // onChange={(e) => setValue(e.target.value)}
            />

            <Input
              type="date"
              name="toDate"
              label={"To"}
              className={styles.labelClass}
              // errorMessage={error}
              inputClass={styles.dateClass}
              // onChange={(e) => setValue(e.target.value)}
            />
            <div className={styles.modalBtnContainer}>
              <Button
                title="cancel "
                handleClick={() => {
                  setIsFilter(false);
                }}
                className={styles.btn2}
              />
              <Button
                type="submit"
                title="Apply Filter"
                className={styles.btn}
                // isLoading={isAddingUser}
              />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
export default Treacbility;
