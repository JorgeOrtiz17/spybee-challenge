"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useIncidentStore } from "@/store/incidents.store";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/lib/constants";
import toast from "react-hot-toast";

import styles from "./create.module.scss";

export default function CreateIncidentPage() {
  const router = useRouter();
  const addIncident = useIncidentStore((state) => state.addIncident);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("open");
  const [lat, setLat] = useState("4.652022");
  const [lng, setLng] = useState("-74.05772");

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    addIncident({
      id: crypto.randomUUID(),
      title: title.trim(),
      description,
      priority,
      status,
      project: { id: crypto.randomUUID(), name: project || "Sin proyecto" },
      coordinates: { lat: Number(lat), lng: Number(lng) },
      createdAt: new Date().toISOString(),
    });

    toast.success("Incidencia creada correctamente");
    router.push("/incidents");
  };

  return (
    <ProtectedRoute>
      <main className={styles.page}>
        <Sidebar />
        <section className={styles.content}>
          <Header />
          <div className={styles.body}>
            <Link href="/incidents" className={styles.back}>
              <ArrowLeft size={16} />
              Volver a incidencias
            </Link>

            <div className={styles.formCard}>
              <h1 className={styles.title}>Nueva incidencia</h1>

              <div className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Título *</label>
                  <input
                    className={styles.input}
                    placeholder="Ej. Fisura en columna A3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Descripción</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Describe la incidencia con detalle..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Proyecto</label>
                  <input
                    className={styles.input}
                    placeholder="Nombre del proyecto"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
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

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label}>Latitud</label>
                    <input
                      className={styles.input}
                      placeholder="4.652022"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>Longitud</label>
                    <input
                      className={styles.input}
                      placeholder="-74.05772"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.actions}>
                  <Link href="/incidents" className={styles.cancelBtn}>
                    Cancelar
                  </Link>
                  <button type="button" onClick={handleSubmit} className={styles.submitBtn}>
                    <Save size={16} />
                    Guardar incidencia
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
