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

const TableBtnStructure = ({
  isDate,
  control,
  rowData,
  isCreate,
  isFilter,
  ColumnsData,
  headingText,
  SelectOption,
  headerPassage,
  isFilterValid,
  isTableLoading,
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
          </div>
        )}
        <div className={styles.mainContainer}>
          <Table
            rows={rowData}
            columns={ColumnsData}
            isLoading={isTableLoading}
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
          handleClose: () => handleFilterOpen?.(false),
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
                options={SelectOption as any}
                control={control}
                // singleValueMaxWidth={"120px"}
                // singleValueMinWidth="200px"
                // customWidth="200px"
              />
            </div>
          </div>
          {isDate && (
            <>
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
            </>
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
