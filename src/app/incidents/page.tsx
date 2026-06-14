"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Badge } from "@/components/incidents/Badge";
import { useIncidentStore } from "@/store/incidents.store";
import { getStatusOption, getPriorityOption } from "@/lib/constants";

import styles from "./incidents.module.scss";

function IncidentsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const incidents = useIncidentStore((state) => state.incidents);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [priority, setPriority] = useState("all");

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident: any) => {
      const matchesSearch =
        incident.title?.toLowerCase().includes(search.toLowerCase()) ||
        incident.project?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || incident.status === status;
      const matchesPriority = priority === "all" || incident.priority === priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [incidents, search, status, priority]);

  return (
    <main className={styles.container}>
      <Sidebar />
      <section className={styles.content}>
        <Header />
        <div className={styles.body}>
          <div className={styles.header}>
            <div>
              <h1>Incidencias</h1>
              <span>{filteredIncidents.length} incidencias</span>
            </div>
            <button
              className={styles.createButton}
              onClick={() => router.push("/incidents/create")}
            >
              + Nueva incidencia
            </button>
          </div>

          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Buscar incidencia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Todos los estados</option>
              <option value="open">Abiertas</option>
              <option value="closed">Cerradas</option>
              <option value="on_pause">En pausa</option>
            </select>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="all">Todas las prioridades</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>

          <div className={styles.cards}>
            {filteredIncidents.map((incident: any) => {
              const statusOpt = getStatusOption(incident.status);
              const priorityOpt = getPriorityOption(incident.priority);
              return (
                <div
                  key={incident.id}
                  className={styles.card}
                  onClick={() => router.push(`/incidents/${incident.id}`)}
                >
                  <h3>{incident.title}</h3>
                  <p>{incident.project?.name}</p>
                  <div className={styles.badges}>
                    <Badge label={statusOpt.label} variant={statusOpt.badgeVariant} />
                    <Badge label={priorityOpt.label} variant={priorityOpt.badgeVariant} />
                  </div>
                  <small>
                    {new Date(incident.createdAt).toLocaleDateString("es-ES")}
                  </small>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function IncidentsPage() {
  return (
    <ProtectedRoute>
      <Suspense>
        <IncidentsList />
      </Suspense>
    </ProtectedRoute>
  );
}
