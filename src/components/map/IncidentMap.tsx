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

// Consolidated badge styles for popup HTML (can't use CSS Modules inside Mapbox HTML strings)
const POPUP_BADGE: Record<string, { bg: string; color: string }> = {
  open:     { bg: "#dcfce7", color: "#15803d" },
  on_pause: { bg: "#fef3c7", color: "#b45309" },
  closed:   { bg: "#f1f5f9", color: "#475569" },
  high:     { bg: "#fee2e2", color: "#dc2626" },
  medium:   { bg: "#fef9c3", color: "#ca8a04" },
  low:      { bg: "#dbeafe", color: "#1d4ed8" },
};

function buildGeojson(incidents: any[]) {
  return {
    type: "FeatureCollection" as const,
    features: incidents
      .filter((i) => i.coordinates?.lat && i.coordinates?.lng)
      .map((i) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [i.coordinates.lng, i.coordinates.lat] as [number, number],
        },
        properties: {
          id:          i.id,
          title:       i.title,
          priority:    i.priority,
          status:      i.status,
          projectName: i.project?.name ?? "Sin proyecto",
        },
      })),
  };
}

function buildPopupHtml(props: Record<string, string>): string {
  const statusOpt   = getStatusOption(props.status);
  const priorityOpt = getPriorityOption(props.priority);
  const sBadge = POPUP_BADGE[statusOpt.badgeVariant]   ?? POPUP_BADGE.closed;
  const pBadge = POPUP_BADGE[priorityOpt.badgeVariant] ?? POPUP_BADGE.low;
  const badge  = (b: { bg: string; color: string }, label: string) =>
    `<span style="padding:3px 9px;border-radius:999px;font-size:11px;font-weight:600;background:${b.bg};color:${b.color}">${label}</span>`;

  return `
    <div style="font-family:Inter,sans-serif;padding:4px 0">
      <p style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:10px;line-height:1.3">${props.title}</p>
      <p style="font-size:12px;color:#64748b;margin-bottom:10px">${props.projectName}</p>
      <div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">
        ${badge(sBadge, statusOpt.label)}
        ${badge(pBadge, priorityOpt.label)}
      </div>
      <button data-id="${props.id}" style="width:100%;padding:9px;border:none;border-radius:9px;background:#2563eb;color:white;font-size:13px;font-weight:600;cursor:pointer;">
        Ver detalle →
      </button>
    </div>
  `;
}

