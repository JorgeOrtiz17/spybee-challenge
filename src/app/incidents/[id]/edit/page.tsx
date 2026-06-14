"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useIncidentStore } from "@/store/incidents.store";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/lib/constants";
import toast from "react-hot-toast";

import styles from "./edit.module.scss";

export default function EditIncidentPage() {
  const params = useParams();
  const router = useRouter();

  const incidents = useIncidentStore((state) => state.incidents);
  const updateIncident = useIncidentStore((state) => state.updateIncident);

  const incident = incidents.find((item: any) => item.id === params.id);

  const [title, setTitle] = useState(incident?.title ?? "");
  const [description, setDescription] = useState(incident?.description ?? "");
  const [priority, setPriority] = useState(incident?.priority ?? "medium");
  const [status, setStatus] = useState(incident?.status ?? "open");

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

  const handleSubmit = () => {
    updateIncident(incident.id, { title, description, priority, status });
    toast.success("Incidencia actualizada");
    router.push("/incidents");
  };

  return (
    <main className={styles.page}>
      <Sidebar />
      <section className={styles.content}>
        <Header />
        <div className={styles.body}>
          <Link href={`/incidents/${incident.id}`} className={styles.back}>
            <ArrowLeft size={16} />
            Volver al detalle
          </Link>

          <div className={styles.formCard}>
            <h1 className={styles.title}>Editar incidencia</h1>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Título</label>
                <input
                  className={styles.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Prioridad</label>
                  <select
                    className={styles.select}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {PRIORITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Estado</label>
                  <select
                    className={styles.select}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.submit}>
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
