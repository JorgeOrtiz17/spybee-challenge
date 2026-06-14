"use client";

import { useMemo } from "react";
import { useIncidentStore } from "@/store/incidents.store";

export function useDashboard() {
  const incidents = useIncidentStore((state) => state.incidents);

  const total = incidents.length;
  const open = incidents.filter((i) => i.status === "open").length;
  const closed = incidents.filter((i) => i.status === "closed").length;
  const paused = incidents.filter((i) => i.status === "on_pause").length;
  const high = incidents.filter((i) => i.priority === "high").length;
  const medium = incidents.filter((i) => i.priority === "medium").length;
  const low = incidents.filter((i) => i.priority === "low").length;
  const critical = incidents.filter(
    (i) => i.priority === "high" && i.status === "open"
  ).length;

  const openPercentage = total > 0 ? ((open * 100) / total).toFixed(1) : "0";
  const closedPercentage = total > 0 ? ((closed * 100) / total).toFixed(1) : "0";

  const projectStats = useMemo(() => {
    const counts: Record<string, number> = {};
    incidents.forEach((incident: any) => {
      const name = incident.project?.name ?? "Sin proyecto";
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([name, total]) => ({ name, total }));
  }, [incidents]);

  const mostAffectedProject = [...projectStats].sort((a, b) => b.total - a.total)[0];

  const latestIncident = [...incidents].sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];

  const recentIncidents = useMemo(
    () =>
      [...incidents]
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10),
    [incidents]
  );

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
