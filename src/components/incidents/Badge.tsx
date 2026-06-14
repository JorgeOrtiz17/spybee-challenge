import styles from "./Badge.module.scss";

export type BadgeVariant = "open" | "closed" | "on_pause" | "high" | "medium" | "low";

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  open: styles.open,
  closed: styles.closed,
  on_pause: styles.onPause,
  high: styles.high,
  medium: styles.medium,
  low: styles.low,
};

type BadgeProps = {
  label: string;
  variant: BadgeVariant;
};

export function Badge({ label, variant }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${VARIANT_CLASS[variant]}`}>
      {label}
    </span>
  );
}
