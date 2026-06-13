"use client";

import { useMemo, useState } from "react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useIncidentStore } from "@/store/incidents.store";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";
import styles from "./incidents.module.scss";

export default function IncidentsPage() {
    const router = useRouter();
    const incidents =
        useIncidentStore(
            (state) =>
                state.incidents
        );

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("all");
        
    const [priority, setPriority] =
        useState("all");

    const filteredIncidents =
        useMemo(() => {
            return incidents.filter(
                (incident: any) => {
                    const matchesSearch =
                        incident.title
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            ) ||
                        incident.project?.name
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            );

                    const matchesStatus =
                        status === "all" ||
                        incident.status ===
                        status;

                    const matchesPriority =
                        priority === "all" ||
                        incident.priority ===
                        priority;

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesPriority
                    );
                }
            );
        }, [
            incidents,
            search,
            status,
            priority,
        ]);

    const getStatusLabel = (
        status: string
    ) => {
        switch (status) {
            case "open":
                return "Abierta";

            case "closed":
                return "Cerrada";

            case "on_pause":
                return "En pausa";

            default:
                return status;
        }
    };

    const getPriorityLabel = (
        priority: string
    ) => {
        switch (priority) {
            case "high":
                return "Alta";

            case "medium":
                return "Media";

            case "low":
                return "Baja";

            default:
                return priority;
        }
    };

    return (
        <ProtectedRoute>
            <main className={styles.container}>
                <Sidebar />

                <section className={styles.content}>
                    <Header />
                    <div className={styles.header}>
                        <div>
                            <h1>Incidencias</h1>
                            <span>
                                {filteredIncidents.length} incidencias
                            </span>
                        </div>

                        <button
                            className={styles.createButton}
                            onClick={() =>
                                router.push(
                                    "/incidents/create"
                                )
                            }
                        >
                            + Nueva incidencia
                        </button>
                    </div>
                    <div className={styles.body}>
                        <div className={styles.header}>
                            <div>
                                <h1>Incidencias</h1>

                                <span>
                                    {
                                        filteredIncidents.length
                                    }{" "}
                                    incidencias
                                </span>
                            </div>
                        </div>

                        <div className={styles.filters}>
                            <input
                                type="text"
                                placeholder="Buscar incidencia..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    Todos los estados
                                </option>

                                <option value="open">
                                    Abiertas
                                </option>

                                <option value="closed">
                                    Cerradas
                                </option>

                                <option value="on_pause">
                                    En pausa
                                </option>
                            </select>

                            <select
                                value={priority}
                                onChange={(e) =>
                                    setPriority(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="all">
                                    Todas las prioridades
                                </option>

                                <option value="high">
                                    Alta
                                </option>

                                <option value="medium">
                                    Media
                                </option>

                                <option value="low">
                                    Baja
                                </option>
                            </select>
                        </div>

                        <div className={styles.cards}>
                            {filteredIncidents.map(
                                (incident: any) => (
                                    <div
                                        key={incident.id}
                                        className={styles.card}
                                        onClick={() =>
                                            router.push(
                                                `/incidents/${incident.id}`
                                            )
                                        }
                                    >
                                        <h3>
                                            {
                                                incident.title
                                            }
                                        </h3>

                                        <p>
                                            {
                                                incident
                                                    .project
                                                    ?.name
                                            }
                                        </p>

                                        <div
                                            className={
                                                styles.badges
                                            }
                                        >
                                            <span
                                                className={`${styles.badge} ${styles.status}`}
                                            >
                                                {getStatusLabel(
                                                    incident.status
                                                )}
                                            </span>

                                            <span
                                                className={`
                                                ${styles.badge}
                                                ${incident.priority === "high"
                                                        ? styles.high
                                                        : incident.priority ===
                                                            "medium"
                                                            ? styles.medium
                                                            : styles.low
                                                    }
  `}
                                            >
                                                {getPriorityLabel(
                                                    incident.priority
                                                )}
                                            </span>
                                        </div>

                                        <small>
                                            {new Date(
                                                incident.createdAt
                                            ).toLocaleDateString()}
                                        </small>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </section>
            </main >
        </ProtectedRoute>
    );
}