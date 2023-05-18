import styles from "./availability.module.scss";
export default function Availability() {
  return (
    <div className={styles.availability}>
      <label className={styles.switch}>
        <input type="checkbox" />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
    </div>
  );
}
