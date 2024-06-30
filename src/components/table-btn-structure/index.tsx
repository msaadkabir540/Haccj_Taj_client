import Table from "../table";
import Modal from "../modal";
import Input from "../input";
import Selection from "../selection";
import Pagination from "../pagination";
import Button from "@/components/button";
import HeadingText from "@/components/heading-text";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import { InterfaceComponent } from "./interface-component";

import styles from "./index.module.scss";
import { downloadReport } from "@/utils/helper";

const TableBtnStructure = ({
  isArea,
  isDate,
  control,
  isAdmin,
  rowData,
  isCreate,
  isFilter,
  register,
  isExport,
  fileName,
  deleteId,
  isDeleted,
  handleEdit,
  isAssignTo,
  ColumnsData,
  headingText,
  handleDelete,
  SelectOption,
  headerPassage,
  tableCustomCss,
  isFilterValid,
  isTableLoading,
  isUpdate = true,
  handleFilterOpen,
  handleOpenCreate,
  handleApplyFilter,
}: InterfaceComponent) => {
  return (
    <>
      <div className={styles.userContainer}>
        <div className={styles.btnContainer}>
          <div className={styles.header}>
            <HeadingText heading={headingText} text={headerPassage} />
          </div>
          {isCreate && (
            <div>
              <Button
                title={`Add ${headingText}`}
                handleClick={handleOpenCreate}
                className={styles.btn}
              />
            </div>
          )}
        </div>

        {isFilterValid && (
          <div className={styles.btnBox}>
            <Button
              title="Filter"
              handleClick={() => handleFilterOpen?.(true)}
              className={styles.filterButton}
            />
            {isExport && (
              <Button
                title="Export Data"
                disabled={rowData?.length === 0 ? true : false}
                handleClick={() => downloadReport({ data: rowData, fileName: fileName as string })}
                className={styles.filterButton}
              />
            )}
          </div>
        )}
        <div className={styles.mainContainer}>
          <Table
            rows={rowData}
            tableCustomClass={tableCustomCss}
            columns={ColumnsData}
            isLoading={isTableLoading}
            actions={({ row }) => {
              return (
                <td key={row?.id}>
                  <div className={styles.iconRow}>
                    {isUpdate && (
                      <Button
                        type="button"
                        icon={editIcon}
                        className={styles.iconsBtn}
                        loaderClass={styles.loading}
                        handleClick={() => handleEdit?.({ editId: row?.id })}
                      />
                    )}
                    <Button
                      type="button"
                      icon={delIcon}
                      isLoading={deleteId && deleteId === row?.id && isDeleted && isDeleted}
                      className={styles.iconsBtn}
                      loaderClass={styles.loading}
                      handleClick={() => handleDelete?.({ deleteId: row?.id })}
                    />
                  </div>
                </td>
              );
            }}
          />
        </div>
      </div>

      <Modal
        {...{
          open: isFilter === true,
          handleClose: () => handleFilterOpen?.(false),
        }}
        className={styles.ModalClassName}
      >
        <div className={styles.selectionsContainer}>
          <div className={styles.modalHeading}>Filter</div>
          {isAdmin && (
            <div className={styles.selectionContainer}>
              <div className={styles.selections}>
                <Selection
                  label="Employee "
                  isMulti={false}
                  name="employeeCode"
                  options={SelectOption as any}
                  control={control}
                />
              </div>
            </div>
          )}
          {isArea && (
            <div className={styles.selections}>
              <Selection
                label="Area "
                isMulti={false}
                name="area"
                options={areaOption as any}
                control={control}
                // singleValueMaxWidth={"120px"}
                // singleValueMinWidth="200px"
                // customWidth="200px"
              />
            </div>
          )}
          {isDate && (
            <>
              <Input
                type="date"
                name="from"
                label={"From"}
                register={register}
                className={styles.labelClass}
                inputClass={styles.dateClass}
              />

              <Input
                type="date"
                name="toDate"
                register={register}
                label={"To"}
                className={styles.labelClass}
                inputClass={styles.dateClass}
              />
            </>
          )}
          {isAssignTo && isAdmin && (
            <div className={styles.selectionContainer}>
              <div className={styles.selections}>
                <Selection
                  label="Assign To "
                  isMulti={false}
                  name="assign_to"
                  options={SelectOption as any}
                  control={control}
                />
              </div>
            </div>
          )}

          <div className={styles.modalBtnContainer}>
            <Button
              title="cancel "
              handleClick={() => {
                handleFilterOpen?.(false);
              }}
              className={styles.btn2}
            />
            <Button
              handleClick={handleApplyFilter}
              title="Apply Filter"
              className={styles.btn}
              // isLoading={isTableLoading}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default TableBtnStructure;

const areaOption = [
  {
    value: "Hall",
    label: "Hall",
  },
  {
    value: "Kitchen",
    label: "Kitchen",
  },
];
