import styles from "./index.module.scss";

const Authentication: React.FC = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.wave_card}>
        <div className={styles.wave_card_shape}></div>
        <div className={styles.wave_card_shape}></div>
        <div className={styles.wave_card_shape}></div>
      </div>
    </div>
  );
};
export default Authentication;
