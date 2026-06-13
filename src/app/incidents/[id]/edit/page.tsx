"use client";

import { useState } from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import toast from "react-hot-toast";

import { useIncidentStore } from "@/store/incidents.store";

export default function EditIncidentPage() {
  const params = useParams();

  const router = useRouter();

  const incidents =
    useIncidentStore(
      (state) =>
        state.incidents
    );

  const updateIncident =
    useIncidentStore(
      (state) =>
        state.updateIncident
    );

  const incident = incidents.find(
    (item: any) =>
      item.id === params.id
  );

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

  const [title, setTitle] =
    useState(
      incident.title
    );

  const [
    description,
    setDescription,
  ] = useState(
    incident.description
  );

  const [priority, setPriority] =
    useState(
      incident.priority
    );

  const [status, setStatus] =
    useState(
      incident.status
    );

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    updateIncident(
      incident.id,
      {
        title,
        description,
        priority,
        status,
      }
    );

    toast.success(
      "Incidencia actualizada"
    );

    router.push(
      `/incidents/${incident.id}`
    );
  };

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
            maxWidth: "900px",
            margin: "32px auto",
            padding: "24px",
            background:
              "white",
            borderRadius:
              "16px",
          }}
        >
          <h1
            style={{
              marginBottom:
                "24px",
            }}
          >
            Editar incidencia
          </h1>

          <form
            onSubmit={
              handleSubmit
            }
          >
            <div
              style={{
                display:
                  "flex",
                flexDirection:
                  "column",
                gap: "16px",
              }}
            >
              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target
                      .value
                  )
                }
              />

              <textarea
                value={
                  description
                }
                onChange={(e) =>
                  setDescription(
                    e.target
                      .value
                  )
                }
              />

              <select
                value={
                  priority
                }
                onChange={(e) =>
                  setPriority(
                    e.target
                      .value
                  )
                }
              >
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

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target
                      .value
                  )
                }
              >
                <option value="open">
                  Abierta
                </option>

                <option value="closed">
                  Cerrada
                </option>

                <option value="on_pause">
                  En pausa
                </option>
              </select>

              <button
                type="submit"
                style={{
                  padding:
                    "12px",
                  background:
                    "#2563eb",
                  color:
                    "white",
                  border:
                    "none",
                  borderRadius:
                    "10px",
                  cursor:
                    "pointer",
                }}
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}