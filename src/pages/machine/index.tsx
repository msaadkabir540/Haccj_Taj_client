import TableBtnStructure from "@/components/table-btn-structure";

import styles from "./index.module.scss";

const Machine: React.FC = () => {
  const handleOpenCreate = () => {};
  return (
    <div className={styles.header}>
      <TableBtnStructure
        isCreate={true}
        handleOpenCreate={handleOpenCreate}
        headingText="Machine"
        isFilterValid={false}
        headerPassage="Machine demo passage of here"
      />
    </div>
  );
};
export default Machine;
