import { useState } from "react";

export function useMapFilters() {
  const [priority, setPriority] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  return {
    priority,
    status,

    setPriority,
    setStatus,
  };
}