import { ReactNode } from "react";
import styles from "@/styles/KpiCard.module.scss";
import { motion } from "framer-motion";

interface Props {
  title: string;
  value: number;
  icon?: ReactNode;
  variant?: "total" | "open" | "closed" | "paused";
  onClick?: () => void;
}

export default function KpiCard({
  title,
  value,
  icon,
  variant = "total",
  onClick,
}: Props) {
  return (
    <motion.div
      className={styles.card}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{
        duration: 0.2,
      }}

      onClick={onClick}
      style={{
        cursor: onClick
          ? "pointer"
          : "default",
      }}>
      {icon && (
        <div className={`${styles.icon} ${styles[variant]}`}>
          {icon}
        </div>
      )}
      <motion.div
        className={styles.kpiCard}
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      ></motion.div>
        <motion.div
          whileHover={{
            scale: 1.02,
          }}
        ></motion.div>
        <span>{title}</span>

        <h2>{value}</h2>
      </motion.div>


      );
}