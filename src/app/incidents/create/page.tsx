"use client";

import { useState } from "react";

import { useIncidentStore } from "@/store/incidents.store";
import toast from "react-hot-toast";

export default function CreateIncidentPage() {
  const addIncident =
    useIncidentStore(
      (state) =>
        state.addIncident
    );

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [project, setProject] =
    useState("");

  const [priority, setPriority] =
    useState("medium");

  const [status, setStatus] =
    useState("open");

  const [lat, setLat] =
    useState("4.652022");

  const [lng, setLng] =
    useState("-74.05772");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    addIncident({
      id: crypto.randomUUID(),

      title,

      description,

      priority,

      status,

      project: {
        id: crypto.randomUUID(),
        name: project,
      },

      coordinates: {
        lat: Number(lat),
        lng: Number(lng),
      },

      createdAt:
        new Date().toISOString(),
    });

    console.log(
      "TOTAL STORE:",
      useIncidentStore.getState().incidents.length
    );

    console.log(
      useIncidentStore.getState().incidents[0]
    );

    toast.success(
      "Incidencia creada correctamente"
    );

    setTitle("");
    setDescription("");
    setProject("");
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "24px",
        background: "white",
        borderRadius: "16px",
      }}
    >
      <h1
        style={{
          marginBottom: "24px",
        }}
      >
        Crear incidencia
      </h1>

      <form
        onSubmit={handleSubmit}
      >
        <div
          style={{
            display: "flex",
            flexDirection:
              "column",
            gap: "16px",
          }}
        >
          <input
            placeholder="Título"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />

          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />

          <input
            placeholder="Proyecto"
            value={project}
            onChange={(e) =>
              setProject(
                e.target.value
              )
            }
          />

          <select
            value={priority}
            onChange={(e) =>
              setPriority(
                e.target.value
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
                e.target.value
              )
            }
          >
            <option value="open">
              Open
            </option>

            <option value="closed">
              Closed
            </option>

            <option value="on_pause">
              On Pause
            </option>
          </select>

          <input
            placeholder="Latitud"
            value={lat}
            onChange={(e) =>
              setLat(
                e.target.value
              )
            }
          />

          <input
            placeholder="Longitud"
            value={lng}
            onChange={(e) =>
              setLng(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              background:
                "#2563eb",
              color: "white",
              border: "none",
              borderRadius:
                "8px",
              cursor: "pointer",
            }}
          >
            Guardar incidencia
          </button>
        </div>
      </form>
    </div>
  );
}