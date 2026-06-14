import { create } from "zustand";
import { persist } from "zustand/middleware";

import incidentsMock from "@/data/incident.json";

interface IncidentStore {
  incidents: any[];
  addIncident: (incident: any) => void;
  updateIncident: (id: string, data: any) => void;
  deleteIncident: (id: string) => void;
}

export const useIncidentStore = create<IncidentStore>()(
  persist(
    (set) => ({
      incidents: incidentsMock,

      addIncident: (incident) =>
        set((state) => ({ incidents: [incident, ...state.incidents] })),

      updateIncident: (id, data) =>
        set((state) => ({
          incidents: state.incidents.map((incident) =>
            incident.id === id ? { ...incident, ...data } : incident
          ),
        })),

      deleteIncident: (id) =>
        set((state) => ({
          incidents: state.incidents.filter((incident) => incident.id !== id),
        })),
    }),
    { name: "spybee-incidents" }
  )
);
