"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import MapLegend from "./MapLegend";
import MapStats from "./MapStats";
import MapFilters from "./MapFilters";
import MapSearch from "./MapSearch";
import { useIncidentStore } from "@/store/incidents.store";
import { useRouter } from "next/navigation";

import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function IncidentMap() {
  const router = useRouter();

  const mapContainer =
    useRef<HTMLDivElement>(null);

  const mapRef =
    useRef<mapboxgl.Map | null>(null);

  const markersRef =
    useRef<mapboxgl.Marker[]>([]);

  const [mapLoaded, setMapLoaded] =
    useState(false);

  const [priority, setPriority] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  const [search, setSearch] =
    useState("");



  const incidents =
    useIncidentStore(
      (state) =>
        state.incidents
    );

  const filteredIncidents =
    useMemo(() => {
      return incidents.filter(
        (incident: any) => {
          const priorityMatch =
            priority === "all" ||
            incident.priority === priority;

          const statusMatch =
            status === "all" ||
            incident.status === status;

          const searchMatch =
            incident.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            incident.project?.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            priorityMatch &&
            statusMatch &&
            searchMatch
          );
        }
      );
    }, [priority, status, search]);

  const high =
    filteredIncidents.filter(
      (i: any) =>
        i.priority === "high"
    ).length;

  const medium =
    filteredIncidents.filter(
      (i: any) =>
        i.priority === "medium"
    ).length;

  const low =
    filteredIncidents.filter(
      (i: any) =>
        i.priority === "low"
    ).length;

  // Crear mapa una sola vez
  useEffect(() => {
    if (
      !mapContainer.current ||
      mapRef.current
    ) {
      return;
    }

    const map =
      new mapboxgl.Map({
        container:
          mapContainer.current,
        style:
          "mapbox://styles/mapbox/light-v11",
        center: [
          -74.05772,
          4.652022,
        ],
        zoom: 12,
      });

    map.on("load", () => {
      map.resize();
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach(
        (marker) =>
          marker.remove()
      );

      map.remove();
      mapRef.current = null;
    };
  }, []);


  // Crear marcadores
  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    if (!mapLoaded) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(
      (marker) => marker.remove()
    );

    markersRef.current = [];

    const bounds =
      new mapboxgl.LngLatBounds();

    filteredIncidents.forEach(
      (incident: any) => {
        if (
          !incident.coordinates?.lat ||
          !incident.coordinates?.lng
        ) {
          return;
        }

        const markerElement =
          document.createElement(
            "div"
          );

        markerElement.style.width =
          "14px";

        markerElement.style.height =
          "14px";

        markerElement.style.borderRadius =
          "50%";

        markerElement.style.cursor =
          "pointer";


        markerElement.style.border =
          "2px solid white";

        markerElement.style.boxShadow =
          "0 0 6px rgba(0,0,0,.25)";

        switch (
        incident.priority
        ) {
          case "high":
            markerElement.style.background =
              "#ef4444";
            break;

          case "medium":
            markerElement.style.background =
              "#f59e0b";
            break;

          default:
            markerElement.style.background =
              "#3b82f6";
        }

        // Separación visual mínima
        const lat =
          incident.coordinates.lat +
          (Math.random() - 0.5) *
          0.0005;

        const lng =
          incident.coordinates.lng +
          (Math.random() - 0.5) *
          0.0005;

        const popup =
          new mapboxgl.Popup({
            offset: 25,
          }).setHTML(`
    <div style="min-width:220px">
      <h3 style="
        font-size:16px;
        font-weight:600;
        margin-bottom:10px;
      ">
        ${incident.title}
      </h3>

      <p>
        <strong>Proyecto:</strong><br/>
        ${incident.project?.name ?? "Sin proyecto"}
      </p>

      <p>
        <strong>Estado:</strong>
        ${incident.status}
      </p>

      <p>
        <strong>Prioridad:</strong>
        ${incident.priority}
      </p>

      <button
        id="view-${incident.id}"
        style="
          margin-top:10px;
          width:100%;
          padding:8px;
          border:none;
          border-radius:8px;
          background:#2563eb;
          color:white;
          cursor:pointer;
        "
      >
        Ver incidencia
      </button> 
    </div>
  `);

        bounds.extend([
          lng,
          lat,
        ]);

        const marker =
          new mapboxgl.Marker(
            markerElement
          )
            .setLngLat([
              lng,
              lat,
            ])
            .setPopup(popup)
            .addTo(map);

        markersRef.current.push(
          marker
        );

        popup.on("open", () => {
          const button =
            document.getElementById(
              `view-${incident.id}`
            );

          if (button) {
            button.addEventListener(
              "click",
              () => {
                router.push(
                  `/incidents/${incident.id}`
                );
              }
            );
          }
        });
      }
    );

    // Auto Zoom
    if (
      filteredIncidents.length > 0 &&
      !bounds.isEmpty()
    ) {
      map.fitBounds(bounds, {
        padding: 100,
        maxZoom: 16,
        duration: 1200,
      });
    }
  }, [
    filteredIncidents,
    mapLoaded,
  ]);

  if (
    !process.env
      .NEXT_PUBLIC_MAPBOX_TOKEN
  ) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "500px",
          borderRadius: "16px",
          background: "#f8fafc",
        }}
      >
        <h3>
          Configura
          NEXT_PUBLIC_MAPBOX_TOKEN
        </h3>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        padding: "16px",
      }}
    >
      <MapStats
        high={high}
        medium={medium}
        low={low}
      />
      <MapSearch
        value={search}
        onChange={setSearch}
      />

      <MapFilters
        priority={priority}
        status={status}
        setPriority={
          setPriority
        }
        setStatus={setStatus}
      />

      <MapLegend />

      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "60vh",
          minHeight: "500px",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      />
    </div>
  );
}