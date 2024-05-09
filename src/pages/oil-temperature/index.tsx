import styles from "./index.module.scss";
import TableBtnStructure from "@/components/table-btn-structure";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getAllOilTemp } from "@/api-services/oil-temperature";
import { Columns } from "./columns";
import Modal from "@/components/modal";
import { useClients } from "@/context/context-collection";

const OilTemperature: React.FC = () => {
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
  const [getOilTemperature, setGetOilTemperature] = useState();
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [filtersData, setFiltersData] = useState<string>("");

  const context = useClients();
  const employeeOptions = context ? context?.employeeOptions : "";

  const handleGetTemperature = async ({ employeeCode }: { employeeCode: string }) => {
    setIsCreate((prev) => ({ ...prev, isLoading: true }));
    try {
      const employeecode = Number(employeeCode);
      const response = await getAllOilTemp({ employeecode: employeecode });
      if (response?.status === true) {
        setGetOilTemperature(response?.oilTemperatureData);
        setIsCreate((prev) => ({ ...prev, isLoading: false }));
        setIsFilter(false);
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
    handleGetTemperature({ employeeCode: filtersData });
  }, [filtersData]);

  return (
    <div className={styles.header}>
      <TableBtnStructure
        isCreate={false}
        control={control}
        isFilter={isFilter}
        isFilterValid={true}
        rowData={getOilTemperature}
        headingText="Oil Temperature"
        handleFilterOpen={handleFilterOpen}
        handleApplyFilter={handleApplyFilter}
        SelectOption={employeeOptions as any}
        ColumnsData={Columns({ handleOpenModal })}
        isTableLoading={isCreate?.isLoading as boolean}
        headerPassage="Oli Temperature demo passage of here"
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
export default OilTemperature;
