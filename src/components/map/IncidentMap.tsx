"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { useIncidentStore } from "@/store/incidents.store";
import { getStatusOption, getPriorityOption } from "@/lib/constants";
import MapStats from "./MapStats";
import MapSearch from "./MapSearch";
import MapFilters from "./MapFilters";
import CreateIncidentModal from "./CreateIncidentModal";

import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./Map.module.scss";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

function createPinIcon(color: string): mapboxgl.StyleImageInterface {
  const w = 40, h = 36;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Triangle shadow
  ctx.beginPath();
  ctx.moveTo(w / 2, 4);
  ctx.lineTo(w - 2, h - 2);
  ctx.lineTo(2, h - 2);
  ctx.closePath();
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fill();

  // Triangle body (rounded corners)
  const r = 4;
  const top: [number, number]    = [w / 2, 3];
  const right: [number, number]  = [w - 3, h - 3];
  const left: [number, number]   = [3, h - 3];

  ctx.beginPath();
  ctx.moveTo((top[0] + right[0]) / 2, (top[1] + right[1]) / 2);
  ctx.arcTo(right[0], right[1], left[0],  left[1],  r);
  ctx.arcTo(left[0],  left[1],  top[0],   top[1],   r);
  ctx.arcTo(top[0],   top[1],   right[0], right[1], r);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Exclamation mark — stem
  ctx.beginPath();
  ctx.roundRect(w / 2 - 2.5, 14, 5, 11, 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Exclamation mark — dot
  ctx.beginPath();
  ctx.arc(w / 2, 30, 3, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  const d = ctx.getImageData(0, 0, w, h);
  return { width: w, height: h, data: new Uint8Array(d.data.buffer) };
}

export default function IncidentMap() {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const sourceReadyRef = useRef(false);
  const createModeRef = useRef(false);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [createMode, setCreateMode] = useState(false);
  const [createCoords, setCreateCoords] = useState<{ lat: number; lng: number } | null>(null);

  const incidents = useIncidentStore((state) => state.incidents);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident: any) => {
      const priorityMatch = priority === "all" || incident.priority === priority;
      const statusMatch   = status   === "all" || incident.status   === status;
      const searchMatch   =
        incident.title?.toLowerCase().includes(search.toLowerCase()) ||
        incident.project?.name?.toLowerCase().includes(search.toLowerCase());
      return priorityMatch && statusMatch && searchMatch;
    });
  }, [incidents, priority, status, search]);

  const high   = filteredIncidents.filter((i: any) => i.priority === "high").length;
  const medium = filteredIncidents.filter((i: any) => i.priority === "medium").length;
  const low    = filteredIncidents.filter((i: any) => i.priority === "low").length;

  useEffect(() => { createModeRef.current = createMode; }, [createMode]);

  // ── Map init ─────────────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-74.05772, 4.652022],
      zoom: 12,
    });

    map.on("load", () => { map.resize(); setMapLoaded(true); });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      sourceReadyRef.current = false;
    };
  }, []);

  // ── Incidents → map ───────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const geojson = {
      type: "FeatureCollection" as const,
      features: filteredIncidents
        .filter((i: any) => i.coordinates?.lat && i.coordinates?.lng)
        .map((incident: any) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [incident.coordinates.lng, incident.coordinates.lat] as [number, number],
          },
          properties: {
            id:          incident.id,
            title:       incident.title,
            priority:    incident.priority,
            status:      incident.status,
            projectName: incident.project?.name ?? "Sin proyecto",
          },
        })),
    };

    // Already initialized → just refresh data
    if (sourceReadyRef.current) {
      (map.getSource("incidents") as mapboxgl.GeoJSONSource).setData(geojson);
      return;
    }

    // ── First-time layer setup ───────────────────────────

    // Load pin icons (synchronous canvas rendering)
    const pinDefs: [string, string][] = [
      ["pin-high",    "#dc2626"],
      ["pin-medium",  "#d97706"],
      ["pin-low",     "#2563eb"],
      ["pin-default", "#64748b"],
    ];
    pinDefs.forEach(([id, color]) => {
      if (!map.hasImage(id)) map.addImage(id, createPinIcon(color));
    });

    map.addSource("incidents", {
      type: "geojson",
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // Cluster shadow
    map.addLayer({
      id: "cluster-shadow",
      type: "circle",
      source: "incidents",
      filter: ["has", "point_count"],
      paint: {
        "circle-color":   "#2563eb",
        "circle-radius":  ["step", ["get", "point_count"], 26, 5, 34, 15, 42],
        "circle-opacity": 0.15,
        "circle-stroke-width": 0,
      },
    });

    // Cluster bubbles
    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "incidents",
      filter: ["has", "point_count"],
      paint: {
        "circle-color":        ["step", ["get", "point_count"], "#3b82f6", 5, "#2563eb", 15, "#1d4ed8"],
        "circle-radius":       ["step", ["get", "point_count"], 20, 5, 28, 15, 36],
        "circle-stroke-width": 2.5,
        "circle-stroke-color": "#fff",
      },
    });

    // Cluster count label
    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "incidents",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size":  13,
        "text-font":  ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      },
      paint: { "text-color": "#fff" },
    });

    // Individual pin markers
    map.addLayer({
      id: "unclustered-point",
      type: "symbol",
      source: "incidents",
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": [
          "match", ["get", "priority"],
          "high",   "pin-high",
          "medium", "pin-medium",
          "low",    "pin-low",
          "pin-default",
        ],
        "icon-size":             1,
        "icon-anchor":           "center",
        "icon-allow-overlap":    true,
        "icon-ignore-placement": true,
      },
    });

    // Zoom into cluster on click
    map.on("click", "clusters", (e) => {
      if (createModeRef.current) return;
      const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      if (!features.length) return;
      const clusterId = features[0].properties?.cluster_id;
      (map.getSource("incidents") as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
          if (err) return;
          map.easeTo({
            center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
            zoom:   zoom ?? 14,
          });
        }
      );
    });

    // Popup on individual point click
    map.on("click", "unclustered-point", (e) => {
      if (createModeRef.current) return;
      const feature = e.features?.[0];
      if (!feature || feature.geometry.type !== "Point") return;

      const props = feature.properties!;
      const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates;
      const statusOpt   = getStatusOption(props.status);
      const priorityOpt = getPriorityOption(props.priority);

      const incidentId = props.id;
      const popup = new mapboxgl.Popup({ offset: [0, -20], maxWidth: "260px" })
        .setLngLat([lng, lat])
        .setHTML(`
          <div style="font-family:Inter,sans-serif;padding:4px 0">
            <p style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px;line-height:1.3">
              ${props.title}
            </p>
            <p style="font-size:12px;color:#64748b;margin-bottom:10px">
              ${props.projectName}
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
            <button data-id="${incidentId}" style="
              width:100%;padding:9px;border:none;border-radius:9px;
              background:#2563eb;color:white;font-size:13px;font-weight:600;cursor:pointer;
            ">Ver detalle →</button>
          </div>
        `);

      // Attach listener BEFORE adding to map so the "open" event is never missed
      popup.on("open", () => {
        popup.getElement()
          ?.querySelector<HTMLButtonElement>(`[data-id="${incidentId}"]`)
          ?.addEventListener("click", () => {
            routerRef.current.push(`/incidents/${incidentId}`);
          });
      });

      popup.addTo(map);
    });

    // Cursor on hover
    map.on("mouseenter", "clusters",          () => { if (!createModeRef.current) map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "clusters",          () => { map.getCanvas().style.cursor = ""; });
    map.on("mouseenter", "unclustered-point", () => { if (!createModeRef.current) map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "unclustered-point", () => { map.getCanvas().style.cursor = ""; });

    // Create mode — click anywhere to place incident
    map.on("click", (e) => {
      if (!createModeRef.current) return;
      setCreateCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      setCreateMode(false);
      createModeRef.current = false;
    });

    sourceReadyRef.current = true;

    // Fit to initial incidents (once)
    const bounds = new mapboxgl.LngLatBounds();
    filteredIncidents
      .filter((i: any) => i.coordinates?.lat && i.coordinates?.lng)
      .forEach((i: any) => bounds.extend([i.coordinates.lng, i.coordinates.lat]));
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 100, maxZoom: 15, duration: 1000 });
    }
  }, [filteredIncidents, mapLoaded]);

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
      <div className={styles.toolbar}>
        <MapSearch value={search} onChange={setSearch} />
        <MapFilters
          priority={priority}
          status={status}
          setPriority={setPriority}
          setStatus={setStatus}
        />
      </div>
      <div className={styles.mapArea}>
        <div
          ref={mapContainer}
          className={`${styles.mapCanvas} ${createMode ? styles.mapCreating : ""}`}
        />
        <button
          className={`${styles.createBtn} ${createMode ? styles.createBtnActive : ""}`}
          onClick={() => setCreateMode((v) => !v)}
        >
          <Plus size={15} />
          {createMode ? "Cancelar" : "Crear"}
        </button>
      </div>
      {createCoords && (
        <CreateIncidentModal
          coords={createCoords}
          onClose={() => setCreateCoords(null)}
        />
      )}
    </div>
  );
}
