import styles from "./RecentIncidents.module.scss";

interface Props {
    incidents: any[];
}

export default function RecentIncidents({
    incidents,
}: Props) {
    const getStatusClass = (status: string) => {
        switch (status) {
            case "open":
                return styles.open;

            case "closed":
                return styles.closed;

            case "on_pause":
                return styles.paused;

            default:
                return "";
        }
    };

    const getPriorityClass = (priority: string) => {
        switch (priority) {
            case "high":
                return styles.high;

            case "medium":
                return styles.medium;

            case "low":
                return styles.low;

            default:
                return "";
        }
    };

    const formatLabel = (
        value: string
    ) => {
        return value
            .replace("_", " ")
            .replace(
                /\b\w/g,
                (char) => char.toUpperCase()
            );
    };
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
                    {(incidents || []).map((incident) => (
                        <tr key={incident.id}>
                            <td>{incident.title}</td>

                            <td>
                                {incident.project?.name}
                            </td>

                            <td>
                                <span
                                    className={`${styles.badge} ${getStatusClass(
                                        incident.status
                                    )}`}
                                >
                                    {formatLabel(incident.status)}
                                </span>
                            </td>

                            <td>
                                <span
                                    className={`${styles.badge} ${getPriorityClass(
                                        incident.priority
                                    )}`}
                                >
                                    {formatLabel(incident.priority)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}