"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Map,
  PlusCircle,
  Settings,
} from "lucide-react";

import styles from "@/styles/Sidebar.module.scss";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        SPYBEE
      </div>

      <nav>
        <Link href="/dashboard">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link href="/incidents">
          <Map size={20} />
          <span>Incidencias</span>
        </Link>

        <Link href="/map">
          <Map size={20} />
          <span>Mapa</span>
        </Link>

        <Link href="/create">
          <PlusCircle size={20} />
          <span>Crear</span>
        </Link>

        <Link href="#">
          <Settings size={20} />
          <span>Configuración</span>
        </Link>
      </nav>
    </aside>
  );
}