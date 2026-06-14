import styles from "./Map.module.scss";

export default function MapLegend() {
  return (
    <div className={styles.legend}>
      <p className={styles.legendTitle}>Prioridad</p>
      <span className={styles.legendItem}>
        <span className={`${styles.dot} ${styles.dotHigh}`} />
        Alta
      </span>
      <span className={styles.legendItem}>
        <span className={`${styles.dot} ${styles.dotMedium}`} />
        Media
      </span>
      <span className={styles.legendItem}>
        <span className={`${styles.dot} ${styles.dotLow}`} />
        Baja
      </span>
    </div>
  );
}
