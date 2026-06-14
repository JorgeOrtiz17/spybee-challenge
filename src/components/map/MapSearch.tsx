import { Search } from "lucide-react";
import styles from "./Map.module.scss";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MapSearch({ value, onChange }: Props) {
  return (
    <div className={styles.searchWrapper}>
      <Search size={15} className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Buscar incidencia..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
