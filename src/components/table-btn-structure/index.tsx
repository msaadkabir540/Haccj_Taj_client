import { useState } from "react";

import Table from "../table";
import Selection from "../selection";
import Button from "@/components/button";
import HeadingText from "@/components/heading-text";

import editIcon from "@/assets/edit.svg";
import delIcon from "@/assets/del-icon.svg";

import { InterfaceComponent } from "./interface-component";

import styles from "./index.module.scss";
import Pagination from "../pagination";

const tableBtnStructure = ({
  control,
  rowData,
  Columns,
  SelectOption,
  isTableLoading,
}: InterfaceComponent) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.userContainer}>
      <div>
        <div className={styles.btnContainer}>
          <div className={styles.header}>
            <HeadingText heading="Check List" text="Check List demo passage of here" />
          </div>
          <div>
            <Button
              title="Add Check List"
              handleClick={() => setIsOpen(true)}
              className={styles.btn}
            />
          </div>
        </div>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.selectionList}>
          <div className={styles.selectionsContainer}>
            <Selection
              label="Equipment Name"
              isMulti={false}
              name="name"
              options={SelectOption}
              control={control}
              singleValueMaxWidth={"120px"}
              singleValueMinWidth="200px"
              customWidth="200px"
            />
            <Selection
              label="Employee "
              isMulti={false}
              name="name"
              options={SelectOption}
              control={control}
              singleValueMaxWidth={"120px"}
              singleValueMinWidth="200px"
              customWidth="200px"
            />
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
        <Table
          rows={rowData}
          columns={Columns}
          isLoading={isTableLoading}
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
    </div>
  );
};
export default tableBtnStructure;
