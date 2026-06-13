"use client";

import {
  Bell,
  Search,
} from "lucide-react";

import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useThemeStore,
} from "@/store/theme.store";

import styles from "@/styles/Header.module.scss";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";


export default function Header() {
  const {
  darkMode,
  toggleTheme,
} = useThemeStore();
const router = useRouter();

const logout =
  useAuthStore(
    (state) => state.logout
  );

const handleLogout = () => {
  logout();

  router.push("/login");
};
  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <Search size={18} />

        <input
          placeholder="Buscar incidencias..."
        />
      </div>

      <div className={styles.actions}>
        <Bell size={20} />

        <img
          src="https://i.pravatar.cc/150"
          alt="avatar"
        />
        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 14px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Salir
        </button>
      </div>
    </header>
  );
}