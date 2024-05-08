import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Table from "@/components/table";
import Button from "@/components/button";
import Pagination from "@/components/pagination";
import createNotification from "@/common/create-notification";

import { Columns } from "./columns";

import { getAllTemperature } from "@/api-services/temperature";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";
import filter from "@/assets/assets/filter.png";

import { TemperatureInterface } from "./temperature-interface";

import styles from "./index.module.scss";
import HeadingText from "@/components/heading-text";
import Selection from "@/components/selection";
import { useClients } from "@/context/context-collection";
import { OptionType } from "@/components/selection/selection-interface";
import DatePicker from "@/components/date-picker";
import Modal from "@/components/modal";
import Input from "@/components/input";

const Temperature: React.FC = () => {
  const { control, watch } = useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [getTemperature, setGetTemperature] = useState<TemperatureInterface[]>();

  const context = useClients();
  const employeeOptions = context ? context?.employeeOptions : [];

  const handleGetTemperature = async ({ employeeCode }: { employeeCode: string }) => {
    setIsLoading(true);
    try {
      const employeecode = Number(employeeCode);
      const response = await getAllTemperature({ id: employeecode });
      if (response?.status === true) {
        setGetTemperature(response?.temperatureData);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const getTemperatureData = useMemo(() => {
    return getTemperature?.sort((a, b) => {
      const dateA = new Date(b.updated_at);
      const dateB = new Date(a.updated_at);
      return dateA.getTime() - dateB.getTime();
    });
  }, [getTemperature]);

  useEffect(() => {
    handleGetTemperature({ employeeCode: watch("employeeCode")?.value });
  }, [watch("employeeCode")]);

  return (
    <>
      <div className={styles.loading}>
        <HeadingText heading={"Temperature"} text="Temperature demo passage of here" />
        <div className={styles.btnContainer}>
          <Button
            title="Filter"
            handleClick={() => setIsFilter(true)}
            className={styles.filterButton}
          />
        </div>
        {/* <div className={styles.selectionList}>
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

              <div>
                <DatePicker
                  label={"From"}
                  startDate={startDate}
                  handleChange={handleStartDateChange} // Pass the function to update startDate
                />
              </div>
              <div>
                <DatePicker
                  label={"To"}
                  startDate={startDateTo}
                  handleChange={handleStartDateChangeTo} // Pass the function to update startDate
                />
              </div>
            </div>
          </div>
        </div> */}
        <div className={styles.pagination}>
          <Table
            rows={getTemperatureData as TemperatureInterface[]}
            columns={Columns}
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
        </div>
      </div>

      <Modal
        {...{
          open: isFilter === true,
          handleClose: () => setIsFilter(false),
        }}
        className={styles.ModalClassName}
      >
        <div className={styles.selectionsContainer}>
          <div className={styles.modalHeading}>Temperature Filter</div>
          <div className={styles.selectionContainer}>
            <div className={styles.selections}>
              <Selection
                label="Employee "
                isMulti={false}
                name="employeeCode"
                options={employeeOptions as OptionType[]}
                control={control}
                // singleValueMaxWidth={"120px"}
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
    </>
  );
};
export default Temperature;
