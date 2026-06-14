"use client";

import { useState } from "react";
import { Bell, Search, LogOut, Sun, Moon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import styles from "@/styles/Header.module.scss";

export default function Header() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const { darkMode, toggleTheme } = useThemeStore();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const term = query.trim();
    if (!term) return;
    router.push(`/incidents?search=${encodeURIComponent(term)}`);
    setQuery("");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <Search size={18} className={styles.searchIcon} />
        <input
          placeholder="Buscar incidencias..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        {query && (
          <button className={styles.searchClear} onClick={() => setQuery("")} aria-label="Limpiar">
            ×
          </button>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={darkMode ? "Modo claro" : "Modo oscuro"}
          title={darkMode ? "Modo claro" : "Modo oscuro"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className={styles.iconBtn} aria-label="Notificaciones">
          <Bell size={20} />
        </button>

        <Image
          src="https://i.pravatar.cc/150"
          alt="Avatar"
          width={36}
          height={36}
          className={styles.avatar}
          unoptimized
        />

        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={15} />
          <span className={styles.logoutText}>Salir</span>
        </button>
      </div>
    </header>
  );
}
