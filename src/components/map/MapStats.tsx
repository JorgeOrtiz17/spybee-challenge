import styles from "./Map.module.scss";

interface Props {
  high: number;
  medium: number;
  low: number;
}

export default function MapStats({ high, medium, low }: Props) {
  return (
    <div className={styles.statsBar}>
      <span className={styles.statChip}>
        <span className={`${styles.dot} ${styles.dotHigh}`} />
        Alta: {high}
      </span>
      <span className={styles.statChip}>
        <span className={`${styles.dot} ${styles.dotMedium}`} />
        Media: {medium}
      </span>
      <span className={styles.statChip}>
        <span className={`${styles.dot} ${styles.dotLow}`} />
        Baja: {low}
      </span>
    </div>
  );
}
