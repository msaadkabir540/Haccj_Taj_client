import HeadingText from "@/components/heading-text";
import styles from "./index.module.scss";

const Machine: React.FC = () => {
  return (
    <div className={styles.header}>
      <HeadingText heading={"Machine"} text={"Machine demo passage of here"} />
    </div>
  );
};
export default Machine;
