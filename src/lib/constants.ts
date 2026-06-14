import type { BadgeVariant } from "@/components/incidents/Badge";

export const STATUS_OPTIONS = [
  { value: "open",     label: "Abierta",  badgeVariant: "open"     as BadgeVariant },
  { value: "on_pause", label: "En pausa", badgeVariant: "on_pause" as BadgeVariant },
  { value: "closed",   label: "Cerrada",  badgeVariant: "closed"   as BadgeVariant },
] as const;

export const PRIORITY_OPTIONS = [
  { value: "high",   label: "Alta",  badgeVariant: "high"   as BadgeVariant },
  { value: "medium", label: "Media", badgeVariant: "medium" as BadgeVariant },
  { value: "low",    label: "Baja",  badgeVariant: "low"    as BadgeVariant },
] as const;

export type IncidentStatus   = (typeof STATUS_OPTIONS)[number]["value"];
export type IncidentPriority = (typeof PRIORITY_OPTIONS)[number]["value"];

export function getStatusOption(value: string) {
  return STATUS_OPTIONS.find((o) => o.value === value) ?? STATUS_OPTIONS[0];
}

export function getPriorityOption(value: string) {
  return PRIORITY_OPTIONS.find((o) => o.value === value) ?? PRIORITY_OPTIONS[1];
}
