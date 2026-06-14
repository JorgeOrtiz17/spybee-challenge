"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Building2, Calendar, FileText } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Badge } from "@/components/incidents/Badge";
import { getStatusOption, getPriorityOption } from "@/lib/constants";
import { useHydrated } from "@/hooks/useHydrated";
import { useIncidentStore } from "@/store/incidents.store";
import toast from "react-hot-toast";

import styles from "./detail.module.scss";

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const incidents = useIncidentStore((state) => state.incidents);
  const deleteIncident = useIncidentStore((state) => state.deleteIncident);
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <main className={styles.page}>
        <Sidebar />
        <section className={styles.content}>
          <Header />
          <div className={styles.body}>
            <div className={styles.skeleton} />
          </div>
        </section>
      </main>
    );
  }

  const incident = incidents.find((item: any) => item.id === params.id);

  if (!incident) {
    return (
      <main className={styles.page}>
        <Sidebar />
        <section className={styles.content}>
          <Header />
          <div className={styles.notFound}>
            <p>Incidencia no encontrada</p>
            <Link href="/incidents" className={styles.back}>
              <ArrowLeft size={16} />
              Volver a incidencias
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const handleDelete = () => {
    deleteIncident(incident.id);
    toast.success("Incidencia eliminada");
    router.push("/incidents");
  };

  const statusOpt = getStatusOption(incident.status);
  const priorityOpt = getPriorityOption(incident.priority);

  return (
    <main className={styles.page}>
      <Sidebar />
      <section className={styles.content}>
        <Header />

        <div className={styles.body}>
          <Link href="/incidents" className={styles.back}>
            <ArrowLeft size={16} />
            Volver a incidencias
          </Link>

          <div className={styles.titleRow}>
            <div className={styles.titleBlock}>
              <h1>{incident.title ?? "Incidencia sin título"}</h1>
              <div className={styles.badges}>
                <Badge label={statusOpt.label} variant={statusOpt.badgeVariant} />
                <Badge label={priorityOpt.label} variant={priorityOpt.badgeVariant} />
              </div>
            </div>

            <div className={styles.actions}>
              <Link href={`/incidents/${incident.id}/edit`}>
                <button className={styles.editBtn}>
                  <Pencil size={15} />
                  Editar
                </button>
              </Link>
              <button className={styles.deleteBtn} onClick={() => setShowDeleteModal(true)}>
                <Trash2 size={15} />
                Eliminar
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>
                  <Building2 size={17} />
                </span>
                <div>
                  <p className={styles.metaLabel}>Proyecto</p>
                  <p className={styles.metaValue}>{incident.project?.name ?? "Sin proyecto"}</p>
                </div>
              </div>

              <div className={styles.metaItem}>
                <span className={styles.metaIcon}>
                  <Calendar size={17} />
                </span>
                <div>
                  <p className={styles.metaLabel}>Fecha de creación</p>
                  <p className={styles.metaValue}>
                    {new Date(incident.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <hr className={styles.divider} />

            <p className={styles.descriptionTitle}>
              <FileText size={15} />
              Descripción
            </p>
            <p className={styles.descriptionText}>
              {incident.description || "Sin descripción."}
            </p>
          </div>
        </div>

        <ConfirmModal
          open={showDeleteModal}
          title="Eliminar incidencia"
          message="¿Estás seguro de eliminar esta incidencia? Esta acción no se puede deshacer."
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      </section>
    </main>
  );
}
