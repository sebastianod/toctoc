import styles from "./availability.module.scss";
export default function Availability({onClick}) {
  return (
    <div className={styles.availability}>
      <label className={styles.switch}>
        <input type="checkbox" onChange={onClick}/>
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
    </div>
  );
}
