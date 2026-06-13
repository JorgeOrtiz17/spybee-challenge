"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import KpiCard from "@/components/dashboard/kpiCard";
import StatusChart from "@/components/dashboard/StatusChart";
import PriorityChart from "@/components/dashboard/PriorityChart";
import ProjectChart from "@/components/dashboard/ProjectChart";
import RecentIncidents from "@/components/dashboard/RecentIncidents";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  FileText,
  AlertCircle,
  CheckCircle,
  PauseCircle,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";

import styles from "./dashboard.module.scss";


export default function DashboardPage() {
  const {
    total,
    open,
    closed,
    paused,
    high,
    medium,
    low,
    critical,
    projectStats,
    recentIncidents,
    mostAffectedProject,
    latestIncident,
    openPercentage,
    closedPercentage,
  } = useDashboard();
  
  const router = useRouter();
  return (
    <ProtectedRoute>
    <main className={styles.container}>
      <Sidebar />

      <section className={styles.content}>
        <Header />

        <div className={styles.body}>
          {/* KPIs */}
          <div className={styles.kpis}>
            <KpiCard
              title="Total"
              value={total}
              icon={<FileText />}
              variant="total"
              onClick={() =>
                router.push(
                  "/incidents"
                )
              }
            />

            <KpiCard
              title="Abiertas"
              value={open}
              icon={<AlertCircle />}
              variant="open"
              onClick={() =>
                router.push(
                  "/incidents?status=open"
                )
              }
            />

            <KpiCard
              title="Cerradas"
              value={closed}
              icon={<CheckCircle />}
              variant="closed"
              onClick={() =>
                router.push(
                  "/incidents?status=closed"
                )
              }
            />

            <KpiCard
              title="En pausa"
              value={paused}
              icon={<PauseCircle />}
              variant="paused"
              onClick={() =>
                router.push(
                  "/incidents?status=on_pause"
                )
              }
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4,1fr)",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              className={
                styles.chartCard
              }
            >
              <h4>
                Proyecto más afectado
              </h4>

              <p>
                {
                  mostAffectedProject?.name
                }
              </p>
            </div>

            <div
              className={
                styles.chartCard
              }
            >
              <h4>
                Última incidencia
              </h4>

              <p>
                {
                  latestIncident?.title
                }
              </p>
            </div>

            <div
              className={
                styles.chartCard
              }
            >
              <h4>
                % Abiertas
              </h4>

              <p>
                {openPercentage}%
              </p>
            </div>

            <div
              className={
                styles.chartCard
              }
            >
              <h4>
                % Cerradas
              </h4>

              <p>
                {closedPercentage}%
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className={styles.charts}>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>
                Estado de incidencias
              </h3>

              <StatusChart
                open={open}
                closed={closed}
                paused={paused}
              />
            </div>

            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>
                Prioridades
              </h3>

              <PriorityChart
                high={high}
                medium={medium}
                low={low}
              />
            </div>
            <div className={`${styles.chartCard} ${styles.fullWidth}`}>
              <h3 className={styles.chartTitle}>
                Incidencias por proyecto
              </h3>

              <ProjectChart
                data={projectStats}
              />
            </div>
            <div
              className={`${styles.chartCard} ${styles.fullWidth}`}
            >
              <h3 className={styles.chartTitle}>
                Últimas incidencias
              </h3>

              <RecentIncidents
                incidents={
                  recentIncidents || []
                }
              />
            </div>
          </div>
        </div>
      </section>
    </main>
    </ProtectedRoute>
  );
}