import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Columns } from "./columns";
import Modal from "@/components/modal";
import TableBtnStructure from "@/components/table-btn-structure";

import { useClients } from "@/context/context-collection";

import { getAllCleaningPlan } from "@/api-services/cleaning-plan";

import styles from "./index.module.scss";
import createNotification from "@/common/create-notification";

const CleaningPlan: React.FC = () => {
  const { register, handleSubmit, reset, setValue, control, watch } = useForm();
  const [isCreate, setIsCreate] = useState<{
    isLoading?: boolean;
    isOpenImageModal?: boolean;
    url?: string;
  }>({
    url: "",
    isLoading: false,
    isOpenImageModal: false,
  });
  const [getCleaningPlan, setGetCleaningPlan] = useState();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [filtersData, setFiltersData] = useState<string>("");

  const context = useClients();
  const employeeOptions = context ? context?.employeeOptions : "";

  const handleGetCleaningPlan = async ({ employeeCode }: { employeeCode: string }) => {
    setIsCreate((prev) => ({ ...prev, isLoading: true }));
    try {
      const employeecode = Number(employeeCode);
      const response = await getAllCleaningPlan({ employeecode: employeecode });
      if (response?.status === true) {
        setGetCleaningPlan(response?.cleaningData);
        setIsCreate((prev) => ({ ...prev, isLoading: false }));
        setIsFilter(false);
      }
      if (response?.message === "No Cleaning Found") {
        createNotification({ type: "warn", message: "No cleaning data found" });
      }
    } catch (error) {
      setIsCreate((prev) => ({ ...prev, isLoading: false }));

      console.error(error);
    }
  };

  const handleOpenModal = ({ url }: { url: string }) => {
    setIsCreate((prev) => ({ ...prev, url: url, isOpenImageModal: true }));
    // setImageModal((prev) => ({ ...prev, url: url, isOpenImageModal: true }));
  };

  const handleFilterOpen = (argu: boolean) => {
    setIsFilter(argu);
  };

  const handleApplyFilter = () => {
    const employeeData = watch("employeeCode")?.value;

    setFiltersData(employeeData);
  };

  useEffect(() => {
    handleGetCleaningPlan({ employeeCode: filtersData });
  }, [filtersData]);

  return (
    <div className={styles.header}>
      <TableBtnStructure
        isCreate={false}
        control={control}
        isFilter={isFilter}
        isFilterValid={true}
        rowData={getCleaningPlan}
        headingText="Cleaning Plan"
        handleFilterOpen={handleFilterOpen}
        handleApplyFilter={handleApplyFilter}
        SelectOption={employeeOptions as any}
        ColumnsData={Columns({ handleOpenModal })}
        isTableLoading={isCreate?.isLoading as boolean}
        headerPassage="Cleaning Plan demo passage of here"
      />
      <Modal
        {...{
          open: isCreate?.isOpenImageModal === true,
          handleClose: () => setIsCreate((prev) => ({ ...prev, isOpenImageModal: false })),
        }}
      >
        <img src={isCreate?.url} className={styles.videoPlayer} alt="images" />
      </Modal>
    </div>
  );
};
export default CleaningPlan;
