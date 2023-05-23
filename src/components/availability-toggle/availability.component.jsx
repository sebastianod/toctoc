import styles from "./availability.module.scss";
export default function Availability({onClick, onLoadAvailability}) {
  return (
    <div className={styles.availability}>
      <label className={styles.switch}>
        <input type="checkbox" defaultChecked={onLoadAvailability} onChange={onClick}/>
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
    </div>
  );
}
