"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/navigation";

import { useIncidentStore } from "@/store/incidents.store";
import { getStatusOption, getPriorityOption } from "@/lib/constants";
import MapStats from "./MapStats";
import MapSearch from "./MapSearch";
import MapFilters from "./MapFilters";
import MapLegend from "./MapLegend";

import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./Map.module.scss";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const PRIORITY_COLORS: Record<string, string> = {
  high:   "#dc2626",
  medium: "#d97706",
  low:    "#2563eb",
};

/** Stable hash-based offset so markers don't jump on re-render */
function stableOffset(id: string, seed: number): number {
  let h = seed;
  for (const c of id) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return ((h & 0xffff) / 0xffff - 0.5) * 0.002;
}

export default function IncidentMap() {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const incidents = useIncidentStore((state) => state.incidents);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident: any) => {
      const priorityMatch = priority === "all" || incident.priority === priority;
      const statusMatch = status === "all" || incident.status === status;
      const searchMatch =
        incident.title?.toLowerCase().includes(search.toLowerCase()) ||
        incident.project?.name?.toLowerCase().includes(search.toLowerCase());
      return priorityMatch && statusMatch && searchMatch;
    });
  }, [incidents, priority, status, search]);

  const high   = filteredIncidents.filter((i: any) => i.priority === "high").length;
  const medium = filteredIncidents.filter((i: any) => i.priority === "medium").length;
  const low    = filteredIncidents.filter((i: any) => i.priority === "low").length;

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-74.05772, 4.652022],
      zoom: 12,
    });

    map.on("load", () => {
      map.resize();
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    filteredIncidents.forEach((incident: any) => {
      if (!incident.coordinates?.lat || !incident.coordinates?.lng) return;

      const color = PRIORITY_COLORS[incident.priority] ?? "#64748b";

      const el = document.createElement("div");
      const defaultShadow = `0 0 0 2px white, 0 0 0 3.5px ${color}`;
      const hoverShadow   = `0 0 0 2px white, 0 0 0 6px ${color}80`;

      Object.assign(el.style, {
        width: "13px",
        height: "13px",
        borderRadius: "50%",
        background: color,
        boxShadow: defaultShadow,
        cursor: "pointer",
        transition: "box-shadow 0.15s",
      });
      el.addEventListener("mouseenter", () => { el.style.boxShadow = hoverShadow; });
      el.addEventListener("mouseleave", () => { el.style.boxShadow = defaultShadow; });

      const statusOpt   = getStatusOption(incident.status);
      const priorityOpt = getPriorityOption(incident.priority);

      const popup = new mapboxgl.Popup({ offset: 20, maxWidth: "260px" }).setHTML(`
        <div style="font-family:Inter,sans-serif;padding:4px 0">
          <p style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px;line-height:1.3">
            ${incident.title}
          </p>
          <p style="font-size:12px;color:#64748b;margin-bottom:10px">
            ${incident.project?.name ?? "Sin proyecto"}
          </p>
          <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
            <span style="
              padding:3px 9px;border-radius:999px;font-size:11px;font-weight:600;
              background:${statusOpt.badgeVariant === "open" ? "#dcfce7" : statusOpt.badgeVariant === "on_pause" ? "#fef3c7" : "#f1f5f9"};
              color:${statusOpt.badgeVariant === "open" ? "#15803d" : statusOpt.badgeVariant === "on_pause" ? "#b45309" : "#475569"};
            ">${statusOpt.label}</span>
            <span style="
              padding:3px 9px;border-radius:999px;font-size:11px;font-weight:600;
              background:${priorityOpt.badgeVariant === "high" ? "#fee2e2" : priorityOpt.badgeVariant === "medium" ? "#fef9c3" : "#dbeafe"};
              color:${priorityOpt.badgeVariant === "high" ? "#dc2626" : priorityOpt.badgeVariant === "medium" ? "#ca8a04" : "#1d4ed8"};
            ">${priorityOpt.label}</span>
          </div>
          <button id="goto-${incident.id}" style="
            width:100%;padding:9px;border:none;border-radius:9px;
            background:#2563eb;color:white;font-size:13px;font-weight:600;cursor:pointer;
          ">Ver detalle →</button>
        </div>
      `);

      const lat = incident.coordinates.lat + stableOffset(incident.id, 1);
      const lng = incident.coordinates.lng + stableOffset(incident.id, 2);

      bounds.extend([lng, lat]);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);

      popup.on("open", () => {
        document.getElementById(`goto-${incident.id}`)?.addEventListener("click", () => {
          router.push(`/incidents/${incident.id}`);
        });
      });
    });

    if (filteredIncidents.length > 0 && !bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 100, maxZoom: 15, duration: 1000 });
    }
  }, [filteredIncidents, mapLoaded, router]);

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    return (
      <div className={styles.noToken}>
        <p>Configura la variable <strong>NEXT_PUBLIC_MAPBOX_TOKEN</strong> para ver el mapa.</p>
      </div>
    );
  }

  return (
    <div className={styles.mapWrapper}>
      <MapStats high={high} medium={medium} low={low} />
      <MapSearch value={search} onChange={setSearch} />
      <MapFilters
        priority={priority}
        status={status}
        setPriority={setPriority}
        setStatus={setStatus}
      />
      <MapLegend />
      <div ref={mapContainer} className={styles.mapCanvas} />
    </div>
  );
}