function createWarningIcon(color: string): mapboxgl.StyleImageInterface {
  const w = 40, h = 36;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Shadow
  ctx.beginPath();
  ctx.moveTo(w / 2, 4); ctx.lineTo(w - 2, h - 2); ctx.lineTo(2, h - 2);
  ctx.closePath();
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fill();

  // Triangle body with rounded corners
  const r = 4;
  const top:   [number, number] = [w / 2, 3];
  const right: [number, number] = [w - 3, h - 3];
  const left:  [number, number] = [3,     h - 3];

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

  // Exclamation stem
  ctx.beginPath();
  ctx.roundRect(w / 2 - 2.5, 14, 5, 11, 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Exclamation dot
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

  const mapContainer        = useRef<HTMLDivElement>(null);
  const mapRef              = useRef<mapboxgl.Map | null>(null);
  const layersInitializedRef = useRef(false);
  const createModeRef       = useRef(false);
  const filteredIncidentsRef = useRef<any[]>([]);

  const [mapLoaded,     setMapLoaded]     = useState(false);
  const [priority,      setPriority]      = useState("all");
  const [status,        setStatus]        = useState("all");
  const [search,        setSearch]        = useState("");
  const [createMode,    setCreateMode]    = useState(false);
  const [createCoords,  setCreateCoords]  = useState<{ lat: number; lng: number } | null>(null);

  const incidents = useIncidentStore((s) => s.incidents);

  const filteredIncidents = useMemo(() => {
    const q = search.toLowerCase();
    return incidents.filter((i: any) => {
      const priorityMatch = priority === "all" || i.priority === priority;
      const statusMatch   = status   === "all" || i.status   === status;
      const searchMatch   = i.title?.toLowerCase().includes(q) ||
                            i.project?.name?.toLowerCase().includes(q);
      return priorityMatch && statusMatch && searchMatch;
    });
  }, [incidents, priority, status, search]);

  // Keep refs in sync at render time — no extra useEffect needed
  createModeRef.current        = createMode;
  filteredIncidentsRef.current = filteredIncidents;

  const { high, medium, low } = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    for (const i of filteredIncidents as any[]) {
      if (i.priority in counts) counts[i.priority as keyof typeof counts]++;
    }
    return counts;
  }, [filteredIncidents]);

  // ── Map init ──────────────────────────────────────────
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
      layersInitializedRef.current = false;
    };
  }, []);

  // ── One-time layers + event handlers ─────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const initialGeojson = buildGeojson(filteredIncidentsRef.current);

    const pinDefs: [string, string][] = [
      ["pin-high",    "#dc2626"],
      ["pin-medium",  "#d97706"],
      ["pin-low",     "#2563eb"],
      ["pin-default", "#64748b"],
    ];
    pinDefs.forEach(([id, color]) => {
      if (!map.hasImage(id)) map.addImage(id, createWarningIcon(color));
    });

    map.addSource("incidents", {
      type: "geojson", data: initialGeojson,
      cluster: true, clusterMaxZoom: 14, clusterRadius: 50,
    });

    map.addLayer({
      id: "cluster-shadow", type: "circle", source: "incidents",
      filter: ["has", "point_count"],
      paint: {
        "circle-color":   "#2563eb",
        "circle-radius":  ["step", ["get", "point_count"], 26, 5, 34, 15, 42],
        "circle-opacity": 0.15,
        "circle-stroke-width": 0,
      },
    });

    map.addLayer({
      id: "clusters", type: "circle", source: "incidents",
      filter: ["has", "point_count"],
      paint: {
        "circle-color":        ["step", ["get", "point_count"], "#3b82f6", 5, "#2563eb", 15, "#1d4ed8"],
        "circle-radius":       ["step", ["get", "point_count"], 20, 5, 28, 15, 36],
        "circle-stroke-width": 2.5,
        "circle-stroke-color": "#fff",
      },
    });

    map.addLayer({
      id: "cluster-count", type: "symbol", source: "incidents",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size":  13,
        "text-font":  ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      },
      paint: { "text-color": "#fff" },
    });

    map.addLayer({
      id: "unclustered-point", type: "symbol", source: "incidents",
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": [
          "match", ["get", "priority"],
          "high", "pin-high", "medium", "pin-medium", "low", "pin-low",
          "pin-default",
        ],
        "icon-size":             1,
        "icon-anchor":           "center",
        "icon-allow-overlap":    true,
        "icon-ignore-placement": true,
      },
    });

    map.on("click", "clusters", (e) => {
      if (createModeRef.current) return;
      const [feature] = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
      if (!feature) return;
      const source = map.getSource("incidents") as mapboxgl.GeoJSONSource;
      source.getClusterExpansionZoom(feature.properties?.cluster_id, (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
          zoom:   zoom ?? 14,
        });
      });
    });

    map.on("click", "unclustered-point", (e) => {
      if (createModeRef.current) return;
      const feature = e.features?.[0];
      if (!feature || feature.geometry.type !== "Point") return;

      const props = feature.properties as Record<string, string>;
      const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates;

      const popup = new mapboxgl.Popup({ offset: [0, -20], maxWidth: "260px" })
        .setLngLat([lng, lat])
        .setHTML(buildPopupHtml(props));

      popup.on("open", () => {
        popup.getElement()
          ?.querySelector<HTMLButtonElement>(`[data-id="${props.id}"]`)
          ?.addEventListener("click", () => {
            routerRef.current.push(`/incidents/${props.id}`);
          });
      });

      popup.addTo(map);
    });

    ["clusters", "unclustered-point"].forEach((layer) => {
      map.on("mouseenter", layer, () => { if (!createModeRef.current) map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", layer, () => { map.getCanvas().style.cursor = ""; });
    });

    layersInitializedRef.current = true;

    const bounds = new mapboxgl.LngLatBounds();
    initialGeojson.features.forEach((f) => bounds.extend(f.geometry.coordinates));
    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 100, maxZoom: 15, duration: 1000 });
  }, [mapLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync data when filters change ────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !layersInitializedRef.current) return;
    (map.getSource("incidents") as mapboxgl.GeoJSONSource).setData(buildGeojson(filteredIncidents));
  }, [filteredIncidents]);

  // ── Create mode click handler ─────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !createMode) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      setCreateCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      setCreateMode(false);
    };

    map.on("click", handleClick);
    return () => { map.off("click", handleClick); };
  }, [mapLoaded, createMode]);

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
