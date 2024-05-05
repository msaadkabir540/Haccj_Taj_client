import HeadingText from "@/components/heading-text";
import styles from "./index.module.scss";

const OilTemperature: React.FC = () => {
  return (
    <div className={styles.header}>
      <HeadingText heading={"Oil Temperature"} text={"Oli Temperature demo passage of here"} />
    </div>
  );
};
export default OilTemperature;
