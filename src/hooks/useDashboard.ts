"use client";

import { useMemo } from "react";
import { useIncidentStore } from "@/store/incidents.store";

export function useDashboard() {
  const incidents = useIncidentStore(
    (state) => state.incidents
  );

  const total = incidents.length;

  const open = incidents.filter(
    (incident) =>
      incident.status === "open"
  ).length;

  const closed = incidents.filter(
    (incident) =>
      incident.status === "closed"
  ).length;

  const paused = incidents.filter(
    (incident) =>
      incident.status === "on_pause"
  ).length;

  const high = incidents.filter(
    (incident) =>
      incident.priority === "high"
  ).length;

  const medium = incidents.filter(
    (incident) =>
      incident.priority === "medium"
  ).length;

  const low = incidents.filter(
    (incident) =>
      incident.priority === "low"
  ).length;

  const projectStats = useMemo(() => {
    const projects: Record<
      string,
      number
    > = {};

    incidents.forEach(
      (incident: any) => {
        const projectName =
          incident.project?.name ??
          "Sin proyecto";

        projects[projectName] =
          (projects[
            projectName
          ] || 0) + 1;
      }
    );



    return Object.entries(
      projects
    ).map(
      ([name, total]) => ({
        name,
        total,
      })
    );
  }, [incidents]);

  const mostAffectedProject =
    [...projectStats].sort(
      (a, b) =>
        b.total - a.total
    )[0];


  const critical = incidents.filter(
    (incident) =>
      incident.priority === "high" &&
      incident.status === "open"
  ).length;

  const latestIncident =
    [...incidents].sort(
      (a: any, b: any) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    )[0];

  const openPercentage =
    total > 0
      ? (
        (open * 100) /
        total
      ).toFixed(1)
      : "0";

  const closedPercentage =
    total > 0
      ? (
        (closed * 100) /
        total
      ).toFixed(1)
      : "0";

  const recentIncidents =
    useMemo(() => {
      return [...incidents]
        .sort(
          (
            a: any,
            b: any
          ) =>
            new Date(
              b.createdAt
            ).getTime() -
            new Date(
              a.createdAt
            ).getTime()
        )
        .slice(0, 10);
    }, [incidents]);

  return {
    incidents,

    total,
    open,
    closed,
    paused,

    high,
    medium,
    low,
    critical,

    projectStats,
    recentIncidents,

    mostAffectedProject,
    latestIncident,
    openPercentage,
    closedPercentage,
  };
}