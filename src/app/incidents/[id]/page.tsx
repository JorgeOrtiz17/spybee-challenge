"use client";

import {
    useParams,
    useRouter,
} from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Link from "next/link";
import { useHydrated } from "@/hooks/useHydrated";
import { useState } from "react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useIncidentStore } from "@/store/incidents.store";
import toast from "react-hot-toast";

export default function IncidentDetailPage() {
    const params = useParams();

    const router = useRouter();
    const [showDeleteModal,
        setShowDeleteModal] =
        useState(false);

    const incidents =
        useIncidentStore(
            (state) =>
                state.incidents
        );

    const deleteIncident =
        useIncidentStore(
            (state) =>
                state.deleteIncident
        );
    const hydrated =
        useHydrated();

    if (!hydrated) {
        return null;
    }
    const incident =
        incidents.find(
            (item: any) =>
                item.id === params.id
        );

    const handleDelete = () => {
        deleteIncident(
            incident.id
        );

        toast.success(
            "Incidencia eliminada"
        );

        router.push(
            "/incidents"
        );
    };

    if (!incident) {
        return (
            <div
                style={{
                    padding: "40px",
                }}
            >
                Incidencia no encontrada
            </div>
        );
    }

    return (
        <main
            style={{
                display: "flex",
                minHeight: "100vh",
            }}
        >
            <Sidebar />

            <section
                style={{
                    flex: 1,
                }}
            >
                <Header />

                <div
                    style={{
                        padding: "32px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                        }}
                    >
                        <Link
                            href={`/incidents/${incident.id}/edit`}
                        >
                            <button
                                style={{
                                    background:
                                        "#2563eb",
                                    color: "white",
                                    border: "none",
                                    padding:
                                        "12px 20px",
                                    borderRadius:
                                        "10px",
                                    cursor:
                                        "pointer",
                                }}
                            >
                                Editar
                            </button>
                        </Link>

                        <button
                            onClick={() =>
                                setShowDeleteModal(
                                    true
                                )
                            }
                            style={{
                                background:
                                    "#ef4444",
                                color: "white",
                                border: "none",
                                padding:
                                    "12px 20px",
                                borderRadius:
                                    "10px",
                                cursor:
                                    "pointer",
                            }}
                        >
                            Eliminar
                        </button>
                    </div>

                    <div
                        style={{
                            background: "#fff",
                            padding: "24px",
                            borderRadius: "16px",
                            boxShadow:
                                "0 1px 3px rgba(0,0,0,.08)",
                        }}
                    >
                        <p>
                            <strong>
                                Proyecto:
                            </strong>{" "}
                            {incident.project
                                ?.name ?? "Sin proyecto"}
                        </p>

                        <p>
                            <strong>
                                Estado:
                            </strong>{" "}
                            {incident.status}
                        </p>

                        <p>
                            <strong>
                                Prioridad:
                            </strong>{" "}
                            {incident.priority}
                        </p>

                        <p>
                            <strong>
                                Fecha:
                            </strong>{" "}
                            {new Date(
                                incident.createdAt
                            ).toLocaleDateString()}
                        </p>

                        <hr
                            style={{
                                margin:
                                    "24px 0",
                            }}
                        />

                        <h3>
                            Descripción
                        </h3>

                        <p>
                            {incident.description}
                        </p>
                    </div>
                </div>
                <ConfirmModal
                    open={
                        showDeleteModal
                    }
                    title="Eliminar incidencia"
                    message="¿Estás seguro de eliminar esta incidencia? Esta acción no se puede deshacer."
                    onCancel={() =>
                        setShowDeleteModal(
                            false
                        )
                    }
                    onConfirm={
                        handleDelete
                    }
                />
            </section>
        </main>
    );
}