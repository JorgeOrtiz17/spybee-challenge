"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import toast from "react-hot-toast";

import { useIncidentStore } from "@/store/incidents.store";
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from "@/lib/constants";
import styles from "./CreateIncidentModal.module.scss";

interface Props {
  coords: { lat: number; lng: number };
  onClose: () => void;
}

export default function CreateIncidentModal({ coords, onClose }: Props) {
  const addIncident = useIncidentStore((s) => s.addIncident);

  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [project,     setProject]     = useState("");
  const [priority,    setPriority]    = useState("medium");
  const [status,      setStatus]      = useState("open");

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    addIncident({
      id:          crypto.randomUUID(),
      title:       title.trim(),
      description,
      priority,
      status,
      project:     { id: crypto.randomUUID(), name: project || "Sin proyecto" },
      coordinates: { lat: coords.lat, lng: coords.lng },
      createdAt:   new Date().toISOString(),
    });
    toast.success("Incidencia creada correctamente");
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.header}>
          <h2 className={styles.title}>Nueva incidencia</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
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
              rows={3}
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

          <div className={styles.fieldRow}>
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

          <p className={styles.coordsHint}>
            Ubicación: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </p>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            <Save size={15} />
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
}
