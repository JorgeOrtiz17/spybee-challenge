"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, AlertTriangle, Map, PlusCircle, Settings } from "lucide-react";
import Image from "next/image";

import { useThemeStore } from "@/store/theme.store";
import styles from "@/styles/Sidebar.module.scss";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/incidents", icon: AlertTriangle, label: "Incidencias" },
  { href: "/map", icon: Map, label: "Mapa" },
  { href: "/incidents/create", icon: PlusCircle, label: "Crear" },
  { href: "#", icon: Settings, label: "Configuración" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const darkMode = useThemeStore((state) => state.darkMode);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Image
          src={darkMode ? "/logo-spybee-blanco.png" : "/logo-spybee.png"}
          alt="Spybee"
          width={180}
          height={60}
        />
      </div>

      <nav>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = href !== "#" && pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={isActive ? styles.active : ""}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
