"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import styles from "./login.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const darkMode = useThemeStore((state) => state.darkMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: { preventDefault(): void }) => {
    e.preventDefault();
    const success = login(email, password);
    if (!success) {
      setError("Credenciales incorrectas");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <main className={styles.page}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.logoContainer}>
          <Image
            src={darkMode ? "/logo-spybee-blanco.png" : "/logo-spybee.png"}
            alt="Spybee"
            width={220}
            height={80}
            priority
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            placeholder="admin@spybee.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Contraseña</label>
          <input
            className={styles.input}
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submit}>
          Ingresar
        </button>
      </form>
    </main>
  );
}
