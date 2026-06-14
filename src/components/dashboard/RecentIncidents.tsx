"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/incidents/Badge";
import { getStatusOption, getPriorityOption } from "@/lib/constants";
import styles from "./RecentIncidents.module.scss";

interface Props {
  incidents: any[];
}

export default function RecentIncidents({ incidents }: Props) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Proyecto</th>
            <th>Estado</th>
            <th>Prioridad</th>
          </tr>
        </thead>
        <tbody>
          {(incidents || []).map((incident) => {
            const statusOpt   = getStatusOption(incident.status);
            const priorityOpt = getPriorityOption(incident.priority);
            return (
              <tr
                key={incident.id}
                className={styles.row}
                onClick={() => router.push(`/incidents/${incident.id}`)}
              >
                <td className={styles.title}>{incident.title}</td>
                <td>{incident.project?.name}</td>
                <td>
                  <Badge label={statusOpt.label} variant={statusOpt.badgeVariant} />
                </td>
                <td>
                  <Badge label={priorityOpt.label} variant={priorityOpt.badgeVariant} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
