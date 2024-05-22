import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Columns } from "./columns";
import Modal from "@/components/modal";
import createNotification from "@/common/create-notification";
import TableBtnStructure from "@/components/table-btn-structure";

import { useClients } from "@/context/context-collection";

import { deleteCleaningPlan, getAllCleaningPlan } from "@/api-services/cleaning-plan";

import styles from "./index.module.scss";

const CleaningPlan: React.FC = () => {
  const { control, watch, register } = useForm();
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
  const [filtersData, setFiltersData] = useState<{
    employeeCode: string | undefined;
    area: string | undefined;
    date: any;
    edate: any;
  }>();

  const context = useClients();
  const employeeOptions = context ? context?.employeeOptions : "";
  const loggedInUser = context ? context?.loggedInUser : "";
  const isAdmin = context ? context?.isAdmin : "";

  const handleFilterOpen = (argu: boolean) => {
    setIsFilter(argu);
  };

  const handleGetCleaningPlan = async () => {
    setIsCreate((prev) => ({ ...prev, isLoading: true }));
    try {
      const applyFilter = {
        employee: Number(filtersData?.employeeCode),
        employeecode: Number(loggedInUser),
      };
      const response = await getAllCleaningPlan({
        data: {
          ...applyFilter,
          cleaning_area: filtersData?.area,
          date: filtersData?.date,
          edate: filtersData?.edate,
        },
      });
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
  };

  const handleApplyFilter = () => {
    const employeeData = watch("employeeCode")?.value;
    const area = watch("area")?.value;
    const date = watch("from");
    const edate = watch("toDate");

    setFiltersData((prev) => ({ ...prev, employeeCode: employeeData, area: area, date, edate }));
    setIsFilter(false);
  };

  const handleDelete = async ({ deleteId }: { deleteId: number }) => {
    setIsCreate((prev) => ({ ...prev, isDelete: true }));
    try {
      const res = await deleteCleaningPlan({ id: deleteId });
      if (res.status === true) {
        const updatedData = getCleaningPlan?.filter((item) => item.id != deleteId);
        setGetCleaningPlan(updatedData);
        setIsCreate((prev) => ({ ...prev, isDelete: false }));

        createNotification({ type: "success", message: res?.message });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetCleaningPlan();
  }, [filtersData, loggedInUser]);

  return (
    <div className={styles.header}>
      <TableBtnStructure
        deleteId={0}
        isDate={true}
        isArea={true}
        isUpdate={false}
        isCreate={false}
        control={control}
        isDeleted={false}
        register={register}
        isFilter={isFilter}
        isFilterValid={true}
        fileName="Cleaning_Plan"
        rowData={getCleaningPlan}
        headingText="Cleaning Plan"
        handleDelete={handleDelete}
        isExport={isAdmin as boolean}
        isAdmin={isAdmin as boolean}
        handleFilterOpen={handleFilterOpen}
        handleApplyFilter={handleApplyFilter}
        SelectOption={employeeOptions as any}
        ColumnsData={Columns({ handleOpenModal })}
        isTableLoading={isCreate?.isLoading as boolean}
        headerPassage="Presenting for cleaning activities"
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
