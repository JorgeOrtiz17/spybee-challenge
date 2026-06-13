import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import IncidentMap from "@/components/map/IncidentMap";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import styles from "./map.module.scss";

export default function MapPage() {
  return (
    <ProtectedRoute>
    <main className={styles.container}>
      <Sidebar />

      <section className={styles.content}>
        <Header />

        <div className={styles.mapWrapper}>
          <IncidentMap />
        </div>
      </section>
    </main>
    </ProtectedRoute>
  );
}