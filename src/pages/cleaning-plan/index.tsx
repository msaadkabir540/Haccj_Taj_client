import HeadingText from "@/components/heading-text";
import styles from "./index.module.scss";

const CleaningPlan: React.FC = () => {
  return (
    <div className={styles.header}>
      <HeadingText heading={"Cleaning Plan"} text={"Cleaning Plan demo passage of here"} />
    </div>
  );
};
export default CleaningPlan;
